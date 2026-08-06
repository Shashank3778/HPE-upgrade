import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { Hyperlink } from '@openedx/paragon';
import get from 'lodash.get';

import classNames from 'classnames';
import messages from './Certificates.messages';

// Cycle through a small palette of soft banner colors, deterministically
// chosen from the course id so the same course always gets the same color.
const BANNER_VARIANTS = ['blue', 'purple', 'teal', 'green', 'peach', 'mint'];

const getBannerVariant = (key) => {
  if (!key) { return BANNER_VARIANTS[0]; }
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) % BANNER_VARIANTS.length;
  }
  return BANNER_VARIANTS[Math.abs(hash) % BANNER_VARIANTS.length];
};

// "Foundations of Python Programming" -> "PY" (first letters of the first
// two significant words, skipping short filler words).
const getBadgeInitials = (title) => {
  if (!title) { return '--'; }
  const words = title
    .split(/\s+/)
    .filter((word) => word.length > 2 || /^[A-Z]/.test(word));
  const source = words.length ? words : title.split(/\s+/);
  if (source.length === 1) { return source[0].slice(0, 2).toUpperCase(); }
  return (source[0].charAt(0) + source[1].charAt(0)).toUpperCase();
};

const CertificateCard = ({
  certificateType,
  courseDisplayName,
  courseOrganization,
  modifiedDate,
  downloadUrl,
  courseId,
  uuid,
}) => {
  const intl = useIntl();
  const badgeInitials = getBadgeInitials(courseDisplayName);
  const bannerVariant = getBannerVariant(courseId);
  // Only one certificate URL is exposed by the API today, so "View" and
  // "Download PDF" both point at it rather than fabricating a second link.
  const shortId = uuid ? uuid.replace(/-/g, '').slice(0, 6) : null;

  return (
    <div
      key={`${modifiedDate}-${courseId}`}
      className="pp-cert-card"
    >
      <div className={classNames('pp-cert-banner', `pp-cert-banner--${bannerVariant}`)}>
        <span className="pp-cert-badge">{badgeInitials}</span>
      </div>
      <div className="pp-cert-body">
        <p className="pp-cert-title m-0">{courseDisplayName}</p>
        <p className="pp-cert-meta m-0">
          <FormattedMessage
            id="profile.certificate.meta.line"
            defaultMessage="Issued {date} · {organization}{idSuffix}"
            description="Certificate metadata line: issue date, organization and a short id"
            values={{
              date: <FormattedDate value={new Date(modifiedDate)} />,
              organization: courseOrganization,
              idSuffix: shortId ? ` · ID #${badgeInitials}-${shortId}` : '',
            }}
          />
        </p>
        <p className="sr-only">
          {intl.formatMessage(get(
            messages,
            `profile.certificates.types.${certificateType}`,
            messages['profile.certificates.types.unknown'],
          ))}
        </p>
        <div className="pp-cert-actions">
          <Hyperlink
            destination={downloadUrl}
            target="_blank"
            showLaunchIcon={false}
            className="btn btn-outline-primary btn-sm pp-cert-actions__view"
          >
            <FormattedMessage
              id="profile.certificate.view"
              defaultMessage="View"
              description="Button to view a certificate"
            />
          </Hyperlink>
          <Hyperlink
            destination={downloadUrl}
            target="_blank"
            showLaunchIcon={false}
            className="pp-cert-actions__download"
          >
            {intl.formatMessage(messages['profile.certificates.download.pdf'])}
          </Hyperlink>
        </div>
      </div>
    </div>
  );
};

CertificateCard.propTypes = {
  certificateType: PropTypes.string,
  courseDisplayName: PropTypes.string,
  courseOrganization: PropTypes.string,
  modifiedDate: PropTypes.string,
  downloadUrl: PropTypes.string,
  courseId: PropTypes.string.isRequired,
  uuid: PropTypes.string,
};

CertificateCard.defaultProps = {
  certificateType: 'unknown',
  courseDisplayName: '',
  courseOrganization: '',
  modifiedDate: '',
  downloadUrl: '',
  uuid: '',
};

export default CertificateCard;