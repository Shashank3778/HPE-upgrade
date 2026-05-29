import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { useModel, useModels } from '../../../generic/model-store';

const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <path d="M5 3L9 7L5 11" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CourseBreadcrumbs = ({
  courseId,
  sectionId,
  sequenceId,
  unitId,
}) => {
  const course = useModel('coursewareMeta', courseId);
  const courseStatus = useSelector(state => state.courseware.courseStatus);
  const sequenceStatus = useSelector(state => state.courseware.sequenceStatus);

  const allSequencesInSections = Object.fromEntries(
    (useModels('sections', course.sectionIds) || []).map(section => [
      section.id,
      {
        default: section.id === sectionId,
        title: section.title,
        sequences: useModels('sequences', section.sequenceIds),
      },
    ]),
  );

  const { sectionTitle, sequenceTitle, unitTitle } = useMemo(() => {
    let secTitle = '';
    let seqTitle = '';
    let unitTitleVal = '';

    if (courseStatus === 'loaded' && sequenceStatus === 'loaded') {
      Object.values(allSequencesInSections).forEach(section => {
        if (section.default) {
          secTitle = section.title;
          section.sequences.forEach(seq => {
            if (seq.id === sequenceId) {
              seqTitle = seq.title;
              // Try to find active unit title
              if (unitId && seq.unitIds) {
                const unitModel = seq.unitIds.find(id => id === unitId);
                if (unitModel) {
                  // unit title comes from models
                  unitTitleVal = unitId;
                }
              }
            }
          });
        }
      });
    }

    return { sectionTitle: secTitle, sequenceTitle: seqTitle, unitTitle: unitTitleVal };
  }, [courseStatus, sequenceStatus, sectionId, sequenceId, unitId]);

  // Get unit title from model
  const unitModel = useModel('units', unitId);
  const resolvedUnitTitle = unitModel?.title || '';

  return (
    <nav
      aria-label="breadcrumb"
      style={{
        padding: '0.55rem 1.5rem',
        background: '#f5f6f8',
        borderBottom: '1px solid #e8e9ec',
        fontFamily: "'DM Sans', -apple-system, sans-serif",
        fontSize: '0.8rem',
      }}
    >
      <ol style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.3rem',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        flexWrap: 'wrap',
      }}
      >
        {/* Course home */}
        <li>
          <Link
            to={`/course/${courseId}/home`}
            replace
            style={{ color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}
          >
            {course?.title || 'Course'}
          </Link>
        </li>

        {sectionTitle && (
          <>
            <li><ChevronIcon /></li>
            <li style={{ color: '#6b7280' }}>{sectionTitle}</li>
          </>
        )}

        {sequenceTitle && (
          <>
            <li><ChevronIcon /></li>
            <li style={{ color: '#6b7280' }}>{sequenceTitle}</li>
          </>
        )}

        {resolvedUnitTitle && (
          <>
            <li><ChevronIcon /></li>
            <li style={{ color: '#111827', fontWeight: 600 }}>{resolvedUnitTitle}</li>
          </>
        )}
      </ol>
    </nav>
  );
};

CourseBreadcrumbs.propTypes = {
  courseId: PropTypes.string.isRequired,
  sectionId: PropTypes.string,
  sequenceId: PropTypes.string,
  unitId: PropTypes.string,
  isStaff: PropTypes.bool,
};

CourseBreadcrumbs.defaultProps = {
  sectionId: null,
  sequenceId: null,
  unitId: null,
  isStaff: null,
};

export default CourseBreadcrumbs;