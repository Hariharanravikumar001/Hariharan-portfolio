const Message = require('../models/Message');
const { sendAdminContactNotification, sendUserAutoReply } = require('../services/emailService');
const { sendWhatsAppContactAlert } = require('../services/whatsappService');
const { createObjectCsvStringifier } = require('csv-writer');

// @desc    Submit contact message from portfolio
// @route   POST /api/contact
// @access  Public
const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, company, subject, message, website_trap } = req.body;

    // Anti-spam Honeypot Check: If the hidden honeypot field is populated, silently acknowledge without saving
    if (website_trap && String(website_trap).trim().length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Thank you! Your message has been sent successfully.',
      });
    }

    // Strict validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Valid email address is required' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    // Save to Database
    const mongoose = require('mongoose');
    let newMessage;
    if (mongoose.connection.readyState !== 1) {
      const { mockMessages } = require('../utils/mockStore');
      newMessage = {
        _id: 'm-' + Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : '',
        company: company ? company.trim() : '',
        subject: subject ? subject.trim() : 'General Inquiry',
        message: message.trim(),
        isRead: false,
        status: 'new',
        createdAt: new Date(),
      };
      mockMessages.unshift(newMessage);
    } else {
      newMessage = await Message.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : '',
        company: company ? company.trim() : '',
        subject: subject ? subject.trim() : 'General Inquiry',
        message: message.trim(),
      });
    }

    // Send notifications concurrently in the background without blocking response
    const payload = {
      name: newMessage.name,
      email: newMessage.email,
      phone: newMessage.phone,
      company: newMessage.company,
      subject: newMessage.subject,
      message: newMessage.message,
    };

    setImmediate(async () => {
      try {
        await Promise.allSettled([
          sendAdminContactNotification(payload),
          sendUserAutoReply(payload),
          sendWhatsAppContactAlert(payload),
        ]);
      } catch (notifyErr) {
        console.error('[Notification Dispatch Error]:', notifyErr.message);
      }
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been sent successfully.',
      data: { id: newMessage._id },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all messages (Admin)
// @route   GET /api/contact/messages
// @access  Private/Admin
const getMessages = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const { mockMessages } = require('../utils/mockStore');
      let filtered = [...mockMessages];
      if (status && status !== 'all') {
        filtered = filtered.filter((m) => m.status === status);
      }
      if (search) {
        filtered = filtered.filter((m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.email.toLowerCase().includes(search.toLowerCase()) ||
          m.message.toLowerCase().includes(search.toLowerCase())
        );
      }
      return res.json({ success: true, count: filtered.length, data: filtered });
    }

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const messages = await Message.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark message as read / update status
// @route   PATCH /api/contact/messages/:id
// @access  Private/Admin
const updateMessageStatus = async (req, res, next) => {
  try {
    const { isRead, status } = req.body;
    const update = {};
    if (typeof isRead === 'boolean') update.isRead = isRead;
    if (status) update.status = status;

    const message = await Message.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message
// @route   DELETE /api/contact/messages/:id
// @access  Private/Admin
const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Export messages as CSV
// @route   GET /api/contact/export-csv
// @access  Private/Admin
const exportMessagesCSV = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'createdAt', title: 'DATE' },
        { id: 'name', title: 'NAME' },
        { id: 'email', title: 'EMAIL' },
        { id: 'phone', title: 'PHONE' },
        { id: 'company', title: 'COMPANY' },
        { id: 'subject', title: 'SUBJECT' },
        { id: 'message', title: 'MESSAGE' },
        { id: 'status', title: 'STATUS' },
      ],
    });

    const records = messages.map((m) => ({
      createdAt: m.createdAt.toISOString(),
      name: m.name,
      email: m.email,
      phone: m.phone || '',
      company: m.company || '',
      subject: m.subject || '',
      message: m.message.replace(/\r?\n|\r/g, ' '),
      status: m.status,
    }));

    const header = csvStringifier.getHeaderString();
    const body = csvStringifier.stringifyRecords(records);
    const csvData = header + body;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Hariharan_Portfolio_Messages_${Date.now()}.csv"`
    );
    res.send(csvData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContactMessage,
  getMessages,
  updateMessageStatus,
  deleteMessage,
  exportMessagesCSV,
};
