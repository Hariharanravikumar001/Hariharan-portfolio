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
  CheckCircle2,
} from 'lucide-react';
import { skillsApi } from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { SkillSkeletonCard } from '../../components/SkeletonLoader';

const Skills = () => {
  useDocumentTitle('Technical Skills & Stack');
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
        return <Layout size={20} color="var(--accent-cyan)" />;
      case 'Backend':
        return <Server size={20} color="var(--accent-purple)" />;
      case 'Database':
        return <Database size={20} color="var(--accent-emerald)" />;
      default:
        return <Wrench size={20} color="var(--accent-amber)" />;
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '60px 20px 100px 20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <span className="badge" style={{ marginBottom: '10px' }}>Core Competencies</span>
        <h1 className="section-title">Technical Skills & Expertise</h1>
        <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Technologies, frameworks, and engineering tools mastered through hands-on development and production architectures.
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

      {/* Skills Grid - Clean without percentages */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <SkillSkeletonCard key={i} />)
        ) : skills.length === 0 ? (
          <div className="glass-panel" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No skills found for this category.</p>
          </div>
        ) : (
          skills.map((skill) => (
          <div
            key={skill._id}
            className="glass-card"
            style={{
              padding: '20px 22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'var(--bg-input)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-glass)',
                  flexShrink: 0,
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '20px',
                  background: 'rgba(56, 189, 248, 0.1)',
                  color: 'var(--accent-cyan)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <CheckCircle2 size={12} />
                <span>Proficient</span>
              </span>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
};

export default Skills;
