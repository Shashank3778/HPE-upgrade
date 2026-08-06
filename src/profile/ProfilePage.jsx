import React, {
  useEffect, useState, useContext, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { sendTrackingLogEvent } from '@edx/frontend-platform/analytics';
import { ensureConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import {
  Alert, Hyperlink, OverlayTrigger, Tooltip,
} from '@openedx/paragon';
import { InfoOutline } from '@openedx/paragon/icons';
import classNames from 'classnames';

import {
  fetchProfile,
  saveProfile,
  saveProfilePhoto,
  deleteProfilePhoto,
  openForm,
  closeForm,
  updateDraft,
} from './data/actions';

import ProfileAvatar from './forms/ProfileAvatar';
import Name from './forms/Name';
import Country from './forms/Country';
import PreferredLanguage from './forms/PreferredLanguage';
import Education from './forms/Education';
import SocialLinks from './forms/SocialLinks';
import Bio from './forms/Bio';
import DateJoined from './DateJoined';
import PageLoading from './PageLoading';
import Certificates from './Certificates';

import { profilePageSelector } from './data/selectors';
import messages from './ProfilePage.messages';
import withParams from '../utils/hoc';
import { useIsOnMobileScreen, useIsOnTabletScreen } from './data/hooks';

import AdditionalProfileFieldsSlot from '../plugin-slots/AdditionalProfileFieldsSlot';

ensureConfig(['CREDENTIALS_BASE_URL', 'LMS_BASE_URL', 'ACCOUNT_SETTINGS_URL'], 'ProfilePage');

// "Alex Martinez" -> "AM" (falls back to first two chars of a single token).
const getInitials = (source) => {
  if (!source) { return ''; }
  const parts = source.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) { return parts[0].slice(0, 2).toUpperCase(); }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const ProfilePage = ({ params }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const context = useContext(AppContext);
  const {
    dateJoined,
    courseCertificates,
    name,
    visibilityName,
    profileImage,
    savePhotoState,
    isLoadingProfile,
    photoUploadError,
    country,
    visibilityCountry,
    levelOfEducation,
    visibilityLevelOfEducation,
    socialLinks,
    draftSocialLinksByPlatform,
    visibilitySocialLinks,
    languageProficiencies,
    visibilityLanguageProficiencies,
    bio,
    visibilityBio,
    saveState,
    username,
  } = useSelector(profilePageSelector);

  const navigate = useNavigate();
  const [viewMyRecordsUrl, setViewMyRecordsUrl] = useState(null);
  const isMobileView = useIsOnMobileScreen();
  const isTabletView = useIsOnTabletScreen();

  useEffect(() => {
    const { CREDENTIALS_BASE_URL } = context.config;
    if (CREDENTIALS_BASE_URL) {
      setViewMyRecordsUrl(`${CREDENTIALS_BASE_URL}/records`);
    }

    dispatch(fetchProfile(params.username));
    sendTrackingLogEvent('edx.profile.viewed', {
      username: params.username,
    });
  }, [dispatch, params.username, context.config]);

  useEffect(() => {
    if (!username && saveState === 'error' && navigate) {
      navigate('/notfound');
    }
  }, [username, saveState, navigate]);

  const authenticatedUserName = context.authenticatedUser.username;

  const handleSaveProfilePhoto = useCallback((formData) => {
    dispatch(saveProfilePhoto(authenticatedUserName, formData));
  }, [dispatch, authenticatedUserName]);

  const handleDeleteProfilePhoto = useCallback(() => {
    dispatch(deleteProfilePhoto(authenticatedUserName));
  }, [dispatch, authenticatedUserName]);

  const handleClose = useCallback((formId) => {
    dispatch(closeForm(formId));
  }, [dispatch]);

  const handleOpen = useCallback((formId) => {
    dispatch(openForm(formId));
  }, [dispatch]);

  const handleSubmit = useCallback((formId) => {
    dispatch(saveProfile(formId, authenticatedUserName));
  }, [dispatch, authenticatedUserName]);

  const handleChange = useCallback((fieldName, value) => {
    dispatch(updateDraft(fieldName, value));
  }, [dispatch]);

  const isAuthenticatedUserProfile = () => params.username === authenticatedUserName;

  const isBlockVisible = (blockInfo) => isAuthenticatedUserProfile()
      || (!isAuthenticatedUserProfile() && Boolean(blockInfo));

  const renderViewMyRecordsButton = () => {
    if (!(viewMyRecordsUrl && isAuthenticatedUserProfile())) {
      return null;
    }

    return (
      <Hyperlink
        className={classNames(
          'btn btn-brand bg-brand-500 font-weight-normal px-4 py-10px text-nowrap',
          { 'w-100': isMobileView },
        )}
        target="_blank"
        showLaunchIcon={false}
        destination={viewMyRecordsUrl}
      >
        {intl.formatMessage(messages['profile.viewMyRecords'])}
      </Hyperlink>
    );
  };

  const renderPhotoUploadErrorMessage = () => (
    photoUploadError && (
      <div className="row">
        <div className="col-md-4 col-lg-3">
          <Alert variant="danger" dismissible={false} show>
            {photoUploadError.userMessage}
          </Alert>
        </div>
      </div>
    )
  );

  // Only "certificates earned" is backed by real data from this app today.
  // The row is built to support more tiles (courses in progress, learning
  // time, discussion posts) once those data sources exist elsewhere —
  // any tile whose value is null/undefined is simply skipped rather than
  // showing a fabricated number.
  const renderStats = () => {
    const stats = [
      {
        key: 'certificates',
        value: (courseCertificates || []).length,
        label: intl.formatMessage(messages['profile.stats.certificatesEarned']),
      },
      // { key: 'coursesInProgress', value: undefined, label: '...' },
      // { key: 'learningTime', value: undefined, label: '...' },
      // { key: 'discussionPosts', value: undefined, label: '...' },
    ].filter((stat) => stat.value !== undefined && stat.value !== null);

    if (!stats.length) { return null; }

    return (
      <div className="pp-stats">
        {stats.map((stat) => (
          <div className="pp-stat" key={stat.key}>
            <span className="pp-stat__value">{stat.value}</span>
            <span className="pp-stat__label">{stat.label}</span>
          </div>
        ))}
      </div>
    );
  };

  const commonFormProps = {
    openHandler: handleOpen,
    closeHandler: handleClose,
    submitHandler: handleSubmit,
    changeHandler: handleChange,
  };

  return (
    <div className="profile-page">
      {isLoadingProfile ? (
        <PageLoading srMessage={intl.formatMessage(messages['profile.loading'])} />
      ) : (
        <>
          <div
            className={classNames(
              'pp-page-wrap',
              { 'px-3 py-4': isMobileView },
              { 'px-120px py-5.5': !isMobileView },
            )}
          >
            <div className="pp-header-card">
              <div
                className={classNames([
                  'd-flex flex-wrap align-items-center w-100',
                  isMobileView || isTabletView ? 'flex-column' : 'flex-row',
                ])}
              >
                <ProfileAvatar
                  className="pp-avatar-wrap"
                  src={profileImage.src}
                  isDefault={profileImage.isDefault}
                  initials={getInitials(name || params.username)}
                  onSave={handleSaveProfilePhoto}
                  onDelete={handleDeleteProfilePhoto}
                  savePhotoState={savePhotoState}
                  isEditable={isAuthenticatedUserProfile()}
                />
                <div
                  className={classNames([
                    'pp-identity flex-grow-1',
                    isMobileView || isTabletView
                      ? 'd-flex flex-column justify-content-center align-items-center text-center'
                      : '',
                  ])}
                >
                  <p data-hj-suppress className="pp-identity__name m-0">
                    {isBlockVisible(name) && name ? name : params.username}
                  </p>
                  {isBlockVisible(name) && name && (
                    <p className="pp-identity__username m-0">{params.username}</p>
                  )}
                  <div className={classNames(
                    'pp-identity__meta',
                    isMobileView ? 'd-flex justify-content-center align-items-center flex-column' : '',
                  )}
                  >
                    <DateJoined date={dateJoined} />
                  </div>
                </div>
                <div className={classNames([
                  'pp-actions',
                  isMobileView || isTabletView ? 'd-flex justify-content-center' : '',
                ])}
                >
                  {isAuthenticatedUserProfile() && (
                    <Hyperlink
                      destination="#profile-information-section"
                      className="btn btn-outline-primary pp-actions__edit"
                      showLaunchIcon={false}
                    >
                      {intl.formatMessage(messages['profile.editProfile'])}
                    </Hyperlink>
                  )}
                  {isAuthenticatedUserProfile() && context.config.ACCOUNT_SETTINGS_URL && (
                    <Hyperlink
                      destination={context.config.ACCOUNT_SETTINGS_URL}
                      className="pp-actions__settings"
                      showLaunchIcon={false}
                    >
                      {intl.formatMessage(messages['profile.settings'])}
                    </Hyperlink>
                  )}
                  {renderViewMyRecordsButton()}
                </div>
              </div>
              {renderStats()}
              <div className="ml-auto">
                {renderPhotoUploadErrorMessage()}
              </div>
            </div>
          </div>
          <div
            id="profile-information-section"
            className={classNames([
              'col d-inline-flex h-100 w-100 align-items-start justify-content-start g-3rem',
              isMobileView ? 'py-4 px-3' : 'px-120px py-6',
            ])}
          >
            <div className="w-100 p-0">
              <div className="col justify-content-start align-items-start p-0">
                <div className="col align-self-stretch height-42px justify-content-start align-items-start p-0">
                  <p className="font-weight-bold text-primary-500 m-0 h2">
                    {isMobileView ? (
                      <FormattedMessage
                        id="profile.profile.information"
                        defaultMessage="Profile"
                        description="heading for the editable profile section in mobile view"
                      />
                    )
                      : (
                        <FormattedMessage
                          id="profile.profile.information"
                          defaultMessage="Profile information"
                          description="heading for the editable profile section"
                        />
                      )}
                  </p>
                </div>
              </div>
              <div
                className={classNames([
                  'row m-0 px-0 w-100 d-inline-flex align-items-start justify-content-start',
                  isMobileView ? 'pt-4' : 'pt-5.5',
                ])}
              >
                <div
                  className={classNames([
                    'col p-0',
                    isMobileView ? 'col-12' : 'col-6',
                  ])}
                >
                  <div className="m-0">
                    <div className="row m-0 pb-1.5 align-items-center">
                      <p data-hj-suppress className="h5 font-weight-bold m-0">
                        {intl.formatMessage(messages['profile.username'])}
                      </p>
                      <OverlayTrigger
                        key="top"
                        placement="top"
                        overlay={(
                          <Tooltip variant="light" id="tooltip-top">
                            <p className="h5 font-weight-normal m-0 p-0">
                              {intl.formatMessage(messages['profile.username.tooltip'])}
                            </p>
                          </Tooltip>
                          )}
                      >
                        <InfoOutline className="m-0 info-icon" />
                      </OverlayTrigger>
                    </div>
                    <h4 className="edit-section-header text-gray-700">
                      {params.username}
                    </h4>
                  </div>
                  {isBlockVisible(name) && (
                  <Name
                    name={name}
                    accountSettingsUrl={context.config.ACCOUNT_SETTINGS_URL}
                    visibilityName={visibilityName}
                    formId="name"
                    {...commonFormProps}
                  />
                  )}
                  {isBlockVisible(country) && (
                  <Country
                    country={country}
                    visibilityCountry={visibilityCountry}
                    formId="country"
                    {...commonFormProps}
                  />
                  )}
                  {isBlockVisible((languageProficiencies || []).length) && (
                  <PreferredLanguage
                    languageProficiencies={languageProficiencies || []}
                    visibilityLanguageProficiencies={visibilityLanguageProficiencies}
                    formId="languageProficiencies"
                    {...commonFormProps}
                  />
                  )}
                  {isBlockVisible(levelOfEducation) && (
                  <Education
                    levelOfEducation={levelOfEducation}
                    visibilityLevelOfEducation={visibilityLevelOfEducation}
                    formId="levelOfEducation"
                    {...commonFormProps}
                  />
                  )}

                  <AdditionalProfileFieldsSlot />
                </div>
                <div
                  className={classNames([
                    'col m-0 pr-0',
                    isMobileView ? 'pl-0 col-12' : 'pl-40px col-6',
                  ])}
                >
                  {isBlockVisible(bio) && (
                  <Bio
                    bio={bio}
                    visibilityBio={visibilityBio}
                    formId="bio"
                    {...commonFormProps}
                  />
                  )}

                  {isBlockVisible((socialLinks || []).some((link) => link?.socialLink !== null)) && (
                  <SocialLinks
                    socialLinks={socialLinks || []}
                    draftSocialLinksByPlatform={draftSocialLinksByPlatform || {}}
                    visibilitySocialLinks={visibilitySocialLinks}
                    formId="socialLinks"
                    {...commonFormProps}
                  />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div
            className={classNames([
              'col container-fluid d-inline-flex bg-color-grey-FBFAF9 h-100 w-100 align-items-start justify-content-start g-3rem',
              isMobileView ? 'py-4 px-3' : 'px-120px py-6',
            ])}
          >
            {isBlockVisible((courseCertificates || []).length) && (
            <Certificates
              certificates={courseCertificates || []}
              formId="certificates"
            />
            )}
          </div>
        </>
      )}
    </div>
  );
};

ProfilePage.propTypes = {
  params: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
  requiresParentalConsent: PropTypes.bool,
  dateJoined: PropTypes.string,
  username: PropTypes.string,
  bio: PropTypes.string,
  visibilityBio: PropTypes.string,
  courseCertificates: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
  })),
  country: PropTypes.string,
  visibilityCountry: PropTypes.string,
  levelOfEducation: PropTypes.string,
  visibilityLevelOfEducation: PropTypes.string,
  languageProficiencies: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string.isRequired,
  })),
  visibilityLanguageProficiencies: PropTypes.string,
  name: PropTypes.string,
  visibilityName: PropTypes.string,
  socialLinks: PropTypes.arrayOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })),
  draftSocialLinksByPlatform: PropTypes.objectOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })),
  visibilitySocialLinks: PropTypes.string,
  profileImage: PropTypes.shape({
    src: PropTypes.string,
    isDefault: PropTypes.bool,
  }),
  saveState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  savePhotoState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  isLoadingProfile: PropTypes.bool,
  photoUploadError: PropTypes.objectOf(PropTypes.string),
};

ProfilePage.defaultProps = {
  saveState: null,
  username: '',
  savePhotoState: null,
  photoUploadError: {},
  profileImage: {},
  name: null,
  levelOfEducation: null,
  country: null,
  socialLinks: [],
  draftSocialLinksByPlatform: {},
  bio: null,
  languageProficiencies: [],
  courseCertificates: [],
  requiresParentalConsent: null,
  dateJoined: null,
  visibilityName: null,
  visibilityCountry: null,
  visibilityLevelOfEducation: null,
  visibilitySocialLinks: null,
  visibilityLanguageProficiencies: null,
  visibilityBio: null,
  isLoadingProfile: false,
};

export default withParams(ProfilePage);