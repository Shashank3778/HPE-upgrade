import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import { useLocation } from 'react-router-dom';
import hpeLogo from './assets/hpe-logo-white.png';
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

        <div className="ch-nav-section">
          <span className="ch-nav-section-label">LEARN</span>
          <NavItem icon={<DashboardIcon />} label="Dashboard" href={dashboardUrl} active={isActive('/home')} />
          <NavItem icon={<CatalogIcon />} label="Catalog" href={catalogUrl} active={false} />
          <NavItem icon={<DiscussionsIcon />} label="Discussions" href={discussionsUrl} active={isActive('/discussion')} />
        </div>

        <div className="ch-nav-section">
          <span className="ch-nav-section-label">ACCOUNT</span>
          <NavItem icon={<CertificatesIcon />} label="Certificates" href={certificatesUrl} active={isActive('/certificate')} />
          <NavItem icon={<ProfileIcon />} label="Profile" href={profileUrl} active={false} />
        </div>
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
                <span className="ch-user-name">{firstName}.</span>
              </button>

              {userMenuOpen && (
                <div className="ch-dropdown">
                  <div className="ch-dropdown-header">
                    <Avatar name={displayName} size={40} />
                    <div>
                      <div className="ch-dropdown-name">{displayName}</div>
                      <div className="ch-dropdown-username">@{user?.username}</div>
                    </div>
                  </div>
                  <div className="ch-dropdown-divider" />
                  <a href={profileUrl} className="ch-dropdown-item">My Profile</a>
                  <a href={`${lmsBase}/account/settings`} className="ch-dropdown-item">Account Settings</a>
                  <div className="ch-dropdown-divider" />
                  <a href={logoutUrl} className="ch-dropdown-item ch-dropdown-logout">Sign out</a>
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