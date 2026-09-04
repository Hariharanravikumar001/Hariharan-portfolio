import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Eye, MessageSquare, X } from 'lucide-react';
import { blogsApi } from '../../services/api';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Web Development',
    summary: '',
    content: '',
    coverImage: '',
    tags: '',
    readTime: '5 min read',
    published: true,
  });

  const categories = ['Web Development', 'Full Stack', 'UI/UX & Frontend', 'Architecture', 'DevOps & Cloud'];

  const fetchBlogs = async () => {
    try {
      const res = await blogsApi.getAll({ all: 'true' });
      if (res.data.success) {
        setBlogs(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load blogs:', err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setFormData({
      title: blog.title,
      category: blog.category,
      summary: blog.summary,
      content: blog.content,
      coverImage: blog.coverImage || '',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
      readTime: blog.readTime || '5 min read',
      published: blog.published !== false,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await blogsApi.delete(id);
      fetchBlogs();
    } catch (err) {
      alert('Failed to delete blog post');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };

      if (editingId) {
        await blogsApi.update(editingId, payload);
      } else {
        await blogsApi.create(payload);
      }
      setShowModal(false);
      setEditingId(null);
      fetchBlogs();
    } catch (err) {
      alert('Error saving blog: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Blog Articles Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Author, edit, and publish technical articles and tutorials for your developer audience.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              title: '',
              category: 'Web Development',
              summary: '',
              content: '',
              coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
              tags: '',
              readTime: '5 min read',
              published: true,
            });
            setShowModal(true);
          }}
          className="btn-primary"
        >
          <Plus size={16} />
          <span>Write New Article</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {blogs.map((blog) => (
          <div key={blog._id} className="glass-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="badge">{blog.category}</span>
                <span className="badge" style={{ background: blog.published ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)', color: blog.published ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                  {blog.published ? 'Published' : 'Draft'}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                {blog.title}
              </h3>
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <span><Eye size={13} style={{ verticalAlign: 'middle' }} /> {blog.views || 0} views</span>
                <span><MessageSquare size={13} style={{ verticalAlign: 'middle' }} /> {blog.comments?.length || 0} comments</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleEdit(blog)}
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-glass)', color: 'var(--accent-cyan)', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(blog._id)}
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-glass)', color: 'var(--accent-rose)', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="glass-panel" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text-primary)' }}>
                {editingId ? 'Edit Article' : 'Write New Article'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="glass-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Category *</label>
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
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Summary *</label>
                <input
                  type="text"
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="glass-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Article Content (Markdown supported) *</label>
                <textarea
                  rows="9"
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="glass-input"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Cover Image URL</label>
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="glass-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Tags (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="React, CSS, Node"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="glass-input"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                />
                <label htmlFor="published" style={{ fontSize: '0.88rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  Publish immediately (visible to visitors)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Article</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;
