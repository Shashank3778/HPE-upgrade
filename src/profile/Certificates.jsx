import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { connect } from 'react-redux';
import { getConfig } from '@edx/frontend-platform';
import { Hyperlink } from '@openedx/paragon';

import CertificateCard from './CertificateCard';
import { certificatesSelector } from './data/selectors';

const Certificates = ({ certificates }) => {
  const firstCertificateUrl = certificates?.[0]?.downloadUrl;

  return (
    <div className="pp-certs">
      <div className="pp-certs__header">
        <div>
          <p className="pp-certs__heading m-0">
            <FormattedMessage
              id="profile.certificates.heading"
              defaultMessage="Certificates"
              description="heading for the certificates section"
            />
          </p>
          <p className="pp-certs__description m-0">
            <FormattedMessage
              id="profile.certificates.description"
              defaultMessage="Your learner records information is only visible to you. Only your username and profile image are visible to others on {siteName}."
              description="description of the certificates section"
              values={{
                siteName: getConfig().SITE_NAME,
              }}
            />
          </p>
        </div>
        {firstCertificateUrl && (
          <Hyperlink
            destination={firstCertificateUrl}
            target="_blank"
            showLaunchIcon={false}
            className="pp-certs__view-link"
          >
            <FormattedMessage
              id="profile.certificates.view.a.certificate"
              defaultMessage="View a certificate →"
              description="link that opens the most recent certificate"
            />
          </Hyperlink>
        )}
      </div>
      {certificates?.length > 0 ? (
        <div className="pp-certs__grid">
          {certificates.map(certificate => (
            <CertificateCard
              key={certificate.courseId}
              certificateType={certificate.certificateType}
              courseDisplayName={certificate.courseDisplayName}
              courseOrganization={certificate.courseOrganization}
              modifiedDate={certificate.modifiedDate}
              downloadUrl={certificate.downloadUrl}
              courseId={certificate.courseId}
              uuid={certificate.uuid}
            />
          ))}
        </div>
      ) : (
        <div className="pp-certs__empty">
          <FormattedMessage
            id="profile.no.certificates"
            defaultMessage="You don't have any certificates yet."
            description="displays when user has no course completion certificates"
          />
        </div>
      )}
    </div>
  );
};

Certificates.propTypes = {
  certificates: PropTypes.arrayOf(PropTypes.shape({
    certificateType: PropTypes.string,
    courseDisplayName: PropTypes.string,
    courseOrganization: PropTypes.string,
    modifiedDate: PropTypes.string,
    downloadUrl: PropTypes.string,
    courseId: PropTypes.string.isRequired,
    uuid: PropTypes.string,
  })),
};

Certificates.defaultProps = {
  certificates: [],
};

export default connect(
  certificatesSelector,
  {},
)(Certificates);