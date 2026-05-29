import { useState } from 'react';
import PropTypes from 'prop-types';

import { useCourseOutlineSidebar } from '../hooks';
import SidebarUnit from './SidebarUnit';
import { UNIT_ICON_TYPES } from './UnitIcon';

const ChevDown = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevRight = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M4 2.5L7.5 6L4 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Sequence-level status icon
const SeqCheck = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2.5 7L5.5 10L11.5 4" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SeqDot = ({ color }) => (
  <svg width="8" height="8" viewBox="0 0 8 8">
    <circle cx="4" cy="4" r="4" fill={color}/>
  </svg>
);

const SeqLock = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <rect x="2.5" y="6" width="8" height="6" rx="1.5" stroke="#f97316" strokeWidth="1.4"/>
    <path d="M4 6V4.5a2.5 2.5 0 015 0V6" stroke="#f97316" strokeWidth="1.4"/>
  </svg>
);

const SidebarSequence = ({ courseId, defaultOpen, sequence, activeUnitId }) => {
  const {
    id, complete, title, unitIds, type, completionStat,
  } = sequence;

  const [open, setOpen] = useState(defaultOpen);
  const { activeSequenceId, units, isEnabledCompletionTracking } = useCourseOutlineSidebar();
  const isActiveSequence = id === activeSequenceId;
  const isLocked = type === UNIT_ICON_TYPES.lock;
  const { completed = 0, total = 0 } = completionStat || {};
  const isComplete = completed === total && total > 0 && isEnabledCompletionTracking;
  const isPartial = completed > 0 && completed < total && isEnabledCompletionTracking;

  const seqIcon = () => {
    if (isLocked) { return <SeqLock />; }
    if (isComplete) { return <SeqCheck />; }
    if (isActiveSequence || isPartial) { return <SeqDot color="#3b82f6" />; }
    return <SeqDot color="#d1d5db" />;
  };

  return (
    <li style={{ borderBottom: '1px solid #f3f4f6' }}>
      {/* Sequence header */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          width: '100%',
          padding: '0.55rem 0.75rem',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: "'DM Sans', -apple-system, sans-serif",
          textAlign: 'left',
        }}
      >
        <span style={{ color: '#9ca3af', flexShrink: 0 }}>
          {open ? <ChevDown /> : <ChevRight />}
        </span>
        <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center', width: 16 }}>
          {seqIcon()}
        </span>
        <span style={{
          fontSize: '0.81rem',
          fontWeight: isActiveSequence ? 600 : 500,
          color: isLocked ? '#9ca3af' : isActiveSequence ? '#4f46e5' : '#111827',
          flex: 1,
          lineHeight: 1.4,
        }}
        >
          {title}
        </span>
      </button>

      {/* Unit list */}
      {open && (
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, background: '#fafafa' }}>
          {unitIds.map(unitId => (
            <SidebarUnit
              key={unitId}
              id={unitId}
              courseId={courseId}
              sequenceId={id}
              unit={units[unitId] || { title: '', complete: false }}
              isActive={activeUnitId === unitId}
              activeUnitId={activeUnitId}
              isFirst={false}
              isLocked={isLocked}
              isCompletionTrackingEnabled={isEnabledCompletionTracking}
            />
          ))}
        </ol>
      )}
    </li>
  );
};

SidebarSequence.propTypes = {
  courseId: PropTypes.string.isRequired,
  defaultOpen: PropTypes.bool.isRequired,
  sequence: PropTypes.shape({
    complete: PropTypes.bool,
    id: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    unitIds: PropTypes.arrayOf(PropTypes.string),
    completionStat: PropTypes.shape({
      completed: PropTypes.number,
      total: PropTypes.number,
    }),
  }).isRequired,
  activeUnitId: PropTypes.string.isRequired,
};

export default SidebarSequence;