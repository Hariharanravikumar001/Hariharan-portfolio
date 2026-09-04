import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Clock, Eye, MessageSquare, ArrowRight } from 'lucide-react';
import { blogsApi } from '../../services/api';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Full Stack', 'Web Development', 'UI/UX & Frontend', 'Architecture'];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const params = {};
        if (category !== 'All') params.category = category;
        if (searchTerm.trim()) params.search = searchTerm.trim();

        const res = await blogsApi.getAll(params);
        if (res.data.success) {
          setBlogs(res.data.data);
        }
      } catch (err) {
        console.error('Blogs load error:', err);
      } finally {
        setLoading(false);
      }
    };
    const debounce = setTimeout(fetchBlogs, 300);
    return () => clearTimeout(debounce);
  }, [category, searchTerm]);

  return (
    <div className="container animate-fade-in" style={{ padding: '60px 20px 100px 20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <span className="badge" style={{ marginBottom: '10px' }}>Insights & Articles</span>
        <h1 className="section-title">Technical Writing & Engineering Blog</h1>
        <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Deep dives into full-stack software development, architectural patterns, clean code, and user interface engineering.
        </p>

        {/* Search & Category Filter */}
        <div style={{ maxWidth: '600px', margin: '30px auto 0 auto' }}>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search articles by title or keyword..."
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
                onClick={() => setCategory(cat)}
                className={category === cat ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '6px 14px', fontSize: '0.84rem' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '30px',
        }}
      >
        {blogs.map((blog) => (
          <article key={blog._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Link to={`/blog/${blog.slug}`} style={{ textDecoration: 'none', height: '200px', overflow: 'hidden' }}>
              <img
                src={blog.coverImage}
                alt={blog.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              />
            </Link>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span className="badge">{blog.category}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} />
                  {blog.readTime || '5 min read'}
                </span>
              </div>

              <Link to={`/blog/${blog.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px', lineHeight: 1.4 }}>
                  {blog.title}
                </h3>
              </Link>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
                {blog.summary}
              </p>

              {/* Meta & Link */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', paddingTop: '16px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Eye size={14} />
                    {blog.views || 0}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MessageSquare size={14} />
                    {blog.comments?.length || 0}
                  </span>
                </div>

                <Link to={`/blog/${blog.slug}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 600 }}>
                  <span>Read Article</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Blog;
