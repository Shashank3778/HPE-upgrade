import React, { useMemo } from 'react';
import { useInitializeLearnerHome } from 'data/hooks';
import { baseAppUrl } from 'data/services/lms/urls';

export const CertificatesWidget = () => {
  const { data } = useInitializeLearnerHome();
  const courses = data?.courses || [];

  const earnedCerts = useMemo(
    () => courses.filter((c) => c.certificate?.isEarned),
    [courses],
  );

  return (
    <div className="dashboard-widget">
      <h3 className="dashboard-widget__title">Certificates</h3>
      {earnedCerts.length === 0 ? (
        <div className="certificates-empty">
          <p className="certificates-empty__msg">
            Complete a course to earn your first certificate!
          </p>
        </div>
      ) : (
        <>
          <div className="certificates-count">
            <span className="certificates-count__number">{earnedCerts.length}</span>
            <span className="certificates-count__label">
              certificate{earnedCerts.length > 1 ? 's' : ''} earned
            </span>
          </div>
          <div className="dashboard-widget__list">
            {earnedCerts.map((c) => (
              <div key={c.courseRun?.courseId} className="certificate-item">
                <div className="certificate-item__icon">
                  {/* Medal icon */}
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#5b5bd6" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div className="certificate-item__info">
                  <p className="certificate-item__name">{c.course?.courseName}</p>
                  <p className="certificate-item__provider">{c.courseProvider?.name}</p>
                </div>
                {c.certificate?.certPreviewUrl && (
                  <a
                    href={baseAppUrl(c.certificate.certPreviewUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="certificate-item__link"
                  >
                    View
                  </a>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CertificatesWidget;