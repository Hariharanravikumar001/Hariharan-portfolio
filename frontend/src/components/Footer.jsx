import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Instagram, Facebook, Mail, Phone, Heart, Users, ShieldCheck } from 'lucide-react';
import NaukriIcon from './NaukriIcon';
import { analyticsApi, profileApi } from '../services/api';

const Footer = () => {
  const [visitorStats, setVisitorStats] = useState({ visitorCount: 0, downloadCount: 0 });
  const [contactInfo, setContactInfo] = useState({
    email: 'hariharan@hariharan.dev',
    phone: '+91 98765 43210',
    github: 'https://github.com/hariharan-ravikumar',
    linkedin: 'https://linkedin.com/in/hariharan-ravikumar',
    naukri: 'https://www.naukri.com/mnjuser/profile',
    instagram: 'https://instagram.com/hariharan',
    facebook: 'https://facebook.com/hariharan',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [counterRes, profileRes] = await Promise.allSettled([
          analyticsApi.getPublicCounter(),
          profileApi.get(),
        ]);
        if (counterRes.status === 'fulfilled' && counterRes.value.data?.success) {
          setVisitorStats(counterRes.value.data.data);
        }
        if (profileRes.status === 'fulfilled' && profileRes.value.data?.success) {
          const links = profileRes.value.data.data.socialLinks || {};
          setContactInfo((prev) => ({
            email: links.email || prev.email,
            phone: links.phone || prev.phone,
            github: links.github || prev.github,
            linkedin: links.linkedin || prev.linkedin,
            naukri: links.naukri || prev.naukri,
            instagram: links.instagram || prev.instagram,
            facebook: links.facebook || prev.facebook,
          }));
        }
      } catch (err) {
        // Fallback default numbers
      }
    };
    fetchData();
  }, []);

  return (
    <footer
      style={{
        marginTop: '80px',
        borderTop: '1px solid var(--border-glass)',
        backgroundColor: 'var(--bg-secondary)',
        paddingTop: '60px',
        paddingBottom: '30px',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px',
            marginBottom: '50px',
          }}
        >
          {/* Column 1: Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '1rem',
                }}
              >
                HR
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                Hariharan Ravikumar
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Full Stack Software Engineer & MERN Specialist dedicated to engineering scalable web architectures, clean code, and elegant user interfaces.
            </p>
            {/* Live Visitor Counter Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '20px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-glass)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
              }}
            >
              <Users size={16} color="var(--accent-cyan)" />
              <span>Total Visitors: <strong style={{ color: 'var(--accent-cyan)' }}>{visitorStats.visitorCount.toLocaleString()}</strong></span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1rem', fontWeight: 700 }}>
              Quick Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <Link to="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>About & Career Story</Link>
              <Link to="/skills" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Technical Skillset</Link>
              <Link to="/projects" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Featured Projects</Link>
              <Link to="/experience" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Work Experience</Link>
              <Link to="/resume" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Resumes & CVs</Link>
              <Link to="/certificates" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Certifications</Link>
              <Link to="/contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Get in Touch</Link>
            </div>
          </div>

          {/* Column 3: Contact & Socials */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1rem', fontWeight: 700 }}>
              Connect & Inquiries
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} color="var(--accent-cyan)" />
                <a href={`mailto:${contactInfo.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {contactInfo.email}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} color="var(--accent-cyan)" />
                <a href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {contactInfo.phone}
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
              <a
                href={contactInfo.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                title="GitHub Profile"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                }}
              >
                <Github size={18} />
              </a>
              <a
                href={contactInfo.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn Profile"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0a66c2',
                  textDecoration: 'none',
                }}
              >
                <Linkedin size={18} />
              </a>
              <a
                href={contactInfo.naukri}
                target="_blank"
                rel="noreferrer"
                aria-label="Naukri"
                title="Naukri Profile"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                }}
              >
                <NaukriIcon size={18} />
              </a>
              <a
                href={contactInfo.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                title="Instagram Profile"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#e4405f',
                  textDecoration: 'none',
                }}
              >
                <Instagram size={18} />
              </a>
              <a
                href={contactInfo.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                title="Facebook Profile"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1877f2',
                  textDecoration: 'none',
                }}
              >
                <Facebook size={18} />
              </a>
              <Link
                to="/admin/login"
                aria-label="Admin Portal"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                }}
              >
                <ShieldCheck size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-glass)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} Hariharan Ravikumar. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Engineered with <Heart size={14} color="#f43f5e" fill="#f43f5e" /> using React, Node.js & MongoDB Atlas.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
