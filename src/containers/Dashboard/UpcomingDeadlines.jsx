import React, { useMemo } from 'react';
import { useInitializeLearnerHome } from 'data/hooks';

const getDaysRemaining = (endDate) => {
  if (!endDate) { return null; }
  const today = new Date();
  const end = new Date(endDate);
  const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  return diff;
};

const DeadlineBadge = ({ days }) => {
  if (days === null) { return null; }
  let label;
  let style;
  if (days <= 0) {
    label = 'ENDED';
    style = { background: '#FFEBEB', color: '#A32D2D' };
  } else if (days <= 7) {
    label = `IN ${days}D`;
    style = { background: '#FFF5EB', color: '#9C4607' };
  } else {
    label = `${days}D`;
    style = { background: '#F2F4F5', color: '#334C58' };
  }
  return (
    <span style={{
      ...style,
      display: 'inline-flex',
      alignItems: 'center',
      fontSize: 12,
      fontWeight: 600,
      lineHeight: '14px',
      padding: '4px 12px',
      borderRadius: 4,
      whiteSpace: 'nowrap',
    }}
    >
      {label}
    </span>
  );
};

export const UpcomingDeadlines = () => {
  const { data } = useInitializeLearnerHome();
  const courses = data?.courses || [];

  const deadlines = useMemo(() => courses
    .filter((c) => c.courseRun?.endDate && c.enrollment?.isEnrolled)
    .map((c) => ({
      name: c.course?.courseName,
      provider: c.courseProvider?.name,
      endDate: c.courseRun?.endDate,
      daysRemaining: getDaysRemaining(c.courseRun?.endDate),
      month: new Date(c.courseRun?.endDate).toLocaleString('en', { month: 'short' }).toUpperCase(),
      day: new Date(c.courseRun?.endDate).getDate(),
    }))
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
    .slice(0, 5),
  [courses]);

  if (!deadlines.length) { return null; }

  return (
    <div className="dashboard-widget">
      <h3 className="dashboard-widget__title">Upcoming deadlines</h3>
      <div className="dashboard-widget__list">
        {deadlines.map((d) => (
          <div key={d.endDate + d.name} className="deadline-item">
            <div className="deadline-item__date">
              <span className="deadline-item__month">{d.month}</span>
              <span className="deadline-item__day">{d.day}</span>
            </div>
            <div className="deadline-item__info">
              <p className="deadline-item__name">{d.name}</p>
              <p className="deadline-item__provider">{d.provider}</p>
            </div>
            <DeadlineBadge days={d.daysRemaining} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingDeadlines;