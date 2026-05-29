import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useModel } from '../../../generic/model-store';
import { useContextId } from '../../../data/hooks';

interface Props {
  defaultOpen: boolean;
  expand: boolean;
  section: {
    complete: boolean;
    sequenceIds: string[];
    title: string;
    hideFromTOC: boolean;
  };
  sectionIndex: number;
  isLocked?: boolean;
  lockReason?: string;
}

// SVG icons inlined to avoid paragon dependency on redesign
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LockIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="3" y="7" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
  >
    <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Section: React.FC<Props> = ({
  defaultOpen,
  expand,
  section,
  sectionIndex,
  isLocked = false,
  lockReason,
}) => {
  const courseId = useContextId();
  const {
    complete,
    sequenceIds,
    title,
    hideFromTOC,
  } = section;

  const {
    courseBlocks: { sequences },
  } = useModel('outline', courseId);

  const [open, setOpen] = useState(defaultOpen && !isLocked);

  useEffect(() => {
    setOpen(expand && !isLocked);
  }, [expand]);

  useEffect(() => {
    setOpen(defaultOpen && !isLocked);
  }, []);

  // Compute section stats
  const totalSeqs = sequenceIds.length;
  const completedSeqs = sequenceIds.filter(id => sequences[id]?.complete).length;
  const pct = totalSeqs > 0 ? Math.round((completedSeqs / totalSeqs) * 100) : 0;

  // Determine section status
  const status = isLocked ? 'locked' : complete ? 'complete' : completedSeqs > 0 ? 'active' : 'pending';

  const badgeLabel = () => {
    if (isLocked) return 'Locked';
    if (complete) return '✓ Complete';
    if (status === 'active') return 'Active';
    return null;
  };

  const badgeClass = isLocked ? 'locked' : complete ? 'complete' : status === 'active' ? 'active' : '';

  // Effort total
  const totalMins = sequenceIds.reduce((acc, id) => acc + (sequences[id]?.effortTime || 0), 0);
  const effortStr = totalMins > 0
    ? totalMins >= 60 ? `${Math.floor(totalMins / 60)}h ${totalMins % 60 > 0 ? totalMins % 60 + 'm' : ''}`.trim() : `${totalMins}m`
    : null;

  return (
    <div className={`section-card${isLocked ? ' section-locked' : ''}`}>
      {/* Section header */}
      <div
        className={`section-header${open ? ' open' : ''}`}
        onClick={() => !isLocked && setOpen(o => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!isLocked) setOpen(o => !o); } }}
        aria-expanded={open}
      >
        {/* Toggle chevron */}
        <span className={`section-toggle-icon${isLocked ? ' text-muted' : ''}`}>
          {isLocked ? <LockIcon size={14} /> : <ChevronIcon open={open} />}
        </span>

        {/* Title + meta */}
        <div className="section-title-text">
          <span className="section-name">
            Section {sectionIndex + 1} · {title}
          </span>
          <div className="section-meta-row">
            <span>{totalSeqs} subsections</span>
            {effortStr && (
              <>
                <span className="section-meta-dot">·</span>
                <span>{effortStr}</span>
              </>
            )}
            {isLocked && lockReason && (
              <>
                <span className="section-meta-dot">·</span>
                <span style={{ color: '#f97316' }}>{lockReason}</span>
              </>
            )}
            {complete && !isLocked && (
              <>
                <span className="section-meta-dot">·</span>
                <span style={{ color: '#16a34a' }}>Completed</span>
              </>
            )}
            {status === 'active' && (
              <>
                <span className="section-meta-dot">·</span>
                <span>In progress</span>
              </>
            )}
          </div>
        </div>

        {/* Right: mini progress + badge */}
        <div className="section-header-right">
          {!isLocked && (
            <div className="section-progress-mini">
              <span>{completedSeqs}/{totalSeqs}</span>
              <div className="mini-bar-track">
                <div
                  className={`mini-bar-fill ${complete ? 'complete' : status === 'active' ? 'active' : 'locked'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}
          {badgeLabel() && (
            <span className={`section-badge ${badgeClass}`}>
              {isLocked && <LockIcon size={10} />}
              {badgeLabel()}
            </span>
          )}
        </div>
      </div>

      {/* Subsection list */}
      {open && !isLocked && (
        <ol className="sequence-list">
          {sequenceIds.map((sequenceId, idx) => {
            const seq = sequences[sequenceId];
            if (!seq) { return null; }
            const seqComplete = seq.complete;
            const inProgress = seq.resumeBlock && !seqComplete;
            const seqStatus = seqComplete ? 'done' : inProgress ? 'in-progress' : 'pending';
            const absNumber = sequenceId.slice(-3).replace(/[^0-9]/g, '') || String(idx + 1);

            return (
              <li
                key={sequenceId}
                className={`sequence-row${!seq.showLink ? '' : ''}`}
              >
                {/* Status icon */}
                <div className={`seq-icon ${seqStatus}`}>
                  {seqComplete && <CheckIcon />}
                </div>

                {/* Title + description */}
                <div className="seq-info">
                  <span className="seq-title">
                    {seq.showLink ? (
                      <Link to={`/course/${courseId}/${sequenceId}`}>{seq.title}</Link>
                    ) : seq.title}
                  </span>
                  {seq.description && (
                    <span className="seq-desc">{seq.description}</span>
                  )}
                  {seq.effortTime && (
                    <span className="seq-desc">
                      {seq.effortActivities ? `${seq.effortActivities} · ` : ''}
                      {seq.effortTime >= 60
                        ? `${Math.floor(seq.effortTime / 60)}h ${seq.effortTime % 60 > 0 ? seq.effortTime % 60 + ' min' : ''}`
                        : `${seq.effortTime} min`}
                      {seq.due ? ` · Due ${new Date(seq.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}
                    </span>
                  )}
                </div>

                {/* Sequence number */}
                <span className="seq-number">{sectionIndex + 1}{String.fromCharCode(97 + idx)}</span>
              </li>
            );
          })}
        </ol>
      )}

      {/* Locked placeholder */}
      {isLocked && (
        <div style={{ padding: '0.75rem 1.2rem 0.85rem', borderTop: '1px solid #f3f4f6' }}>
          <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
            {lockReason || 'Complete the previous section to unlock this content.'}
          </span>
        </div>
      )}
    </div>
  );
};

export default Section;