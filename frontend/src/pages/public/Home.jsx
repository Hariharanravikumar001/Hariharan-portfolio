import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Download,
  Mail,
  Github,
  Linkedin,
  Instagram,
  Facebook,
  Users,
  Code2,
  Briefcase,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Award,
} from 'lucide-react';
import NaukriIcon from '../../components/NaukriIcon';
import { profileApi, projectsApi, analyticsApi } from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const Home = () => {
  useDocumentTitle('Home | Full Stack Developer & MERN Specialist');
  const [profile, setProfile] = useState(null);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [visitorStats, setVisitorStats] = useState({ visitorCount: 0, downloadCount: 0, projectCount: 3 });
  const [typeIndex, setTypeIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const defaultTitles = [
    'Full Stack Software Engineer',
    'MERN Stack Specialist',
    'React.js & Node.js Developer',
    'Technical Support Engineer',
  ];

  // Fetch initial profile & stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, projRes, countRes] = await Promise.all([
          profileApi.get(),
          projectsApi.getAll({ featured: 'true' }),
          analyticsApi.getPublicCounter(),
        ]);
        if (profRes.data.success) setProfile(profRes.data.data);
        if (projRes.data.success) setFeaturedProjects(projRes.data.data.slice(0, 3));
        if (countRes.data.success) setVisitorStats(countRes.data.data);
      } catch (err) {
        console.error('Home load error:', err);
      }
    };
    fetchData();
  }, []);

  // Typing animation effect
  const titles = profile?.titles?.length ? profile.titles : defaultTitles;

  useEffect(() => {
    if (subIndex === titles[typeIndex].length + 1 && !isDeleting) {
      const timeout = setTimeout(() => setIsDeleting(true), 1800);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setTypeIndex((prev) => (prev + 1) % titles.length);
      return;
    }

    const timeout = setTimeout(
      () => {
        setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
      },
      isDeleting ? 40 : 80
    );

    return () => clearTimeout(timeout);
  }, [subIndex, typeIndex, isDeleting, titles]);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{ paddingTop: '60px', paddingBottom: '90px' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '60px',
              alignItems: 'center',
            }}
          >
            {/* Left Col: Info & Intro */}
            <div>
              {/* Status pill & Visitor Counter */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: 'var(--accent-emerald)',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--accent-emerald)',
                      boxShadow: '0 0 8px var(--accent-emerald)',
                    }}
                  />
                  Available for Opportunities
                </span>

                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <Users size={14} color="var(--accent-cyan)" />
                  <span>{visitorStats.visitorCount.toLocaleString()} Profile Views</span>
                </span>
              </div>

              {/* Headline */}
              <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '16px' }}>
                Hi, I'm <br />
                <span className="text-gradient">
                  {profile?.name || 'Hariharan Ravikumar'}
                </span>
              </h1>

              {/* Animated Typing Title */}
              <div
                style={{
                  fontSize: 'clamp(1.2rem, 2.8vw, 1.7rem)',
                  fontWeight: 600,
                  color: 'var(--accent-cyan)',
                  minHeight: '2.2em',
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '20px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <span>{titles[typeIndex].substring(0, subIndex)}</span>
                <span className="cursor-blink" />
              </div>

              {/* Bio Paragraph */}
              <p
                style={{
                  fontSize: '1.05rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  marginBottom: '32px',
                  maxWidth: '560px',
                }}
              >
                {profile?.shortIntro ||
                  'Passionate Full Stack Developer specializing in building high-performance web applications, scalable MERN architectures, and delightful digital experiences.'}
              </p>

              {/* Call to Actions */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '36px' }}>
                <Link to="/contact" className="btn-primary">
                  <span>Hire Me</span>
                  <ArrowRight size={16} />
                </Link>

                <Link to="/resume" className="btn-secondary">
                  <Download size={16} />
                  <span>Download Resume</span>
                </Link>

                <Link to="/contact" className="btn-outline">
                  <Mail size={16} />
                  <span>Contact Me</span>
                </Link>
              </div>

              {/* Social Links */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Follow Me:</span>
                <a
                  href={profile?.socialLinks?.github || 'https://github.com/hariharan-ravikumar'}
                  target="_blank"
                  rel="noreferrer"
                  title="GitHub Profile"
                  style={{
                    color: 'var(--text-primary)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-glass)',
                    padding: '8px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Github size={18} />
                </a>
                <a
                  href={profile?.socialLinks?.linkedin || 'https://linkedin.com/in/hariharan-ravikumar'}
                  target="_blank"
                  rel="noreferrer"
                  title="LinkedIn Profile"
                  style={{
                    color: '#0a66c2',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-glass)',
                    padding: '8px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href={profile?.socialLinks?.naukri || 'https://www.naukri.com/mnjuser/profile'}
                  target="_blank"
                  rel="noreferrer"
                  title="Naukri Profile"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-glass)',
                    padding: '8px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <NaukriIcon size={18} />
                </a>
                <a
                  href={profile?.socialLinks?.instagram || 'https://instagram.com/hariharan'}
                  target="_blank"
                  rel="noreferrer"
                  title="Instagram Profile"
                  style={{
                    color: '#e4405f',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-glass)',
                    padding: '8px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Instagram size={18} />
                </a>
                <a
                  href={profile?.socialLinks?.facebook || 'https://facebook.com/hariharan'}
                  target="_blank"
                  rel="noreferrer"
                  title="Facebook Profile"
                  style={{
                    color: '#1877f2',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-glass)',
                    padding: '8px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Facebook size={18} />
                </a>
              </div>
            </div>

            {/* Right Col: Profile Photo with Glowing Frame & Quick Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  position: 'relative',
                  width: 'clamp(280px, 30vw, 360px)',
                  height: 'clamp(320px, 36vw, 420px)',
                }}
              >
                {/* Glow Backdrop */}
                <div
                  style={{
                    position: 'absolute',
                    inset: '-12px',
                    background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.4) 0%, rgba(99, 102, 241, 0.4) 100%)',
                    borderRadius: '28px',
                    filter: 'blur(20px)',
                    zIndex: 0,
                  }}
                />

                {/* Profile Photo Image */}
                <img
                  src={
                    profile?.profileImage ||
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={profile?.name || 'Hariharan Ravikumar'}
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '24px',
                    border: '2px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
                  }}
                />

                {/* Floating Experience Badge */}
                <div
                  className="glass-card"
                  style={{
                    position: 'absolute',
                    bottom: '-20px',
                    left: '-20px',
                    zIndex: 2,
                    padding: '12px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(56, 189, 248, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-cyan)',
                    }}
                  >
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Full Stack</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>MERN & React.js</div>
                  </div>
                </div>

                {/* Floating Degree / Quality Badge */}
                <div
                  className="glass-card"
                  style={{
                    position: 'absolute',
                    top: '-15px',
                    right: '-20px',
                    zIndex: 2,
                    padding: '12px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <Award size={20} color="var(--accent-purple)" />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>B.E. CSE</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Computer Science</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section style={{ padding: '90px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="badge" style={{ marginBottom: '8px' }}>Portfolio Highlights</span>
              <h2 className="section-title">Featured Projects</h2>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>
                A selection of high-impact full-stack and web applications I've engineered.
              </p>
            </div>
            <Link to="/projects" className="btn-secondary" style={{ fontSize: '0.9rem' }}>
              <span>View All Projects</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            {featuredProjects.map((project) => (
              <div key={project._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={project.image}
                    alt={project.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span className="badge" style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(15, 23, 42, 0.85)' }}>
                    {project.category}
                  </span>
                </div>

                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
                    {project.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '18px', flex: 1 }}>
                    {project.shortDescription}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                    {project.technologies?.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.75rem',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'var(--bg-input)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {project.liveDemo && (
                      <a href={project.liveDemo} target="_blank" rel="noreferrer" className="btn-primary" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
                        <ExternalLink size={14} />
                        <span>Live Demo</span>
                      </a>
                    )}
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noreferrer" className="btn-secondary" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
                        <Github size={14} />
                        <span>Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
