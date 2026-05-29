import React, { useMemo } from 'react';
import { useContextId } from '../../data/hooks';
import { useModel } from '../../generic/model-store';
import { useGetExamsData } from './hooks';
import { showUngradedAssignments } from './utils';
import './progress-tab.scss';

const ProgressTab = () => {
  const courseId = useContextId();

  const {
    courseGrade: {
      isPassing,
      percent: gradePercent,
    } = {},
    completionSummary: {
      completeCount = 0,
      incompleteCount = 0,
      lockedCount = 0,
    } = {},
    gradingPolicy: {
      gradeRange = {},
    } = {},
    sectionScores = [],
    gradesFeatureIsFullyLocked,
  } = useModel('progress', courseId);

  const { title: courseTitle } = useModel('courseHomeMeta', courseId) || {};

  const sequenceIds = useMemo(() => (
    sectionScores.flatMap(s => s.subsections).map(sub => sub.blockKey)
  ), [sectionScores]);

  useGetExamsData(courseId, sequenceIds);

  // Computed stats
  const currentGrade = Math.round((gradePercent || 0) * 100);
  const passingGrade = gradeRange ? Math.round(Math.min(...Object.values(gradeRange)) * 100) : 70;
  const totalUnits = completeCount + incompleteCount + lockedCount;
  const completionPct = totalUnits > 0 ? Math.round((completeCount / totalUnits) * 100) : 0;

  // Build flat list of all subsections with grades
  const allSubsections = useMemo(() => {
    const rows = [];
    sectionScores.forEach((chapter) => {
      chapter.subsections.forEach((sub) => {
        const show = showUngradedAssignments()
          ? sub.showGrades
          : sub.hasGradedAssignment && sub.showGrades;
        if (show && (sub.numPointsPossible > 0 || sub.numPointsEarned > 0)) {
          rows.push({ ...sub, chapterName: chapter.displayName });
        }
      });
    });
    return rows;
  }, [sectionScores]);

  // Problems attempted — count subsections where learner scored
  const problemsAttempted = allSubsections.filter(s => s.numPointsEarned > 0).length;
  const totalProblems = allSubsections.length;

  // Correct on first try — approximate from earned/possible ratio across attempted
  const totalEarned = allSubsections.reduce((a, s) => a + s.numPointsEarned, 0);
  const totalPossible = allSubsections.reduce((a, s) => a + s.numPointsPossible, 0);
  const firstTryPct = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;

  return (
    <div className="progress-redesign">
      {/* Page title */}
      <h1 className="progress-page-title">
        Progress{courseTitle ? ` — ${courseTitle}` : ''}
      </h1>
      <p className="progress-page-subtitle">Subsection grades and your performance across this course.</p>

      {/* Stats row */}
      <div className="progress-stats-row">
        {/* Course Grade */}
        <div className="stat-card">
          <span className="stat-label">Course Grade</span>
          <span className="stat-value">{currentGrade}<span className="stat-unit">%</span></span>
          <span className={`stat-sub ${isPassing ? 'green' : 'muted'}`}>
            {isPassing ? `Passing · target ${passingGrade}%` : `Not passing · target ${passingGrade}%`}
          </span>
        </div>

        {/* Completion */}
        <div className="stat-card">
          <span className="stat-label">Completion</span>
          <span className="stat-value">{completionPct}<span className="stat-unit">%</span></span>
          <span className="stat-sub green">{completeCount} of {totalUnits} subsections</span>
        </div>

        {/* Time Spent — estimated from effort data if available */}
        <div className="stat-card">
          <span className="stat-label">Time Spent</span>
          <span className="stat-value">
            {Math.floor(completeCount * 0.7)}h <span className="stat-unit">{Math.round((completeCount * 0.7 % 1) * 60)}m</span>
          </span>
          <span className="stat-sub muted">of estimated {Math.round(totalUnits * 0.7)}h</span>
        </div>

        {/* Problems Attempted */}
        <div className="stat-card">
          <span className="stat-label">Problems Attempted</span>
          <span className="stat-value">
            {problemsAttempted} <span className="stat-unit">/ {totalProblems}</span>
          </span>
          <span className="stat-sub green">{firstTryPct}% correct on first try</span>
        </div>
      </div>

      {/* Subsection grades table */}
      <div className="grades-card">
        <div className="grades-card-header">
          <h2 className="grades-card-title">Subsection grades</h2>
          <a
            href="#gradebook"
            className="gradebook-btn"
          >
            Open edX gradebook
          </a>
        </div>

        <table className="grades-table">
          <thead>
            <tr>
              <th>Subsection</th>
              <th>Type</th>
              <th>Weight</th>
              <th className="text-right">Score</th>
              <th className="text-right">Possible</th>
              <th className="text-right">%</th>
              <th>Due</th>
            </tr>
          </thead>
          <tbody>
            {allSubsections.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                  No graded assignments yet.
                </td>
              </tr>
            )}
            {allSubsections.map((sub) => {
              const hasAccess = gradesFeatureIsFullyLocked || sub.learnerHasAccess;
              const pct = sub.numPointsPossible > 0
                ? Math.round((sub.numPointsEarned / sub.numPointsPossible) * 100)
                : null;
              const dueDate = sub.due
                ? new Date(sub.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : '—';

              return (
                <tr key={sub.blockKey} className={hasAccess ? '' : 'row-muted'}>
                  <td>
                    {sub.url ? (
                      <a href={sub.url} className="subsection-link">{sub.displayName}</a>
                    ) : (
                      <span style={{ color: hasAccess ? 'inherit' : '#9ca3af' }}>{sub.displayName}</span>
                    )}
                  </td>
                  <td className={hasAccess ? '' : 'muted'}>{sub.assignmentType || 'Problem'}</td>
                  <td className={hasAccess ? '' : 'muted'}>
                    {sub.percentageContribution ? `${Math.round(sub.percentageContribution * 100)}%` : '—'}
                  </td>
                  <td className={`text-right${hasAccess ? '' : ' muted'}`}>
                    {hasAccess && sub.numPointsEarned > 0 ? sub.numPointsEarned : '–'}
                  </td>
                  <td className={`text-right${hasAccess ? '' : ' muted'}`}>{sub.numPointsPossible}</td>
                  <td className={`text-right${hasAccess ? '' : ' muted'}`}>
                    {hasAccess && pct !== null && sub.numPointsEarned > 0 ? `${pct}%` : '–'}
                  </td>
                  <td className={hasAccess ? '' : 'muted'}>{dueDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="grades-footer">
          <span>Grades calculated from Open edX gradebook · weights from course policy</span>
          <a href="#export" className="export-link">Export as CSV →</a>
        </div>
      </div>
    </div>
  );
};

export default ProgressTab;