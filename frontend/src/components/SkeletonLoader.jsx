import React from 'react';

export const ProjectSkeletonCard = () => (
  <div
    className="glass-card"
    style={{
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: 0,
    }}
  >
    {/* Image Skeleton */}
    <div className="skeleton" style={{ height: '210px', width: '100%', borderRadius: 0 }} />

    {/* Content Skeleton */}
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, gap: '14px' }}>
      <div className="skeleton" style={{ height: '22px', width: '70%' }} />
      <div className="skeleton" style={{ height: '14px', width: '100%' }} />
      <div className="skeleton" style={{ height: '14px', width: '85%' }} />

      {/* Tags Skeleton */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <div className="skeleton" style={{ height: '24px', width: '60px', borderRadius: '12px' }} />
        <div className="skeleton" style={{ height: '24px', width: '70px', borderRadius: '12px' }} />
        <div className="skeleton" style={{ height: '24px', width: '50px', borderRadius: '12px' }} />
      </div>

      {/* Footer Buttons Skeleton */}
      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '16px' }}>
        <div className="skeleton" style={{ height: '36px', flex: 1, borderRadius: '8px' }} />
        <div className="skeleton" style={{ height: '36px', flex: 1, borderRadius: '8px' }} />
      </div>
    </div>
  </div>
);

export const SkillSkeletonCard = () => (
  <div
    className="glass-card"
    style={{
      padding: '20px 22px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '14px',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
      <div className="skeleton" style={{ width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="skeleton" style={{ height: '18px', width: '60%' }} />
        <div className="skeleton" style={{ height: '12px', width: '35%' }} />
      </div>
    </div>
    <div className="skeleton" style={{ width: '22px', height: '22px', borderRadius: '50%' }} />
  </div>
);

export const ResumeSkeletonCard = () => (
  <div
    className="glass-card"
    style={{
      padding: '28px',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div className="skeleton" style={{ width: '44px', height: '44px', borderRadius: '12px' }} />
      <div className="skeleton" style={{ width: '80px', height: '24px', borderRadius: '12px' }} />
    </div>
    <div className="skeleton" style={{ height: '22px', width: '80%' }} />
    <div className="skeleton" style={{ height: '14px', width: '100%' }} />
    <div className="skeleton" style={{ height: '14px', width: '70%' }} />

    <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '12px' }}>
      <div className="skeleton" style={{ height: '40px', flex: 1, borderRadius: '8px' }} />
      <div className="skeleton" style={{ height: '40px', flex: 1, borderRadius: '8px' }} />
    </div>
  </div>
);

export default {
  ProjectSkeletonCard,
  SkillSkeletonCard,
  ResumeSkeletonCard,
};
