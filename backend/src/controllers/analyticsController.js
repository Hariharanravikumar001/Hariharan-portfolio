const Visitor = require('../models/Visitor');
const Download = require('../models/Download');
const Project = require('../models/Project');
const Resume = require('../models/Resume');
const Message = require('../models/Message');

// @desc    Get dashboard overview stats
// @route   GET /api/analytics/overview
// @access  Private/Admin
const getDashboardOverview = async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        data: {
          totalVisitors: 12,
          todayVisitors: 2,
          totalProjects: 3,
          totalResumes: 5,
          totalMessages: 1,
          unreadMessages: 1,
          totalDownloads: 0,
        },
      });
    }

    const [
      totalVisitors,
      totalProjects,
      totalResumes,
      totalMessages,
      unreadMessages,
      totalDownloads,
    ] = await Promise.all([
      Visitor.countDocuments(),
      Project.countDocuments(),
      Resume.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({ isRead: false }),
      Download.countDocuments(),
    ]);

    // Calculate today's visitors
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayVisitors = await Visitor.countDocuments({
      visitedAt: { $gte: startOfToday },
    });

    res.json({
      success: true,
      data: {
        totalVisitors,
        todayVisitors,
        totalProjects,
        totalResumes,
        totalMessages,
        unreadMessages,
        totalDownloads,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed visitor analytics (daily, device, country)
// @route   GET /api/analytics/visitors
// @access  Private/Admin
const getVisitorAnalytics = async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        data: {
          deviceStats: [
            { device: 'Desktop', count: 642 },
            { device: 'Mobile', count: 348 },
            { device: 'Tablet', count: 52 },
          ],
          countryStats: [
            { country: 'India', count: 580 },
            { country: 'United States', count: 210 },
            { country: 'Germany', count: 95 },
            { country: 'United Kingdom', count: 65 },
            { country: 'Singapore', count: 42 },
          ],
          browserStats: [
            { browser: 'Chrome', count: 680 },
            { browser: 'Safari', count: 180 },
            { browser: 'Firefox', count: 90 },
            { browser: 'Edge', count: 60 },
          ],
          dailyTraffic: [
            { date: '2026-08-29', visits: 18 },
            { date: '2026-08-30', visits: 24 },
            { date: '2026-08-31', visits: 32 },
            { date: '2026-09-01', visits: 45 },
            { date: '2026-09-02', visits: 38 },
            { date: '2026-09-03', visits: 42 },
            { date: '2026-09-04', visits: 28 },
          ],
          downloadsByCategory: [
            { category: 'Full Stack Developer Resume', count: 142 },
            { category: 'MERN Stack Developer Resume', count: 98 },
            { category: 'Frontend Developer Resume', count: 84 },
            { category: 'Software Engineer Resume', count: 65 },
            { category: 'Technical Support Engineer Resume', count: 41 },
          ],
        },
      });
    }

    // 1. Device breakdown
    const deviceStats = await Visitor.aggregate([
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $project: { device: '$_id', count: 1, _id: 0 } },
    ]);

    // 2. Country breakdown
    const countryStats = await Visitor.aggregate([
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
      { $project: { country: '$_id', count: 1, _id: 0 } },
    ]);

    // 3. Browser breakdown
    const browserStats = await Visitor.aggregate([
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
      { $project: { browser: '$_id', count: 1, _id: 0 } },
    ]);

    // 4. Daily traffic for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailyTraffic = await Visitor.aggregate([
      { $match: { visitedAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$visitedAt' } },
          visits: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', visits: 1, _id: 0 } },
    ]);

    // 5. Download stats by resume category
    const downloadsByCategory = await Download.aggregate([
      { $group: { _id: '$resumeCategory', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } },
    ]);

    res.json({
      success: true,
      data: {
        deviceStats,
        countryStats,
        browserStats,
        dailyTraffic,
        downloadsByCategory,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public stats for Home page (total visitors, total projects)
// @route   GET /api/analytics/public-counter
// @access  Public
const getPublicCounter = async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const { mockProjects } = require('../utils/mockStore');
      return res.json({
        success: true,
        data: {
          visitorCount: 1,
          downloadCount: 0,
          projectCount: mockProjects.length,
        },
      });
    }

    const totalVisitors = await Visitor.countDocuments();
    const totalDownloads = await Download.countDocuments();
    const totalProjects = await Project.countDocuments();

    res.json({
      success: true,
      data: {
        visitorCount: totalVisitors,
        downloadCount: totalDownloads,
        projectCount: totalProjects,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardOverview,
  getVisitorAnalytics,
  getPublicCounter,
};
