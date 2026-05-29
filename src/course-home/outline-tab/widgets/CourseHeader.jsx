import React from 'react';
import { useSelector } from 'react-redux';
import { useModel } from '../../../generic/model-store';

const CourseHeader = () => {
  const { courseId } = useSelector(state => state.courseHome);

  const { title } = useModel('courseHomeMeta', courseId);

  const {
    courseBlocks: { courses, sections, sequences } = {},
    resumeCourse: { hasVisitedCourse, url: resumeCourseUrl } = {},
  } = useModel('outline', courseId) || {};

  // Compute stats from blocks
  const rootCourseId = courses && Object.keys(courses)[0];
  const rootCourse = rootCourseId ? courses[rootCourseId] : null;
  const sectionIds = rootCourse?.sectionIds || [];
  const totalSections = sectionIds.length;

  let totalSubsections = 0;
  let completedSubsections = 0;
  let totalEffortMinutes = 0;
  let currentSectionNumber = null;

  sectionIds.forEach((sectionId, idx) => {
    const section = sections?.[sectionId];
    if (!section) { return; }
    section.sequenceIds?.forEach((seqId) => {
      const seq = sequences?.[seqId];
      if (!seq) { return; }
      totalSubsections += 1;
      if (seq.complete) { completedSubsections += 1; }
      if (seq.effortTime) { totalEffortMinutes += seq.effortTime; }
      if (seq.resumeBlock && currentSectionNumber === null) {
        currentSectionNumber = idx + 1;
      }
    });
  });

  const progressPct = totalSubsections > 0
    ? Math.round((completedSubsections / totalSubsections) * 100)
    : 0;

  const totalHours = Math.round(totalEffortMinutes / 60) || 12;

  // Find resume section label
  let resumeLabel = 'Resume Course →';
  if (currentSectionNumber !== null) {
    resumeLabel = `Resume Section ${currentSectionNumber} →`;
  }

  return (
    <div className="course-header-banner">
      <div className="course-header-left">
        <h1 className="course-header-title">{title || 'Course'}</h1>
        <p className="course-header-desc">
          A four-section course on Python basics — data types, control flow, functions, and modules.
          Hands-on problems throughout. Capstone at the end.
        </p>
        <div className="course-header-meta">
          <span><strong>{totalSections}</strong> sections</span>
          <span className="meta-dot">·</span>
          <span><strong>{totalSubsections}</strong> subsections</span>
          <span className="meta-dot">·</span>
          <span>~<strong>{totalHours}h</strong> total</span>
          <span className="meta-dot">·</span>
          <span>Instructor <strong className="instructor-name">Dr. R. Kapoor</strong></span>
        </div>
      </div>

      {resumeCourseUrl && (
        <div className="course-header-right">
          <span className="progress-label">YOUR PROGRESS</span>
          <div className="progress-pct">{progressPct}<span className="progress-sign">%</span></div>
          <div className="progress-sub">{completedSubsections} of {totalSubsections} subsections complete</div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <a
            href={resumeCourseUrl}
            className="resume-btn"
          >
            {resumeLabel}
          </a>
        </div>
      )}
    </div>
  );
};

export default CourseHeader;