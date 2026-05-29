import PropTypes from 'prop-types';

export const UNIT_ICON_TYPES = {
  video: 'video',
  problem: 'problem',
  vertical: 'vertical',
  lock: 'lock',
  other: 'other',
};

// SVG icons — no Paragon dependency, match design exactly
const CheckCircle = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="10" cy="10" r="9" fill="#16a34a" />
    <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EmptyCircle = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="10" cy="10" r="9" stroke="#d1d5db" strokeWidth="1.8" fill="white" />
  </svg>
);

const LockCircle = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="10" cy="10" r="9" stroke="#f97316" strokeWidth="1.8" fill="#fff7ed" />
    <rect x="6.5" y="9.5" width="7" height="5.5" rx="1.2" stroke="#f97316" strokeWidth="1.4" />
    <path d="M7.5 9.5V8a2.5 2.5 0 015 0v1.5" stroke="#f97316" strokeWidth="1.4" />
  </svg>
);

// Small reading/article icon for non-video content types
const PageCircle = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="10" cy="10" r="9" stroke="#d1d5db" strokeWidth="1.8" fill="white" />
    <rect x="7" y="7" width="6" height="1.2" rx="0.6" fill="#9ca3af" />
    <rect x="7" y="9.4" width="6" height="1.2" rx="0.6" fill="#9ca3af" />
    <rect x="7" y="11.8" width="4" height="1.2" rx="0.6" fill="#9ca3af" />
  </svg>
);

const UnitIcon = ({ type, isCompleted }) => {
  if (type === UNIT_ICON_TYPES.lock) {
    return <LockCircle />;
  }
  if (isCompleted) {
    return <CheckCircle />;
  }
  if (type === UNIT_ICON_TYPES.vertical || type === UNIT_ICON_TYPES.other) {
    return <PageCircle />;
  }
  return <EmptyCircle />;
};

UnitIcon.propTypes = {
  type: PropTypes.oneOf(Object.keys(UNIT_ICON_TYPES)).isRequired,
  isCompleted: PropTypes.bool.isRequired,
};

export default UnitIcon;