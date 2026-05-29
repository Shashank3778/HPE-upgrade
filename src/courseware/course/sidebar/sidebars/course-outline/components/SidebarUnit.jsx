import PropTypes from 'prop-types';
import UnitLinkWrapper from './UnitLinkWrapper';
import { UNIT_ICON_TYPES } from './UnitIcon';

// Inline SVG icons — pixel-matched to design
const CheckMark = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M2.5 6.5L5.5 9.5L10.5 3.5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const OrangeDot = () => (
  <svg width="8" height="8" viewBox="0 0 8 8">
    <circle cx="4" cy="4" r="4" fill="#f59e0b"/>
  </svg>
);

const GreyCircle = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <circle cx="6.5" cy="6.5" r="5.5" stroke="#d1d5db" strokeWidth="1.5"/>
  </svg>
);

const LockIcon = () => (
  <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
    <rect x="2.5" y="6" width="8" height="6" rx="1.5" stroke="#f97316" strokeWidth="1.4"/>
    <path d="M4 6V4.5a2.5 2.5 0 015 0V6" stroke="#f97316" strokeWidth="1.4"/>
  </svg>
);

const SidebarUnit = ({
  id,
  courseId,
  sequenceId,
  unit,
  isActive,
  isLocked,
  activeUnitId,
  isCompletionTrackingEnabled,
}) => {
  const { complete, title } = unit;
  const completeAndEnabled = complete && isCompletionTrackingEnabled;

  const icon = () => {
    if (isLocked) { return <LockIcon />; }
    if (completeAndEnabled) { return <CheckMark />; }
    if (isActive) { return <OrangeDot />; }
    return <GreyCircle />;
  };

  return (
    <li style={{
      borderLeft: isActive ? '3px solid #4f46e5' : '3px solid transparent',
      background: isActive ? '#f5f6ff' : 'transparent',
    }}
    >
      <UnitLinkWrapper sequenceId={sequenceId} activeUnitId={activeUnitId} id={id} courseId={courseId}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 0.75rem',
          width: '100%',
        }}
        >
          <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center', width: 16 }}>
            {icon()}
          </span>
          <span style={{
            fontSize: '0.79rem',
            color: isActive ? '#4f46e5' : isLocked ? '#9ca3af' : '#374151',
            fontWeight: isActive ? 600 : 400,
            lineHeight: 1.4,
            fontFamily: "'DM Sans', -apple-system, sans-serif",
          }}
          >
            {title}
          </span>
        </div>
      </UnitLinkWrapper>
    </li>
  );
};

SidebarUnit.propTypes = {
  id: PropTypes.string.isRequired,
  unit: PropTypes.shape({
    complete: PropTypes.bool,
    title: PropTypes.string,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  isLocked: PropTypes.bool.isRequired,
  courseId: PropTypes.string.isRequired,
  sequenceId: PropTypes.string.isRequired,
  activeUnitId: PropTypes.string.isRequired,
  isCompletionTrackingEnabled: PropTypes.bool.isRequired,
};

export default SidebarUnit;