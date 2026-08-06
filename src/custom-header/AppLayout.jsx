import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import { useLocation } from 'react-router-dom';
import hpeLogo from './assets/logo.69d18cb4bc39.png';
import './custom-header.scss';

/* ── Icons ──────────────────────────────────────────────── */
const DashboardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor"/>
    <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor"/>
    <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor"/>
    <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor"/>
  </svg>
);
const CatalogIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="2" width="14" height="2" rx="1" fill="currentColor"/>
    <rect x="1" y="7" width="14" height="2" rx="1" fill="currentColor"/>
    <rect x="1" y="12" width="10" height="2" rx="1" fill="currentColor"/>
  </svg>
);
const DiscussionsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v7a1 1 0 01-1 1H9l-3 3v-3H3a1 1 0 01-1-1V3z" fill="currentColor"/>
  </svg>
);
const CertificatesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.5l-3.7 1.9.7-4.1-3-2.9 4.2-.8L8 1z" fill="currentColor"/>
  </svg>
);
const ProfileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="5" r="3" fill="currentColor"/>
    <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 2a5 5 0 00-5 5v3l-1.5 2H15.5L14 10V7a5 5 0 00-5-5z" fill="currentColor"/>
    <path d="M7.5 14.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);
const MyCoursesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 3a1 1 0 011-1h4v12H3a1 1 0 01-1-1V3zM9 2h4a1 1 0 011 1v10a1 1 0 01-1 1H9V2z" fill="currentColor"/>
  </svg>
);
const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="2.2" fill="currentColor"/>
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);
const InstructorIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="9" width="3" height="5" fill="currentColor"/>
    <rect x="6.5" y="5" width="3" height="9" fill="currentColor"/>
    <rect x="12" y="2" width="3" height="12" fill="currentColor"/>
  </svg>
);
const StudioIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M11 1l4 4-8.5 8.5-4.5 1 1-4.5L11 1z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
  </svg>
);
const HelpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3" fill="none"/>
    <path d="M6 6.2a2 2 0 113.4 1.4c-.5.5-1.4.9-1.4 1.9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
    <circle cx="8" cy="11.5" r="0.6" fill="currentColor"/>
  </svg>
);
const SignOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10.5 11l3-3-3-3M13.3 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const Avatar = ({ name, size = 34 }) => {
  const initials = name
    ? name.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';
  return (
    <div className="ch-avatar" style={{ width: size, height: size, fontSize: size < 36 ? '0.72rem' : '0.85rem' }}>
      {initials}
    </div>
  );
};

const NavItem = ({ icon, label, href, active }) => (
  <a href={href} className={`ch-nav-item${active ? ' active' : ''}`}>
    <span className="ch-nav-icon">{icon}</span>
    <span className="ch-nav-label">{label}</span>
  </a>
);

/* ── AppLayout wraps everything ─────────────────────────── */
const AppLayout = ({ courseTitle, children }) => {
  const user = getAuthenticatedUser();
  const config = getConfig() || {};
  const location = useLocation();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const lmsBase = config?.LMS_BASE_URL || '';
  const dashboardUrl = `${lmsBase}/dashboard`;
  const catalogUrl = 'https://apps.stage.test.striverra.com/learner-dashboard/catalog';
  const discussionsUrl = `${lmsBase}/discuss`;
  const certificatesUrl = `${lmsBase}/certificates`;
  const profileUrl = config?.ACCOUNT_PROFILE_URL || `${lmsBase}/u/${user?.username}`;
  const logoutUrl = config?.LOGOUT_URL || `${lmsBase}/logout`;

  const firstName = (user?.name || '').split(' ').filter(Boolean)[0] || user?.username || 'Learner';
  const displayName = user?.name || user?.username || 'User';

  // Short chip name, e.g. "Alex Martinez" -> "Alex M."
  const nameParts = (user?.name || '').split(' ').filter(Boolean);
  const shortName = nameParts.length > 1
    ? `${nameParts[0]} ${nameParts[nameParts.length - 1].charAt(0).toUpperCase()}.`
    : (nameParts[0] || user?.username || 'Learner');

  const isStaff = !!user?.administrator
    || (user?.roles || []).some((role) => role.includes('staff') || role.includes('instructor'));

  const myCoursesUrl = dashboardUrl;
  const accountSettingsUrl = `${lmsBase}/account/settings`;
  const notificationsUrl = config?.NOTIFICATIONS_URL || `${lmsBase}/notifications`;
  const helpUrl = config?.SUPPORT_URL || `${lmsBase}/help`;
  const instructorDashboardUrl = config?.INSTRUCTOR_DASHBOARD_URL || dashboardUrl;
  const studioUrl = config?.STUDIO_BASE_URL;
  const certificatesCount = config?.CERTIFICATES_COUNT;
  const notificationsCount = config?.NOTIFICATIONS_COUNT;

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="ch-layout">
      {/* Sidebar */}
      <aside className="hpe-nav-sidebar">
        <div className="ch-logo">
          <a href={dashboardUrl}>
            <img src={hpeLogo} alt="HPE" className="ch-logo-img" />
          </a>
        </div>

        <nav className="ch-nav" aria-label="Main">
          <NavItem icon={<DashboardIcon />} label="Dashboard" href={dashboardUrl} active={isActive('/home')} />
          <NavItem icon={<CatalogIcon />} label="Discovery" href={catalogUrl} active={false} />
        </nav>
      </aside>

      {/* Main */}
      <div className="ch-main">
        {/* Top bar */}
        <header className="ch-topbar">
          <div className="ch-topbar-left">
            {courseTitle ? (
              <span className="ch-topbar-course">{courseTitle}</span>
            ) : (
              <span className="ch-topbar-breadcrumb">
                <a href={dashboardUrl}>Home</a>
                <span className="ch-topbar-sep"> / </span>
                <strong>Dashboard</strong>
              </span>
            )}
          </div>

          <div className="ch-topbar-right">
            <div className="ch-search">
              <SearchIcon />
              <input type="text" placeholder="Search courses, discussions..." />
            </div>

            <button type="button" className="ch-icon-btn" aria-label="Notifications">
              <BellIcon />
            </button>

            <div className="ch-user-menu" ref={userMenuRef}>
              <button
                type="button"
                className="ch-user-btn"
                onClick={() => setUserMenuOpen(o => !o)}
              >
                <Avatar name={displayName} />
                <span className="ch-user-name">{shortName}</span>
              </button>

              {userMenuOpen && (
                <div className="ch-dropdown">
                  <div className="ch-dropdown-header">
                    <Avatar name={displayName} size={40} />
                    <div>
                      <div className="ch-dropdown-name">{displayName}</div>
                      <div className="ch-dropdown-username">{user?.email || `@${user?.username}`}</div>
                    </div>
                  </div>
                  <div className="ch-dropdown-divider" />

                  <a href={profileUrl} className="ch-dropdown-item">
                    <span className="ch-dropdown-item-icon"><ProfileIcon /></span>
                    <span className="ch-dropdown-item-label">Profile</span>
                  </a>
                  <a href={myCoursesUrl} className="ch-dropdown-item">
                    <span className="ch-dropdown-item-icon"><MyCoursesIcon /></span>
                    <span className="ch-dropdown-item-label">My courses</span>
                  </a>
                  <a href={certificatesUrl} className="ch-dropdown-item">
                    <span className="ch-dropdown-item-icon"><CertificatesIcon /></span>
                    <span className="ch-dropdown-item-label">Certificates</span>
                    {(certificatesCount !== undefined && certificatesCount !== null) && (
                      <span className="ch-dropdown-item-badge">{certificatesCount}</span>
                    )}
                  </a>
                  <a href={notificationsUrl} className="ch-dropdown-item">
                    <span className="ch-dropdown-item-icon"><BellIcon /></span>
                    <span className="ch-dropdown-item-label">Notifications</span>
                    {(notificationsCount !== undefined && notificationsCount !== null) && (
                      <span className="ch-dropdown-item-badge">{notificationsCount}</span>
                    )}
                  </a>
                  <a href={accountSettingsUrl} className="ch-dropdown-item">
                    <span className="ch-dropdown-item-icon"><SettingsIcon /></span>
                    <span className="ch-dropdown-item-label">Account settings</span>
                  </a>

                  {isStaff && (
                    <>
                      <div className="ch-dropdown-divider" />
                      <div className="ch-dropdown-section-label">STAFF TOOLS</div>
                      <a href={instructorDashboardUrl} className="ch-dropdown-item">
                        <span className="ch-dropdown-item-icon"><InstructorIcon /></span>
                        <span className="ch-dropdown-item-label">Instructor dashboard</span>
                      </a>
                      {studioUrl && (
                        <a href={studioUrl} className="ch-dropdown-item">
                          <span className="ch-dropdown-item-icon"><StudioIcon /></span>
                          <span className="ch-dropdown-item-label">Studio</span>
                        </a>
                      )}
                    </>
                  )}

                  <div className="ch-dropdown-divider" />
                  <a href={helpUrl} className="ch-dropdown-item">
                    <span className="ch-dropdown-item-icon"><HelpIcon /></span>
                    <span className="ch-dropdown-item-label">Help & support</span>
                  </a>

                  <div className="ch-dropdown-divider" />
                  <a href={logoutUrl} className="ch-dropdown-item ch-dropdown-logout">
                    <span className="ch-dropdown-item-icon"><SignOutIcon /></span>
                    <span className="ch-dropdown-item-label">Sign out</span>
                  </a>

                  <div className="ch-dropdown-footer">
                    <img src={hpeLogo} alt="HPE" className="ch-dropdown-footer-logo" />
                    <span className="ch-dropdown-footer-version">{config?.SITE_VERSION || ''}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="ch-page-content">
          {children}
        </div>
      </div>
    </div>
  );
};

AppLayout.propTypes = {
  courseTitle: PropTypes.string,
  children: PropTypes.node.isRequired,
};

AppLayout.defaultProps = {
  courseTitle: null,
};

export default AppLayout;