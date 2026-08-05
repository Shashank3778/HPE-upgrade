import React, { useMemo } from 'react';
import { useInitializeLearnerHome } from 'data/hooks';
import { getCourseInitials, getCourseTint } from 'utils/courseVisuals';

export const CertificatesWidget = () => {
  const { data } = useInitializeLearnerHome();
  const courses = data?.courses || [];

  const earnedCerts = useMemo(
    () => courses.filter((c) => c.certificate?.isEarned),
    [courses],
  );

  const visibleBadges = earnedCerts.slice(0, 3);
  const extraCount = earnedCerts.length - visibleBadges.length;

  return (
    <div className="dashboard-widget cert-widget">
      <div className="cert-widget__header">
        <h3 className="dashboard-widget__title">Certificates</h3>
        {earnedCerts.length > 0 && (
          <a href="/dashboard" className="cert-widget__view-all">View all →</a>
        )}
      </div>

      {/* Count */}
      <div className="cert-widget__count">
        <span className="cert-widget__number">{earnedCerts.length}</span>
        <span className="cert-widget__label">earned this year</span>
      </div>

      {/* Badges row */}
      <div className="cert-widget__badges">
        {visibleBadges.map((c, i) => (
          <div
            key={c.courseRun?.courseId || i}
            className="cert-badge"
            style={{ background: getCourseTint(c.courseRun?.courseId || c.course?.courseName) }}
            title={c.course?.courseName}
          >
            {getCourseInitials(c.course?.courseName)}
          </div>
        ))}
        {extraCount > 0 && (
          <div className="cert-badge cert-badge--extra">
            +{extraCount}
          </div>
        )}
      </div>

      {/* Link */}
      <a href="/dashboard" className="cert-widget__link">
        See your certificates →
      </a>
    </div>
  );
};

export default CertificatesWidget;