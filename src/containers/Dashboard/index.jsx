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

export const Dashboard = () => {
  const { authenticatedUser } = React.useContext(AppContext);
  const { data, isPending } = useInitializeLearnerHome();
  const { pageTitle } = hooks.useDashboardMessages();
  const { selectSessionModal } = useSelectSessionModal();
  const showSelectSessionModal = selectSessionModal.cardId !== null;

  const courses = data?.courses || [];
  const hasCourses = useMemo(() => courses.length > 0, [courses]);

  // Count in-progress courses (started but not archived)
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