import { useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LockIcon = () => (
  <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
    <rect x="3" y="7" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const UnitButton = ({
  onClick,
  title,
  contentType,
  isActive,
  bookmarked,
  complete,
  showCompletion,
  unitId,
}) => {
  const { courseId, sequenceId } = useSelector(state => state.courseware);
  const { pathname } = useLocation();
  const basePath = `/course/${courseId}/${sequenceId}/${unitId}`;
  const unitPath = pathname.startsWith('/preview') ? `/preview${basePath}` : basePath;

  const handleClick = useCallback(() => {
    onClick(unitId);
  }, [onClick, unitId]);

  const isLocked = contentType === 'lock';

  // Determine circle style
  let circleStyle = {};
  let iconContent = null;

  if (isLocked) {
    circleStyle = {
      background: '#fff7ed',
      border: '2px solid #f97316',
      color: '#f97316',
    };
    iconContent = <LockIcon />;
  } else if (showCompletion && complete) {
    circleStyle = {
      background: '#16a34a',
      border: '2px solid #16a34a',
      color: '#fff',
    };
    iconContent = <CheckIcon />;
  } else if (isActive) {
    circleStyle = {
      background: '#d97706',
      border: '2px solid #d97706',
      color: '#fff',
    };
    iconContent = null;
  } else {
    circleStyle = {
      background: '#fff',
      border: '2px solid #d1d5db',
      color: '#9ca3af',
    };
    iconContent = null;
  }

  const circle = (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        borderRadius: '50%',
        flexShrink: 0,
        transition: 'all 0.15s ease',
        ...circleStyle,
      }}
    >
      {iconContent}
    </span>
  );

  const label = (
    <span style={{
      fontSize: '0.78rem',
      fontWeight: isActive ? 600 : 400,
      color: isActive ? '#111827' : '#6b7280',
      maxWidth: 80,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }}
    >
      {title}
    </span>
  );

  const inner = (
    <span style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.4rem 0.5rem',
      cursor: isLocked ? 'not-allowed' : 'pointer',
      opacity: isLocked ? 0.8 : 1,
    }}
    >
      {circle}
      {label}
    </span>
  );

  if (isLocked) {
    return <span style={{ display: 'inline-flex' }}>{inner}</span>;
  }

  return (
    <Link
      to={unitPath}
      onClick={handleClick}
      title={title}
      style={{ textDecoration: 'none', display: 'inline-flex' }}
    >
      {inner}
    </Link>
  );
};

UnitButton.propTypes = {
  bookmarked: PropTypes.bool,
  complete: PropTypes.bool,
  contentType: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  showCompletion: PropTypes.bool,
  title: PropTypes.string.isRequired,
  unitId: PropTypes.string.isRequired,
};

UnitButton.defaultProps = {
  isActive: false,
  bookmarked: false,
  complete: false,
  showCompletion: true,
};

const mapStateToProps = (state, props) => {
  if (props.unitId) {
    return { ...state.models.units[props.unitId] };
  }
  return {};
};

export default connect(mapStateToProps)(UnitButton);