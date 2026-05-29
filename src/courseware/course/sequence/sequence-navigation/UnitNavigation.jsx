import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';

import { GetCourseExitNavigation } from '../../course-exit';
import { useSequenceNavigationMetadata } from './hooks';
import { useModel } from '../../../../generic/model-store';
import messages from './messages';

const ChevLeft = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M8 2.5L4.5 6.5L8 10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevRight = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M5 2.5L8.5 6.5L5 10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
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

  // Get sequence and all units from models
  const sequence = useModel('sequences', sequenceId);
  const allSequenceIds = useSelector(state => state.courseware.sequenceIds || []);
  const allSequences = useSelector(state => state.models.sequences || {});
  const allUnits = useSelector(state => state.models.units || {});

  // Find prev/next unit titles
  const unitIndex = sequence?.unitIds?.indexOf(unitId) ?? -1;
  const sequenceIndex = allSequenceIds.indexOf(sequenceId);

  // Previous title
  let prevTitle = 'Previous';
  if (unitIndex > 0) {
    const prevId = sequence.unitIds[unitIndex - 1];
    prevTitle = allUnits[prevId]?.title || 'Previous';
  } else if (sequenceIndex > 0) {
    // Previous is last unit of previous sequence
    const prevSeqId = allSequenceIds[sequenceIndex - 1];
    const prevSeq = allSequences[prevSeqId];
    if (prevSeq?.unitIds?.length) {
      const lastId = prevSeq.unitIds[prevSeq.unitIds.length - 1];
      prevTitle = allUnits[lastId]?.title || prevSeq.title || 'Previous';
    }
  }

  // Next title
  let nextTitle = 'Next';
  const { exitActive, exitText } = GetCourseExitNavigation(courseId, intl);
  if (isLastUnit && exitText) {
    nextTitle = exitText;
  } else if (unitIndex >= 0 && unitIndex < (sequence?.unitIds?.length - 1)) {
    const nextId = sequence.unitIds[unitIndex + 1];
    nextTitle = allUnits[nextId]?.title || 'Next';
  } else if (sequenceIndex < allSequenceIds.length - 1) {
    // Next is first unit of next sequence
    const nextSeqId = allSequenceIds[sequenceIndex + 1];
    const nextSeq = allSequences[nextSeqId];
    if (nextSeq?.unitIds?.length) {
      const firstId = nextSeq.unitIds[0];
      nextTitle = allUnits[firstId]?.title || nextSeq.title || 'Next';
    }
  }

  const isDisabledNext = isLastUnit && !exitActive;
  const navLink = (link) => (link && isPreview ? `/preview${link}` : link);

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontFamily: "'DM Sans', -apple-system, sans-serif",
    fontSize: '0.84rem',
    fontWeight: 500,
    borderRadius: '8px',
    padding: '0.45rem 1rem',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
    lineHeight: 1.4,
    whiteSpace: 'nowrap',
  };

  // Hide top nav entirely
  if (isAtTop) { return null; }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.1rem 0',
      borderTop: '1px solid #e8e9ec',
      marginTop: '1.5rem',
      fontFamily: "'DM Sans', -apple-system, sans-serif",
    }}
    >
      {/* Previous */}
      <div>
        {!isFirstUnit && previousLink && (
          <Link
            to={navLink(previousLink)}
            onClick={onClickPrevious}
            style={{ ...base, background: '#fff', border: '1px solid #d1d5db', color: '#374151' }}
          >
            <ChevLeft />
            Previous · {prevTitle}
          </Link>
        )}
      </div>

      {/* Next */}
      <div>
        {!isDisabledNext && nextLink && (
          <Link
            to={navLink(nextLink)}
            onClick={onClickNext}
            style={{ ...base, background: '#4f46e5', border: '1px solid #4f46e5', color: '#fff' }}
          >
            {nextTitle} · Next
            <ChevRight />
          </Link>
        )}
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