import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Cpu } from 'lucide-react';
import { skillsApi } from '../../services/api';

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    proficiency: 85,
    order: 0,
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const categories = ['Frontend', 'Backend', 'Database', 'Tools', 'DevOps & Cloud', 'Other'];

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await skillsApi.getAll();
      if (res.data.success) {
        setSkills(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await skillsApi.update(editingId, formData);
      } else {
        await skillsApi.create(formData);
      }
      setShowAddModal(false);
      setEditingId(null);
      setFormData({ name: '', category: 'Frontend', proficiency: 85, order: 0 });
      fetchSkills();
    } catch (err) {
      alert('Error saving skill: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (skill) => {
    setEditingId(skill._id);
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      order: skill.order || 0,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    try {
      await skillsApi.delete(id);
      fetchSkills();
    } catch (err) {
      alert('Error deleting skill');
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Skills Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Add, update, or remove technical skills and adjust proficiency percentages.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', category: 'Frontend', proficiency: 85, order: 0 });
            setShowAddModal(true);
          }}
          className="btn-primary"
        >
          <Plus size={16} />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Skills Table / List */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)', background: 'var(--bg-input)' }}>
              <th style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Skill Name</th>
              <th style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Category</th>
              <th style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Status</th>
              <th style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => (
              <tr key={skill._id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {skill.name}
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span className="badge">{skill.category}</span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span className="badge" style={{ color: 'var(--accent-cyan)' }}>Active / Proficient</span>
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEdit(skill)}
                      style={{ background: 'var(--bg-input)', border: '1px solid var(--border-glass)', color: 'var(--accent-cyan)', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(skill._id)}
                      style={{ background: 'var(--bg-input)', border: '1px solid var(--border-glass)', color: 'var(--accent-rose)', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Skill Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="glass-panel" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '480px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                {editingId ? 'Edit Skill' : 'Add New Skill'}
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React.js"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <span>Save Skill</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSkills;
