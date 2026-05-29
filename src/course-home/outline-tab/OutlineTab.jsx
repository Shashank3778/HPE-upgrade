import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { CourseOutlineTabNotificationsSlot } from '../../plugin-slots/CourseOutlineTabNotificationsSlot';
import { AlertList } from '../../generic/user-messages';

import CourseHeader from './widgets/CourseHeader';
import useCertificateAvailableAlert from './alerts/certificate-status-alert';
import useCourseEndAlert from './alerts/course-end-alert';
import useCourseStartAlert from '../../alerts/course-start-alert';
import usePrivateCourseAlert from './alerts/private-course-alert';
import useScheduledContentAlert from './alerts/scheduled-content-alert';
import { useModel } from '../../generic/model-store';
import AccountActivationAlert from '../../alerts/logistration-alert/AccountActivationAlert';
import CourseHomeSectionOutlineSlot from '../../plugin-slots/CourseHomeSectionOutlineSlot';
import ShiftDatesAlert from '../suggested-schedule-messaging/ShiftDatesAlert';
import UpgradeToShiftDatesAlert from '../suggested-schedule-messaging/UpgradeToShiftDatesAlert';
import { fetchOutlineTab } from '../data';
import './outline-tab.scss';

const TABS = ['Outline', 'Progress', 'Dates', 'Discussion', 'Notes', 'Bookmarks'];

const OutlineTab = () => {
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const {
    isSelfPaced,
    org,
  } = useModel('courseHomeMeta', courseId);

  const [activeTab, setActiveTab] = useState('Outline');

  const {
    courseBlocks: {
      courses,
      sections,
    } = {},
    datesWidget: {
      courseDateBlocks,
    } = {},
  } = useModel('outline', courseId) || {};

  const navigate = useNavigate();
  const location = useLocation();

  const eventProperties = {
    org_key: org,
    courserun_key: courseId,
  };

  const courseStartAlert = useCourseStartAlert(courseId);
  const courseEndAlert = useCourseEndAlert(courseId);
  const certificateAvailableAlert = useCertificateAvailableAlert(courseId);
  const privateCourseAlert = usePrivateCourseAlert(courseId);
  const scheduledContentAlert = useScheduledContentAlert(courseId);

  const rootCourseId = courses && Object.keys(courses)[0];

  const hasDeadlines = courseDateBlocks && courseDateBlocks.some(x => x.dateType === 'assignment-due-date');

  const logUpgradeToShiftDatesLinkClick = () => {
    sendTrackEvent('edx.bi.ecommerce.upsell_links_clicked', {
      ...eventProperties,
      linkCategory: 'personalized_learner_schedules',
      linkName: 'course_home_upgrade_shift_dates',
      linkType: 'button',
      pageName: 'course_home',
    });
  };

  const isEnterpriseUser = () => {
    const authenticatedUser = getAuthenticatedUser();
    const userRoleNames = authenticatedUser ? authenticatedUser.roles.map(role => role.split(':')[0]) : [];
    return userRoleNames.includes('enterprise_learner');
  };

  const learnerType = isEnterpriseUser() ? 'enterprise_learner' : 'b2c_learner';

  useEffect(() => {
    const currentParams = new URLSearchParams(location.search);
    const startCourse = currentParams.get('start_course');
    if (startCourse === '1') {
      sendTrackEvent('enrollment.email.clicked.startcourse', {});
      currentParams.delete('start_course');
      navigate({
        pathname: location.pathname,
        search: `?${currentParams.toString()}`,
        replace: true,
      });
    }
  }, [location.search]);

  return (
    <div className="outline-redesign" data-learner-type={learnerType}>
      {/* Course Header with progress */}
      <CourseHeader />

      {/* Tab navigation */}
      <nav className="outline-tab-nav" aria-label="Course tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            type="button"
            className={`outline-tab-nav-link${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
            aria-current={activeTab === tab ? 'page' : undefined}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Alerts */}
      <div className="outline-body">
        <AccountActivationAlert />
        <AlertList topic="outline-private-alerts" customAlerts={{ ...privateCourseAlert }} />
        <AlertList
          topic="outline-course-alerts"
          className="mb-3"
          customAlerts={{
            ...certificateAvailableAlert,
            ...courseEndAlert,
            ...courseStartAlert,
            ...scheduledContentAlert,
          }}
        />
        {isSelfPaced && hasDeadlines && (
          <>
            <ShiftDatesAlert model="outline" fetch={fetchOutlineTab} />
            <UpgradeToShiftDatesAlert model="outline" logUpgradeLinkClick={logUpgradeToShiftDatesLinkClick} />
          </>
        )}

        {/* Outline sections */}
        {rootCourseId && (
          <CourseHomeSectionOutlineSlot
            expandAll={false}
            sectionIds={courses[rootCourseId].sectionIds}
            sections={sections}
          />
        )}

        <CourseOutlineTabNotificationsSlot courseId={courseId} />
      </div>
    </div>
  );
};

export default OutlineTab;