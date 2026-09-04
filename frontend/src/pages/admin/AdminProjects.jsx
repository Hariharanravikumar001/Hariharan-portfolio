import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ExternalLink, Github, FileText, X } from 'lucide-react';
import { projectsApi } from '../../services/api';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Full Stack',
    shortDescription: '',
    fullDescription: '',
    technologies: '',
    image: '',
    screenshots: '',
    githubLink: '',
    liveDemo: '',
    pdfUrl: '',
    featured: false,
  });

  const categories = ['Full Stack', 'Frontend', 'Backend', 'MERN Stack', 'Mobile', 'UI/UX'];

  const fetchProjects = async () => {
    try {
      const res = await projectsApi.getAll();
      if (res.data.success) {
        setProjects(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEdit = (project) => {
    setEditingId(project._id);
    setFormData({
      title: project.title,
      category: project.category,
      shortDescription: project.shortDescription,
      fullDescription: project.fullDescription || '',
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
      image: project.image,
      screenshots: Array.isArray(project.screenshots) ? project.screenshots.join(', ') : '',
      githubLink: project.githubLink || '',
      liveDemo: project.liveDemo || '',
      pdfUrl: project.pdfUrl || '',
      featured: project.featured || false,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectsApi.delete(id);
      fetchProjects();
    } catch (err) {
      alert('Error deleting project');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean),
        screenshots: formData.screenshots ? formData.screenshots.split(',').map((s) => s.trim()).filter(Boolean) : [],
      };

      if (editingId) {
        await projectsApi.update(editingId, payload);
      } else {
        await projectsApi.create(payload);
      }
      setShowModal(false);
      setEditingId(null);
      fetchProjects();
    } catch (err) {
      alert('Error saving project: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Project Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Catalog full stack projects, upload screenshots, attach live demos, and documentation PDFs.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              title: '',
              category: 'Full Stack',
              shortDescription: '',
              fullDescription: '',
              technologies: '',
              image: '',
              screenshots: '',
              githubLink: '',
              liveDemo: '',
              pdfUrl: '',
              featured: false,
            });
            setShowModal(true);
          }}
          className="btn-primary"
        >
          <Plus size={16} />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {projects.map((project) => (
          <div key={project._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ height: '170px', overflow: 'hidden', position: 'relative' }}>
              <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span className="badge" style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(15,23,42,0.85)' }}>
                {project.category}
              </span>
              {project.featured && (
                <span className="badge" style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(56,189,248,0.2)' }}>
                  Featured
                </span>
              )}
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                {project.title}
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px', flex: 1 }}>
                {project.shortDescription}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', paddingTop: '14px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {project.liveDemo && (
                    <a href={project.liveDemo} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-cyan)' }}>
                      <ExternalLink size={16} />
                    </a>
                  )}
                  {project.githubLink && (
                    <a href={project.githubLink} target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }}>
                      <Github size={16} />
                    </a>
                  )}
                  {project.pdfUrl && (
                    <a href={project.pdfUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-purple)' }}>
                      <FileText size={16} />
                    </a>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleEdit(project)}
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-glass)', color: 'var(--accent-cyan)', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-glass)', color: 'var(--accent-rose)', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Project Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="glass-panel"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                {editingId ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="glass-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="glass-input"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Short Summary / Card Description *
                </label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="glass-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Full Description & Architectural Highlights
                </label>
                <textarea
                  rows="3"
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="glass-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Technologies (Comma Separated) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="React, Node.js, Express, MongoDB, Tailwind CSS"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  className="glass-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Main Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="glass-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Gallery Screenshots (Comma separated URLs)
                  </label>
                  <input
                    type="text"
                    placeholder="https://img1.jpg, https://img2.jpg"
                    value={formData.screenshots}
                    onChange={(e) => setFormData({ ...formData, screenshots: e.target.value })}
                    className="glass-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>GitHub Link</label>
                  <input
                    type="url"
                    value={formData.githubLink}
                    onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                    className="glass-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Live Demo Link</label>
                  <input
                    type="url"
                    value={formData.liveDemo}
                    onChange={(e) => setFormData({ ...formData, liveDemo: e.target.value })}
                    className="glass-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Project PDF URL</label>
                  <input
                    type="url"
                    value={formData.pdfUrl}
                    onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                    className="glass-input"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                <label htmlFor="featured" style={{ fontSize: '0.88rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  Highlight on Home Page as Featured Project
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '14px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <span>Save Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
