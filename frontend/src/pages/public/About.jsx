import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Briefcase,
  Trophy,
  CheckCircle2,
  Globe,
  Award,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { profileApi, experiencesApi } from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const About = () => {
  useDocumentTitle('About Me | Full Stack Developer');
  const [profile, setProfile] = useState(null);
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    const loadAboutData = async () => {
      try {
        const [profRes, expRes] = await Promise.all([
          profileApi.get(),
          experiencesApi.getAll(),
        ]);
        if (profRes.data.success) setProfile(profRes.data.data);
        if (expRes.data.success) setExperiences(expRes.data.data);
      } catch (err) {
        console.error('About data load error:', err);
      }
    };
    loadAboutData();
  }, []);

  return (
    <div className="container animate-fade-in" style={{ padding: '60px 20px 100px 20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <span className="badge" style={{ marginBottom: '10px' }}>Career & Background</span>
        <h1 className="section-title">About Hariharan Ravikumar</h1>
        <p className="section-subtitle" style={{ maxWidth: '650px', margin: '0 auto' }}>
          Get to know my journey, engineering values, academic milestones, and core strengths.
        </p>
      </div>

      {/* Main Bio Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          marginBottom: '50px',
        }}
      >
        {/* Personal Intro Card */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={22} color="var(--accent-cyan)" />
            <span>Personal Introduction</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.96rem', marginBottom: '16px' }}>
            {profile?.about ||
              'I am Hariharan Ravikumar, a dedicated and solution-oriented Full Stack Developer with expertise in React, Node.js, Express, and MongoDB. I thrive on architecting clean, maintainable code, building responsive interfaces, and solving real-world technical problems.'}
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.96rem' }}>
            My engineering philosophy centers around simplicity, performance optimization, and strong software design principles. When I am not writing code, I actively explore emerging web patterns, contribute to open source, and publish developer articles.
          </p>
        </div>

        {/* Career Objective Card */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={22} color="var(--accent-purple)" />
            <span>Career Objective</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.96rem', marginBottom: '24px' }}>
            {profile?.careerObjective ||
              'To secure a challenging role as a Full Stack / Software Engineer where I can leverage my expertise in modern web technologies, contribute to impactful products, and grow alongside industry leaders.'}
          </p>
          <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.92rem', marginBottom: '6px' }}>
              Target Roles:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['Full Stack Engineer', 'MERN Stack Developer', 'Frontend Developer', 'Software Engineer'].map((role, i) => (
                <span key={i} className="badge">{role}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Education & Experience Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          marginBottom: '50px',
        }}
      >
        {/* Education Timeline */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GraduationCap size={22} color="var(--accent-cyan)" />
            <span>Education Timeline</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {(profile?.education || [
              {
                institution: 'Anna University / Regional Campus',
                degree: 'Bachelor of Engineering (B.E.)',
                field: 'Computer Science and Engineering',
                startYear: '2020',
                endYear: '2024',
                grade: '8.6 CGPA',
                description: 'Specialized in Data Structures, Database Systems, and Web Engineering.',
              },
              {
                institution: 'Higher Secondary School',
                degree: 'HSC (+2)',
                field: 'Computer Science & Mathematics',
                startYear: '2018',
                endYear: '2020',
                grade: '92.5%',
                description: 'Graduated with Distinction in Mathematics and Computer Science.',
              },
            ]).map((edu, idx) => (
              <div
                key={idx}
                style={{
                  borderLeft: '2px solid var(--accent-cyan)',
                  paddingLeft: '18px',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: '-6px',
                    top: '4px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: 'var(--accent-cyan)',
                  }}
                />
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '2px' }}>
                  {edu.startYear} - {edu.endYear}
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0' }}>
                  {edu.degree} &bull; {edu.field}
                </h4>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {edu.institution} {edu.grade && <strong style={{ color: 'var(--accent-emerald)' }}>({edu.grade})</strong>}
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0 }}>
                  {edu.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Internship & Work Experience */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Briefcase size={22} color="var(--accent-purple)" />
            <span>Internships & Experience</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {experiences.map((exp, idx) => (
              <div
                key={exp._id || idx}
                style={{
                  borderLeft: '2px solid var(--accent-purple)',
                  paddingLeft: '18px',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: '-6px',
                    top: '4px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: 'var(--accent-purple)',
                  }}
                />
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', fontWeight: 600, marginBottom: '2px' }}>
                  {exp.startDate} - {exp.endDate}
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0' }}>
                  {exp.role}
                </h4>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  {exp.company} &bull; {exp.type}
                </div>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {exp.responsibilities?.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements, Strengths & Languages */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
        }}
      >
        {/* Achievements */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy size={20} color="var(--accent-amber)" />
            <span>Key Achievements</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(profile?.achievements || []).map((ach, i) => (
              <div key={i} style={{ background: 'var(--bg-input)', padding: '14px', borderRadius: '10px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{ach.title}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)', margin: '2px 0 6px 0' }}>
                  {ach.organization} &bull; {ach.year}
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{ach.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={20} color="var(--accent-emerald)" />
            <span>Core Strengths</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(profile?.strengths || [
              'Problem Solving & Clean Code Architecture',
              'End-to-End Full Stack Web Application Development',
              'Responsive Glassmorphism & Modern UI/UX Implementation',
              'REST API Design & Database Schema Optimization',
              'Cross-browser Compatibility & Performance Auditing',
            ]).map((strength, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" style={{ flexShrink: 0 }} />
                <span>{strength}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Languages Known */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={20} color="var(--accent-cyan)" />
            <span>Languages Known</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {(profile?.languages || [
              { language: 'English', proficiency: 'Professional Working Proficiency', level: 95 },
              { language: 'Tamil', proficiency: 'Native / Bilingual', level: 100 },
            ]).map((lang, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{lang.language}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>{lang.proficiency}</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${lang.level || 90}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
