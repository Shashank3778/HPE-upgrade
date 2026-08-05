import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { Badge } from '@openedx/paragon';

import messages from '../messages';
import { daycmp, isLearnerAssignment } from '../utils';

function hasAccess(item) {
  return item.learnerHasAccess;
}

function isComplete(assignment) {
  return assignment.complete;
}

function isPastDue(assignment) {
  return !isComplete(assignment) && (new Date(assignment.date) < new Date());
}

function isUnreleased(assignment) {
  return !assignment.link;
}

// Pass a null item if you want to get a whole day's badge list, not just one item's list.
// Returns an object with 'color' and 'badges' properties.
function getBadgeListAndColor(date, intl, item, items) {
  const now = new Date();
  const assignments = items.filter(isLearnerAssignment);
  const isToday = daycmp(date, now) === 0;
  const isInFuture = daycmp(date, now) > 0;

  // This badge info list is in order of priority (they will appear left to right in this order and the first badge
  // sets the color of the dot in the timeline).
  // Colors are literal Striverra design-system tokens (badge fill/text pairs are
  // chosen to clear 4.5:1, per the system's own accessibility notes), not Bootstrap
  // utility classes — those resolve through the stock Paragon brand, not Striverra's.
  const badgesInfo = [
    {
      message: messages.today,
      shownForDay: isToday,
      style: { background: '#EFF0FF', color: '#4750E0' },
    },
    {
      message: messages.completed,
      shownForDay: assignments.length && assignments.every(isComplete),
      shownForItem: x => isLearnerAssignment(x) && isComplete(x),
      style: { background: '#E5F7EB', color: '#1E7A3C' },
    },
    {
      message: messages.pastDue,
      shownForDay: assignments.length && assignments.every(isPastDue),
      shownForItem: x => isLearnerAssignment(x) && isPastDue(x),
      style: { background: '#FFF5EB', color: '#9C4607' },
    },
    {
      message: messages.dueNext,
      shownForDay: !isToday && assignments.some(x => x.dueNext),
      shownForItem: x => x.dueNext,
      style: { background: '#F2F4F5', color: '#334C58' },
    },
    {
      message: messages.unreleased,
      shownForDay: assignments.length && assignments.every(isUnreleased),
      shownForItem: x => isLearnerAssignment(x) && isUnreleased(x),
      style: {
        background: 'transparent', color: '#334C58', border: '1px solid #D9DEE0',
      },
    },
    {
      message: messages.verifiedOnly,
      shownForDay: items.length && items.every(x => !hasAccess(x)),
      shownForItem: x => !hasAccess(x),
      icon: faLock,
      style: { background: '#757575', color: '#fff' },
    },
  ];
  let color = null; // first color of any badge
  const badges = (
    <>
      {badgesInfo.map(b => {
        let shown = b.shownForDay;
        if (item) {
          if (b.shownForDay) {
            shown = false; // don't double up, if the day already has this badge
          } else {
            shown = b.shownForItem && b.shownForItem(item);
          }
        }
        if (!shown) {
          return null;
        }

        if (!color && !isInFuture) {
          color = b.style.background;
        }
        return (
          <Badge key={b.message.id} className="ml-2" style={b.style} data-testid="dates-badge">
            {b.icon && <FontAwesomeIcon icon={b.icon} className="mr-1" />}
            {intl.formatMessage(b.message)}
          </Badge>
        );
      })}
    </>
  );
  if (!color && isInFuture) {
    color = '#D9DEE0';
  }

  return {
    color,
    badges,
  };
}

// eslint-disable-next-line import/prefer-default-export
export { getBadgeListAndColor };
