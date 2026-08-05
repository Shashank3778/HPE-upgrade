import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Icon } from '@openedx/paragon';
import { Apps } from '@openedx/paragon/icons';
import { baseAppUrl } from 'data/services/lms/urls';
import { useInitializeLearnerHome } from 'data/hooks';

import messages from './messages';

export const BrowseCatalogCard = () => {
  const { formatMessage } = useIntl();
  const { data: learnerData } = useInitializeLearnerHome();
  const courseSearchUrl = learnerData?.platformSettings?.courseSearchUrl || '';

  if (!courseSearchUrl) { return null; }

  return (
    <div className="browse-catalog-card">
      <div className="browse-catalog-card__left">
        <span className="browse-catalog-card__icon">
          <Icon src={Apps} />
        </span>
        <div>
          <p className="browse-catalog-card__title">
            {formatMessage(messages.browseCatalogTitle)}
          </p>
          <p className="browse-catalog-card__subtitle">
            {formatMessage(messages.browseCatalogSubtitle)}
          </p>
        </div>
      </div>
      <a href={baseAppUrl(courseSearchUrl)} className="browse-catalog-card__btn">
        {formatMessage(messages.browseCatalogButton)}
      </a>
    </div>
  );
};

export default BrowseCatalogCard;
