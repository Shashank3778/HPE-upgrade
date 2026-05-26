import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@openedx/paragon';

import { useCourseData } from 'hooks';
import useCourseProgress from 'hooks/useCourseProgress';
import useCardDetailsData from './hooks';
import './index.scss';

export const CourseCardDetails = ({ cardId }) => {
  const {
    providerName,
    accessMessage,
    isEntitlement,
    isFulfilled,
    canChange,
    openSessionModal,
    courseNumber,
    changeOrLeaveSessionMessage,
  } = useCardDetailsData({ cardId });

  // Get courseId for progress API
  const courseData = useCourseData(cardId);
  const courseId = courseData?.courseRun?.courseId;

  // Fetch progress
  const { percentComplete, isLoading } = useCourseProgress(courseId);

  return (
    <div data-testid="CourseCardDetails">
      <span className="small">
        {providerName} • {courseNumber}
        {!(isEntitlement && !isFulfilled) && accessMessage && (
          ` • ${accessMessage}`
        )}
        {isEntitlement && isFulfilled && canChange ? (
          <>
            {' • '}
            <Button variant="link" size="inline" className="m-0 p-0" onClick={openSessionModal}>
              {changeOrLeaveSessionMessage}
            </Button>
          </>
        ) : null}
      </span>

      {/* Progress Bar */}
      {!isLoading && courseId && (
        <div className="course-progress-container">
          <div className="course-progress-bar">
            <div
              className="course-progress-bar__fill"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
          <span className="course-progress-bar__label">{percentComplete}%</span>
        </div>
      )}
    </div>
  );
};

CourseCardDetails.propTypes = {
  cardId: PropTypes.string.isRequired,
};

CourseCardDetails.defaultProps = {};

export default CourseCardDetails;