import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, Github, FileText, Eye, Layers } from 'lucide-react';
import { projectsApi } from '../../services/api';
import ProjectModal from '../../components/ProjectModal';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { ProjectSkeletonCard } from '../../components/SkeletonLoader';

const Projects = () => {
  useDocumentTitle('Featured Projects & Applications');
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Full Stack', 'MERN Stack', 'Frontend', 'Backend'];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const params = {};
        if (selectedCategory !== 'All') params.category = selectedCategory;
        if (searchTerm.trim()) params.search = searchTerm.trim();

        const res = await projectsApi.getAll(params);
        if (res.data.success) {
          setProjects(res.data.data);
        }
      } catch (err) {
        console.error('Projects fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchProjects, 300);
    return () => clearTimeout(debounce);
  }, [selectedCategory, searchTerm]);

  return (
    <div className="container animate-fade-in" style={{ padding: '60px 20px 100px 20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <span className="badge" style={{ marginBottom: '10px' }}>Work & Implementations</span>
        <h1 className="section-title">Projects Showcase</h1>
        <p className="section-subtitle" style={{ maxWidth: '650px', margin: '0 auto' }}>
          Explore full-stack web applications, interactive frontends, and scalable architectures engineered by Hariharan.
        </p>

        {/* Search Bar & Category Filters */}
        <div style={{ maxWidth: '650px', margin: '32px auto 0 auto' }}>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search projects by title, tech stack or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input"
              style={{ paddingLeft: '44px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '6px 16px', fontSize: '0.85rem' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '30px',
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectSkeletonCard key={i} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            No projects found matching your search criteria.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="btn-primary"
            style={{ marginTop: '16px' }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '30px',
          }}
        >
          {projects.map((project) => (
            <div
              key={project._id}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Project Image */}
              <div
                style={{
                  position: 'relative',
                  height: '210px',
                  cursor: 'pointer',
                  overflow: 'hidden',
                }}
                onClick={() => setSelectedProject(project)}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
                <span
                  className="badge"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {project.category}
                </span>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.3)',
                    opacity: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'opacity 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
                >
                  <span className="btn-secondary" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
                    <Eye size={14} />
                    <span>View Details & Gallery</span>
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3
                  onClick={() => setSelectedProject(project)}
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '10px',
                    cursor: 'pointer',
                  }}
                >
                  {project.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: '20px',
                    flex: 1,
                  }}
                >
                  {project.shortDescription}
                </p>

                {/* Tech Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '22px' }}>
                  {project.technologies?.map((tech, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.75rem',
                        padding: '3px 9px',
                        borderRadius: '6px',
                        background: 'var(--bg-input)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-glass)',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Footer Actions */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--border-glass)',
                    paddingTop: '16px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {project.liveDemo && (
                      <a
                        href={project.liveDemo}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary"
                        style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                      >
                        <ExternalLink size={13} />
                        <span>Live</span>
                      </a>
                    )}
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary"
                        style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                      >
                        <Github size={13} />
                        <span>Code</span>
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedProject(project)}
                    className="btn-outline"
                    style={{ fontSize: '0.78rem', padding: '6px 10px' }}
                  >
                    Gallery & Docs
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
};

export default Projects;
