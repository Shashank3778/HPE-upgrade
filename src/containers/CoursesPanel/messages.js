import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  myCourses: {
    id: 'dashboard.mycourses',
    defaultMessage: 'My Courses',
    description: 'Course list heading',
  },
  browseCatalogTitle: {
    id: 'dashboard.browseCatalog.title',
    defaultMessage: 'Browse the course catalog',
    description: 'Title for the catalog CTA card shown below the course list',
  },
  browseCatalogSubtitle: {
    id: 'dashboard.browseCatalog.subtitle',
    defaultMessage: 'Discover more courses to add to your learning path.',
    description: 'Subtitle for the catalog CTA card shown below the course list',
  },
  browseCatalogButton: {
    id: 'dashboard.browseCatalog.button',
    defaultMessage: 'Browse catalog',
    description: 'Button label for the catalog CTA card shown below the course list',
  },
});

export default messages;
