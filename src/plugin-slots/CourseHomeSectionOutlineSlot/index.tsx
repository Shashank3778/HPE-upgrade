import React from 'react';
import { PluginSlot } from '@openedx/frontend-plugin-framework';
import Section from '@src/course-home/outline-tab/section-outline/Section';

interface Props {
  expandAll: boolean;
  sections: Record<string, any>;
  sectionIds: string[];
}

const CourseHomeSectionOutlineSlot: React.FC<Props> = ({
  expandAll, sections, sectionIds,
}) => {
  // Determine lock state: a section is locked if any prior section is incomplete
  // (prerequisite gating — the section won't have showLink on its sequences)
  const lockedState: boolean[] = sectionIds.map((sectionId, idx) => {
    if (idx === 0) { return false; }
    // If the previous section is not complete, this one is locked
    const prevSection = sections[sectionIds[idx - 1]];
    return prevSection && !prevSection.complete && idx > 0
      ? !prevSection.complete
      : false;
  });

  // Propagate lock forward: if a section is locked, all after it are too
  for (let i = 1; i < lockedState.length; i++) {
    if (lockedState[i - 1]) { lockedState[i] = true; }
  }

  return (
    <PluginSlot
      id="org.openedx.frontend.learning.course_home_section_outline.v1"
      idAliases={['course_home_section_outline_slot']}
      pluginProps={{ expandAll, sectionIds, sections }}
    >
      <ol id="courseHome-outline" className="list-unstyled" style={{ margin: 0, padding: 0 }}>
        {sectionIds.map((sectionId, idx) => {
          const section = sections[sectionId];
          const isLocked = lockedState[idx];
          const lockReason = isLocked
            ? `Unlocks when Section ${idx} is complete`
            : undefined;
          return (
            <Section
              key={sectionId}
              defaultOpen={section.resumeBlock}
              expand={expandAll}
              section={section}
              sectionIndex={idx}
              isLocked={isLocked}
              lockReason={lockReason}
            />
          );
        })}
      </ol>
    </PluginSlot>
  );
};

export default CourseHomeSectionOutlineSlot;