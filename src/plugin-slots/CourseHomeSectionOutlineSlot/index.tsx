import React from 'react';
import { PluginSlot } from '@openedx/frontend-plugin-framework';
import Section from '@src/course-home/outline-tab/section-outline/Section';

interface Props {
  expandAll: boolean;
  sections: Record<string, any>;
  sectionIds: string[];
  sequences?: Record<string, any>;
}

const CourseHomeSectionOutlineSlot: React.FC<Props> = ({
  expandAll, sections, sectionIds, sequences = {},
}) => {
  /**
   * A section is locked ONLY if:
   * 1. It has sequences AND
   * 2. ALL of its sequences have showLink=false (LMS gating signal meaning access is blocked)
   *
   * This means: if a section has no prerequisite set in Studio, showLink will be true
   * and the section will be open regardless of whether previous sections are complete.
   */
  const isSectionLocked = (sectionId: string): boolean => {
    const section = sections[sectionId];
    if (!section?.sequenceIds?.length) { return false; }

    // If every sequence in this section has showLink=false, it's gated
    return section.sequenceIds.every((seqId: string) => {
      const seq = sequences[seqId];
      return seq && seq.showLink === false;
    });
  };

  return (
    <PluginSlot
      id="org.openedx.frontend.learning.course_home_section_outline.v1"
      idAliases={['course_home_section_outline_slot']}
      pluginProps={{ expandAll, sectionIds, sections }}
    >
      <ol id="courseHome-outline" className="list-unstyled" style={{ margin: 0, padding: 0 }}>
        {sectionIds.map((sectionId, idx) => {
          const section = sections[sectionId];
          const isLocked = isSectionLocked(sectionId);

          // Find which section number is the prerequisite
          // (the last non-locked section before this one)
          let lockReason: string | undefined;
          if (isLocked) {
            // Find the previous section's number for the message
            const prevIdx = idx - 1;
            lockReason = prevIdx >= 0
              ? `Unlocks when Section ${prevIdx + 1} is complete`
              : 'Prerequisites not met';
          }

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