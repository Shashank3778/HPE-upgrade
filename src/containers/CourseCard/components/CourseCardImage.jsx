import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';

import { Badge } from '@openedx/paragon';

import track from 'tracking';
import { useCourseData, useCourseTrackingEvent } from 'hooks';
import verifiedRibbon from 'assets/verified-ribbon.png';
import { getCourseInitials, getCoursePalette } from 'utils/courseVisuals';
import useActionDisabledState from './hooks';

import messages from '../messages';

const { courseImageClicked } = track.course;

export const CourseCardImage = ({ cardId, orientation }) => {
  const { formatMessage } = useIntl();
  const courseData = useCourseData(cardId);
  const { homeUrl, courseId } = courseData?.courseRun || {};
  const courseName = courseData?.course?.courseName || '';
  const { disableCourseTitle } = useActionDisabledState(cardId);
  const handleImageClicked = useCourseTrackingEvent(courseImageClicked, cardId, homeUrl);
  const wrapperClassName = `pgn__card-wrapper-image-cap d-inline-block overflow-visible ${orientation}`;
  const palette = getCoursePalette(courseId || courseName);
  const image = (
    <>
      <div
        className="pgn__card-image-cap course-card-initials-tile w-100 show"
        style={{ background: palette.bg, color: palette.text }}
        role="img"
        aria-label={formatMessage(messages.bannerAlt)}
      >
        {getCourseInitials(courseName)}
      </div>
      {
        courseData?.enrollment?.isVerified && (
          <span
            className="course-card-verify-ribbon-container"
            title={formatMessage(messages.verifiedHoverDescription)}
          >
            <Badge as="div" variant="success" className="w-100">
              {formatMessage(messages.verifiedBanner)}
            </Badge>
            <img src={verifiedRibbon} alt={formatMessage(messages.verifiedBannerRibbonAlt)} />
          </span>
        )
      }
    </>
  );
  return disableCourseTitle
    ? (<div className={wrapperClassName}>{image}</div>)
    : (
      <a
        className={wrapperClassName}
        href={homeUrl}
        onClick={handleImageClicked}
        tabIndex="-1"
      >
        {image}
      </a>
    );
};
CourseCardImage.propTypes = {
  cardId: PropTypes.string.isRequired,
  orientation: PropTypes.string.isRequired,
};

CourseCardImage.defaultProps = {};

export default CourseCardImage;
