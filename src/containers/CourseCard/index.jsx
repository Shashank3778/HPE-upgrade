import React from 'react';
import PropTypes from 'prop-types';

import { Card } from '@openedx/paragon';

import CourseCardBanners from './components/CourseCardBanners';
import CourseCardImage from './components/CourseCardImage';
import CourseCardMenu from './components/CourseCardMenu';
import CourseCardActions from './components/CourseCardActions';
import CourseCardDetails from './components/CourseCardDetails';
import CourseCardTitle from './components/CourseCardTitle';

import './CourseCard.scss';

export const CourseCard = ({ cardId }) => (
  <div className="course-card" id={cardId} data-testid="CourseCard">
    <Card orientation="vertical">
      <div className="d-flex flex-column h-100">
        <CourseCardImage cardId={cardId} orientation="vertical" />
        <Card.Body className="d-flex flex-column">
          <Card.Header
            title={<CourseCardTitle cardId={cardId} />}
            actions={<CourseCardMenu cardId={cardId} />}
          />
          <Card.Section className="pt-0 flex-grow-1">
            <CourseCardDetails cardId={cardId} />
          </Card.Section>
          <Card.Footer orientation="vertical">
          </Card.Footer>
        </Card.Body>
        <CourseCardBanners cardId={cardId} />
      </div>
    </Card>
  </div>
);

CourseCard.propTypes = {
  cardId: PropTypes.string.isRequired,
};

export default CourseCard;