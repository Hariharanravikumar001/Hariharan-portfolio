import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Eye, MessageSquare, Send, User } from 'lucide-react';
import { blogsApi } from '../../services/api';

const SingleBlog = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({ name: '', email: '', comment: '' });
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentStatus, setCommentStatus] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await blogsApi.getBySlug(slug);
        if (res.data.success) {
          setBlog(res.data.data);
        }
      } catch (err) {
        console.error('Blog load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentForm.name || !commentForm.email || !commentForm.comment) return;

    try {
      setSubmittingComment(true);
      const res = await blogsApi.addComment(blog._id, commentForm);
      if (res.data.success) {
        setBlog((prev) => ({
          ...prev,
          comments: res.data.data,
        }));
        setCommentForm({ name: '', email: '', comment: '' });
        setCommentStatus('Thank you! Your comment has been posted.');
      }
    } catch (err) {
      setCommentStatus('Failed to post comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading article...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Article Not Found</h2>
        <Link to="/blog" className="btn-primary" style={{ marginTop: '20px' }}>
          Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '60px 20px 100px 20px', maxWidth: '850px' }}>
      {/* Back Link */}
      <Link
        to="/blog"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--accent-cyan)',
          textDecoration: 'none',
          marginBottom: '30px',
          fontWeight: 600,
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Articles</span>
      </Link>

      {/* Article Header */}
      <div style={{ marginBottom: '30px' }}>
        <span className="badge" style={{ marginBottom: '12px' }}>{blog.category}</span>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '16px' }}>
          {blog.title}
        </h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Calendar size={15} />
            {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Clock size={15} />
            {blog.readTime || '5 min read'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Eye size={15} />
            {blog.views} views
          </span>
        </div>
      </div>

      {/* Cover Image */}
      {blog.coverImage && (
        <div style={{ width: '100%', height: '360px', borderRadius: '16px', overflow: 'hidden', marginBottom: '40px' }}>
          <img src={blog.coverImage} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {/* Article Content */}
      <div
        className="glass-panel"
        style={{
          padding: '36px',
          lineHeight: 1.8,
          fontSize: '1.05rem',
          color: 'var(--text-primary)',
          whiteSpace: 'pre-wrap',
          marginBottom: '50px',
        }}
      >
        {blog.content}
      </div>

      {/* Tags */}
      {blog.tags?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '50px' }}>
          {blog.tags.map((tag, i) => (
            <span key={i} className="badge">#{tag}</span>
          ))}
        </div>
      )}

      {/* Comments Section */}
      <div className="glass-panel" style={{ padding: '36px' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MessageSquare size={20} color="var(--accent-cyan)" />
          <span>Comments ({blog.comments?.length || 0})</span>
        </h3>

        {/* Existing comments list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '36px' }}>
          {blog.comments?.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            blog.comments.map((c) => (
              <div key={c._id} style={{ background: 'var(--bg-input)', padding: '16px 20px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    <User size={16} color="var(--accent-cyan)" />
                    <span>{c.name}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{c.comment}</p>
              </div>
            ))
          )}
        </div>

        {/* Add comment form */}
        <form onSubmit={handleCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            Leave a Reply
          </h4>

          {commentStatus && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-cyan)', fontSize: '0.88rem' }}>
              {commentStatus}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <input
              type="text"
              placeholder="Your Name *"
              required
              value={commentForm.name}
              onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
              className="glass-input"
            />
            <input
              type="email"
              placeholder="Your Email *"
              required
              value={commentForm.email}
              onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
              className="glass-input"
            />
          </div>

          <textarea
            rows="4"
            placeholder="Write your comment..."
            required
            value={commentForm.comment}
            onChange={(e) => setCommentForm({ ...commentForm, comment: e.target.value })}
            className="glass-input"
          />

          <button
            type="submit"
            disabled={submittingComment}
            className="btn-primary"
            style={{ alignSelf: 'flex-start', padding: '10px 22px' }}
          >
            <Send size={16} />
            <span>{submittingComment ? 'Posting...' : 'Post Comment'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SingleBlog;
