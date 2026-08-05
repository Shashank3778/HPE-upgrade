import React, { useMemo } from 'react';
import moment from 'moment';
import { Icon } from '@openedx/paragon';
import { Star, PlayArrow } from '@openedx/paragon/icons';
import { useInitializeLearnerHome } from 'data/hooks';

// Built only from signals this app actually has: certificate.isEarned (+ availableDate)
// and enrollment.hasStarted (+ lastEnrolled). There's no forum/discussion or granular
// per-subsection completion API wired into this app, so those event types from the
// design mock aren't included here — showing them would mean fabricating data.
const ACTIVITY_TYPES = {
  certificate: { icon: Star, iconClass: 'recent-activity__icon--cert' },
  active: { icon: PlayArrow, iconClass: 'recent-activity__icon--active' },
};

export const RecentActivity = () => {
  const { data } = useInitializeLearnerHome();

  const activity = useMemo(() => {
    const courses = data?.courses || [];
    const items = [];
    courses.forEach((c) => {
      const courseName = c.course?.courseName;
      if (c.certificate?.isEarned && c.certificate?.availableDate) {
        items.push({
          key: `cert-${c.courseRun?.courseId}`,
          type: 'certificate',
          date: c.certificate.availableDate,
          text: <>Earned <strong>{courseName}</strong> certificate</>,
        });
      }
      if (c.enrollment?.hasStarted && c.enrollment?.lastEnrolled) {
        items.push({
          key: `active-${c.courseRun?.courseId}`,
          type: 'active',
          date: c.enrollment.lastEnrolled,
          text: <>Active in <strong>{courseName}</strong></>,
        });
      }
    });
    return items
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [data]);

  if (!activity.length) { return null; }

  return (
    <div className="dashboard-widget">
      <h3 className="dashboard-widget__title">Recent activity</h3>
      <div className="dashboard-widget__list">
        {activity.map((item) => {
          const { icon, iconClass } = ACTIVITY_TYPES[item.type];
          return (
            <div key={item.key} className="recent-activity-item">
              <span className={`recent-activity__icon ${iconClass}`}>
                <Icon src={icon} />
              </span>
              <div className="recent-activity-item__info">
                <p className="recent-activity-item__text">{item.text}</p>
                <p className="recent-activity-item__time">{moment(item.date).fromNow()}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;
