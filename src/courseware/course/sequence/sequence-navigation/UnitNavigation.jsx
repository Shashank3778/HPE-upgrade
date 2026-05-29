import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import { GetCourseExitNavigation } from '../../course-exit';
import { useSequenceNavigationMetadata } from './hooks';
import { useModel } from '../../../../generic/model-store';
import { useIntl } from '@edx/frontend-platform/i18n';
import messages from './messages';

const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UnitNavigation = ({
  sequenceId,
  unitId,
  onClickPrevious,
  onClickNext,
  isAtTop,
  courseId,
}) => {
  const intl = useIntl();
  const { pathname } = useLocation();
  const isPreview = pathname.startsWith('/preview');

  const {
    isFirstUnit,
    isLastUnit,
    nextLink,
    previousLink,
  } = useSequenceNavigationMetadata(sequenceId, unitId);

  const sequence = useModel('sequences', sequenceId);
  const units = useSelector(state => state.models.units) || {};

  // Get adjacent unit titles
  const unitIndex = sequence?.unitIds?.indexOf(unitId) ?? -1;
  const prevUnitId = unitIndex > 0 ? sequence.unitIds[unitIndex - 1] : null;
  const nextUnitId = unitIndex >= 0 && unitIndex < (sequence?.unitIds?.length - 1)
    ? sequence.unitIds[unitIndex + 1] : null;
  const prevTitle = prevUnitId ? (units[prevUnitId]?.title || 'Previous') : 'Previous';
  const nextUnitTitle = nextUnitId ? (units[nextUnitId]?.title || 'Next') : null;

  const { exitActive, exitText } = GetCourseExitNavigation(courseId, intl);
  const isDisabledNext = isLastUnit && !exitActive;
  const nextTitle = isLastUnit && exitText ? exitText : (nextUnitTitle || intl.formatMessage(messages.nextButton));

  const navLink = (link) => (link && isPreview ? `/preview${link}` : link);

  // Shared button base styles
  const btnBase = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontFamily: "'DM Sans', -apple-system, sans-serif",
    fontSize: '0.84rem',
    fontWeight: 500,
    borderRadius: '8px',
    padding: '0.45rem 1rem',
    textDecoration: 'none',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.15s ease',
    lineHeight: 1.4,
  };

  const prevBtn = isFirstUnit ? null : (
    <Link
      to={navLink(previousLink)}
      onClick={onClickPrevious}
      style={{
        ...btnBase,
        background: '#fff',
        border: '1px solid #d1d5db',
        color: '#374151',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#f9fafb'; }}
      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
    >
      <ChevronLeft />
      <span>Previous · {prevTitle}</span>
    </Link>
  );

  const nextBtn = isDisabledNext ? null : (
    <Link
      to={navLink(nextLink)}
      onClick={onClickNext}
      style={{
        ...btnBase,
        background: '#4f46e5',
        color: '#fff',
        border: '1px solid #4f46e5',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#4338ca'; }}
      onMouseLeave={e => { e.currentTarget.style.background = '#4f46e5'; }}
    >
      <span>{nextTitle}</span>
      <ChevronRight />
    </Link>
  );

  // Top nav — hidden (we don't want the top pill tabs or top arrows)
  if (isAtTop) {
    return null;
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 0',
      borderTop: '1px solid #e8e9ec',
      marginTop: '1.5rem',
      fontFamily: "'DM Sans', -apple-system, sans-serif",
    }}
    >
      <div>{prevBtn}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {nextBtn}
      </div>
    </div>
  );
};

UnitNavigation.propTypes = {
  courseId: PropTypes.string.isRequired,
  sequenceId: PropTypes.string.isRequired,
  unitId: PropTypes.string,
  onClickPrevious: PropTypes.func.isRequired,
  onClickNext: PropTypes.func.isRequired,
  isAtTop: PropTypes.bool,
};

UnitNavigation.defaultProps = {
  unitId: null,
  isAtTop: false,
};

export default UnitNavigation;