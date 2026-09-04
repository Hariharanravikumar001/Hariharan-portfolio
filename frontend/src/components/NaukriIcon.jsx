import React from 'react';

const NaukriIcon = ({ size = 18, color = '#1C6FF9', style = {}, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    {...props}
  >
    <rect width="24" height="24" rx="6" fill={color} />
    <path
      d="M7.5 16.5V7.5L16.5 16.5V7.5"
      stroke="#FFFFFF"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default NaukriIcon;
