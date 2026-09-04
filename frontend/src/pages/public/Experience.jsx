import React, { useState, useEffect } from 'react';
import { Briefcase, Calendar, MapPin, Award, CheckCircle, ExternalLink } from 'lucide-react';
import { experiencesApi } from '../../services/api';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await experiencesApi.getAll();
        if (res.data.success) {
          setExperiences(res.data.data);
        }
      } catch (err) {
        console.error('Experience load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  return (
    <div className="container animate-fade-in" style={{ padding: '60px 20px 100px 20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <span className="badge" style={{ marginBottom: '10px' }}>Career Journey</span>
        <h1 className="section-title">Work & Internship Experience</h1>
        <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Real-world industry contributions, technical responsibilities, and professional milestones.
        </p>
      </div>

      {/* Experience Timeline Cards */}
      <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {experiences.map((exp, idx) => (
          <div key={exp._id || idx} className="glass-panel" style={{ padding: '36px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span className="badge">{exp.type || 'Internship'}</span>
                  {exp.isCurrent && (
                    <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                      Current Role
                    </span>
                  )}
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                  {exp.role}
                </h2>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--accent-cyan)', margin: 0 }}>
                  {exp.company}
                </h3>
              </div>

              {/* Duration & Location */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={15} color="var(--accent-cyan)" />
                  <span>{exp.startDate} - {exp.endDate}</span>
                </div>
                {exp.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={15} color="var(--accent-purple)" />
                    <span>{exp.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Responsibilities */}
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>
                Key Responsibilities & Deliverables:
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {exp.responsibilities?.map((item, i) => (
                  <li key={i} style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Used */}
            {exp.technologies?.length > 0 && (
              <div style={{ marginTop: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: '4px' }}>
                  Technologies:
                </span>
                {exp.technologies.map((tech, i) => (
                  <span key={i} style={{ fontSize: '0.78rem', padding: '3px 10px', background: 'var(--bg-input)', borderRadius: '6px', color: 'var(--text-secondary)' }}>
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* Certificate Link if present */}
            {exp.certificateUrl && (
              <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
                <a
                  href={exp.certificateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline"
                  style={{ display: 'inline-flex', fontSize: '0.82rem' }}
                >
                  <Award size={15} />
                  <span>View Internship Certificate</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
