import React, { useState, useEffect } from 'react';
import {
  Code,
  Layout,
  Server,
  Database,
  Wrench,
  Sparkles,
  Layers,
  Terminal,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { skillsApi } from '../../services/api';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'Tools'];

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const categoryParam = activeCategory === 'All' ? undefined : activeCategory;
        const res = await skillsApi.getAll(categoryParam);
        if (res.data.success) {
          setSkills(res.data.data);
        }
      } catch (err) {
        console.error('Skills load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, [activeCategory]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Frontend':
        return <Layout size={18} color="var(--accent-cyan)" />;
      case 'Backend':
        return <Server size={18} color="var(--accent-purple)" />;
      case 'Database':
        return <Database size={18} color="var(--accent-emerald)" />;
      default:
        return <Wrench size={18} color="var(--accent-amber)" />;
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '60px 20px 100px 20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <span className="badge" style={{ marginBottom: '10px' }}>Core Competencies</span>
        <h1 className="section-title">Technical Skills & Expertise</h1>
        <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Proficiency levels and technical stacks mastered through practical development and production architectures.
        </p>

        {/* Category Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            marginTop: '32px',
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={activeCategory === cat ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '8px 20px', fontSize: '0.9rem' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        {skills.map((skill) => (
          <div
            key={skill._id}
            className="glass-card"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'var(--bg-input)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-glass)',
                  }}
                >
                  {getCategoryIcon(skill.category)}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {skill.name}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{skill.category}</span>
                </div>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: 'var(--accent-cyan)',
                }}
              >
                {skill.proficiency}%
              </span>
            </div>

            {/* Animated Progress Bar */}
            <div
              style={{
                width: '100%',
                height: '8px',
                background: 'var(--bg-input)',
                borderRadius: '6px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: `${skill.proficiency}%`,
                  height: '100%',
                  background:
                    skill.proficiency >= 90
                      ? 'linear-gradient(90deg, #38bdf8, #818cf8)'
                      : skill.proficiency >= 80
                      ? 'linear-gradient(90deg, #10b981, #38bdf8)'
                      : 'linear-gradient(90deg, #f59e0b, #38bdf8)',
                  borderRadius: '6px',
                  transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
