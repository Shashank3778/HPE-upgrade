import React, { useMemo } from 'react';

import { AppContext } from '@edx/frontend-platform/react';
import { useSelectSessionModal } from 'data/context';
import { useInitializeLearnerHome } from 'data/hooks';
import SelectSessionModal from 'containers/SelectSessionModal';
import CoursesPanel from 'containers/CoursesPanel';
import DashboardModalSlot from 'plugin-slots/DashboardModalSlot';

import LoadingView from './LoadingView';
import DashboardLayout from './DashboardLayout';
import hooks from './hooks';
import './index.scss';

// Get time-based greeting
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) { return 'Good morning'; }
  if (hour < 17) { return 'Good afternoon'; }
  return 'Good evening';
};

// Get color for course initials badge
const BADGE_COLORS = ['#5b5bd6', '#1d9e75', '#e67e22', '#e74c3c', '#8e44ad', '#2980b9'];
const getBadgeColor = (index) => BADGE_COLORS[index % BADGE_COLORS.length];

// Get initials from course name
const getCourseInitials = (name = '') => {
  const words = name.trim().split(' ').filter(Boolean);
  if (words.length === 1) { return words[0].substring(0, 2).toUpperCase(); }
  return (words[0][0] + words[1][0]).toUpperCase();
};

// Course banner — shows course with nearest deadline
const CourseBanner = ({ courses }) => {
  const featured = useMemo(() => {
    const enrolled = courses.filter((c) => c.enrollment?.isEnrolled && c.enrollment?.hasStarted);
    if (!enrolled.length) { return null; }
    // Sort by end date (nearest first), fallback to last enrolled
    const withEnd = enrolled.filter((c) => c.courseRun?.endDate);
    if (withEnd.length) {
      return withEnd.sort((a, b) => new Date(a.courseRun.endDate) - new Date(b.courseRun.endDate))[0];
    }
    return enrolled[0];
  }, [courses]);

  if (!featured) { return null; }

  const courseName = featured.course?.courseName || '';
  const resumeUrl = featured.courseRun?.resumeUrl || featured.courseRun?.homeUrl || '#';
  const endDate = featured.courseRun?.endDate;
  const daysLeft = endDate
    ? Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="course-banner">
      <div className="course-banner__left">
        <div className="course-banner__initials">
          {getCourseInitials(courseName)}
        </div>
        <div className="course-banner__info">
          <p className="course-banner__label">CONTINUE WHERE YOU LEFT OFF</p>
          <h3 className="course-banner__name">{courseName}</h3>
          <p className="course-banner__provider">{featured.courseProvider?.name}</p>
        </div>
      </div>
      <div className="course-banner__right">
        <a href={resumeUrl} className="course-banner__btn">
          Resume →
        </a>
        {daysLeft !== null && (
          <p className="course-banner__deadline">
            {daysLeft <= 0 ? 'Course ended' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
          </p>
        )}
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const { authenticatedUser } = React.useContext(AppContext);
  const { data, isPending } = useInitializeLearnerHome();
  const { pageTitle } = hooks.useDashboardMessages();
  const { selectSessionModal } = useSelectSessionModal();
  const showSelectSessionModal = selectSessionModal.cardId !== null;

  const courses = data?.courses || [];
  const hasCourses = useMemo(() => courses.length > 0, [courses]);

  const inProgressCount = useMemo(
    () => courses.filter((c) => c.enrollment?.hasStarted && !c.courseRun?.isArchived).length,
    [courses],
  );

  const firstName = authenticatedUser?.name?.split(' ')[0]
    || authenticatedUser?.username
    || 'there';

  return (
    <div id="dashboard-container" className="d-flex flex-column p-2 pt-0">
      <h1 className="sr-only">{pageTitle}</h1>

      {/* Greeting */}
      {!isPending && (
        <div className="dashboard-greeting">
          <h2 className="dashboard-greeting__title">
            {getGreeting()}, {firstName}
          </h2>
          {inProgressCount > 0 && (
            <p className="dashboard-greeting__subtitle">
              {inProgressCount} course{inProgressCount > 1 ? 's' : ''} in progress
            </p>
          )}
        </div>
      )}

      {/* Course banner — nearest deadline course */}
      {!isPending && courses.length > 0 && (
        <CourseBanner courses={courses} />
      )}

      {!isPending && (
        <>
          <DashboardModalSlot />
          {(hasCourses && showSelectSessionModal) && <SelectSessionModal />}
        </>
      )}

      <div id="dashboard-content" data-testid="dashboard-content">
        {isPending
          ? (<LoadingView />)
          : (
            <DashboardLayout>
              <CoursesPanel />
            </DashboardLayout>
          )}
      </div>
    </div>
  );
};

export default Dashboard;