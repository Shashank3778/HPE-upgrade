import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

// Last-resort fallback only. The rail logo now comes from the platform config
// (the same values frontend-component-header reads), so a site that themes its
// logo in Tutor / @edx/brand gets that logo here automatically.
import fallbackLogo from './assets/hpe-logo-white.png';
import './custom-header.scss';

const THEME_STORAGE_KEY = 'striverra-learn-theme';

/* ── Icons ──────────────────────────────────────────────── */
const DashboardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
    <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
    <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" />
    <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" />
  </svg>
);
const CatalogIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1" y="2" width="14" height="2" rx="1" fill="currentColor" />
    <rect x="1" y="7" width="14" height="2" rx="1" fill="currentColor" />
    <rect x="1" y="12" width="10" height="2" rx="1" fill="currentColor" />
  </svg>
);
const ProfileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="5" r="3" fill="currentColor" />
    <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 16a2 2 0 002-2H6a2 2 0 002 2zm6-5V7a6 6 0 10-12 0v4l-2 2v1h16v-1l-2-2z" />
  </svg>
);
const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M6.2 1.2A6.5 6.5 0 1014.8 9.8 5.6 5.6 0 016.2 1.2z" />
  </svg>
);
const SettingsIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 5a3 3 0 100 6 3 3 0 000-6zm6.4 3l1.3-1.6-1.3-2.3-2 .5-1.4-.8L10.6 2H8.2L7.5 3.8l-1.4.8-2-.5L2.8 6.4 4.1 8l-1.3 1.6 1.3 2.3 2-.5 1.4.8.7 1.8h2.4l.7-1.8 1.4-.8 2 .5 1.3-2.3L14.4 8z" />
  </svg>
);
const InstructorIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M2 13h12v1H2v-1zm1-4h2v3H3V9zm3.5-4h2v7h-2V5zM10 7h2v5h-2V7z" />
  </svg>
);
const StudioIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M11.5 1.5l3 3L6 13H3v-3l8.5-8.5z" />
  </svg>
);
const HelpIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm.9 11H7.1v-1.7h1.8V12zm.2-2.8H6.9c0-1.7 2-1.9 2-3.1 0-.5-.4-.9-.9-.9s-.9.4-.9 1H5.3C5.3 4.8 6.5 4 8 4s2.7.9 2.7 2.1c0 1.5-1.6 1.8-1.6 3.1z" />
  </svg>
);
const SignOutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3v-1.5H3.5v-9H6V2zm4.3 2.2L9.2 5.3 11 7H6v1.5h5l-1.8 1.7 1.1 1.1L14 8l-3.7-3.8z" />
  </svg>
);
const CoursesIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M2 3h12v2H2V3zm0 4h12v2H2V7zm0 4h12v2H2v-2z" />
  </svg>
);
const ChevronIcon = () => (
  <svg className="ch-user-chevron" width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M3 6l5 5 5-5H3z" />
  </svg>
);
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
  </svg>
);

/* ── Brand logo ──────────────────────────────────────────────
   The logo is no longer a hard-coded import. It resolves from the
   platform config, exactly like frontend-component-header does:

     variant="light"  →  LOGO_WHITE_URL → LOGO_TRADEMARK_URL → LOGO_URL
     variant="ink"    →  LOGO_URL       → LOGO_TRADEMARK_URL → LOGO_WHITE_URL

   Each candidate that fails to load falls through to the next one, and the
   bundled PNG is the final fallback so the rail is never empty. Set
   LOGO_WHITE_URL in your MFE config (Tutor `MFE_CONFIG` / .env) to control
   the rail logo without touching this repo.
   ────────────────────────────────────────────────────────── */
const BrandLogo = ({ variant, className }) => {
  const config = getConfig() || {};
  const ordered = variant === 'ink'
    ? [config.LOGO_URL, config.LOGO_TRADEMARK_URL, config.LOGO_WHITE_URL]
    : [config.LOGO_WHITE_URL, config.LOGO_TRADEMARK_URL, config.LOGO_URL];

  const sources = [...ordered.filter(Boolean), fallbackLogo];
  const [index, setIndex] = useState(0);

  return (
    <img
      src={sources[index]}
      alt={config.SITE_NAME || 'Home'}
      className={className}
      onError={() => setIndex((i) => (i + 1 < sources.length ? i + 1 : i))}
    />
  );
};

BrandLogo.propTypes = {
  variant: PropTypes.oneOf(['light', 'ink']),
  className: PropTypes.string,
};

BrandLogo.defaultProps = {
  variant: 'light',
  className: 'ch-logo-img',
};

/* ── Theme switch ────────────────────────────────────────────
   One document-level theme, written to <html data-theme> so the token
   swap in custom-header.scss applies to the whole page, and persisted
   so it survives navigation between MFEs on the same origin.
   ────────────────────────────────────────────────────────── */
const ThemeSwitch = () => {
  const [dark, setDark] = useState(false);

  // Read the stored preference once on mount, falling back to the OS setting.
  useEffect(() => {
    let stored = null;
    try {
      stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    } catch (e) {
      stored = null; // private mode / storage disabled — fall through to OS
    }
    if (stored === 'dark' || stored === 'light') {
      setDark(stored === 'dark');
      return;
    }
    setDark(!!window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, dark ? 'dark' : 'light');
    } catch (e) { /* storage unavailable — the theme still applies for this page */ }
  }, [dark]);

  return (
    <div className="ch-theme-switch">
      <MoonIcon />
      <button
        type="button"
        className={`ch-toggle${dark ? ' on' : ''}`}
        aria-pressed={dark}
        aria-label={dark ? 'Dark mode, on' : 'Dark mode, off'}
        onClick={() => setDark((d) => !d)}
      />
    </div>
  );
};

const Avatar = ({ name, size, className }) => {
  const initials = name
    ? name.split(' ').filter(Boolean).map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';
  return (
    <div className={className} style={{ width: size, height: size }}>
      {initials}
    </div>
  );
};

Avatar.propTypes = {
  name: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
};

Avatar.defaultProps = {
  name: '',
  size: 28,
  className: 'ch-avatar',
};

const NavItem = ({
  icon, label, href, active,
}) => (
  <li className="ch-nav-li">
    <a
      href={href}
      className={`ch-nav-item${active ? ' active' : ''}`}
      aria-current={active ? 'page' : undefined}
      title={label}
    >
      <span className="ch-nav-icon">{icon}</span>
      <span className="ch-nav-label">{label}</span>
    </a>
  </li>
);

NavItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  active: PropTypes.bool,
};

NavItem.defaultProps = { active: false };

/* ── AppLayout wraps everything ─────────────────────────── */
const AppLayout = ({ courseTitle, children }) => {
  const user = getAuthenticatedUser();
  const config = getConfig() || {};

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const lmsBase = config?.LMS_BASE_URL || '';

  /* ---- URLs ------------------------------------------------------------
     Every destination is an absolute LMS / MFE URL, because the learning MFE
     is served from its own host+basename. useLocation() is deliberately NOT
     used here: it strips the app basename, which is what made the old active
     state and links unreliable.
     -------------------------------------------------------------------- */
  const dashboardUrl = `${lmsBase}/dashboard`;

  // Catalog is the LMS course listing, per spec: <LMS_BASE_URL>/courses
  const catalogUrl = `${lmsBase}/courses`;

  // Profile: identical resolution to the user-menu item. ACCOUNT_PROFILE_URL is
  // the profile app's *base* URL, so the /u/<username> path has to be appended
  // the same way frontend-component-header does it. Defined once and reused by
  // both the sidebar and the dropdown so the two can never drift apart.
  const profileUrl = config?.ACCOUNT_PROFILE_URL
    ? `${config.ACCOUNT_PROFILE_URL}/u/${user?.username}`
    : `${lmsBase}/u/${user?.username}`;

  const accountSettingsUrl = config?.ACCOUNT_SETTINGS_URL || `${lmsBase}/account/settings`;
  const notificationsUrl = config?.NOTIFICATIONS_URL || `${lmsBase}/notifications`;
  const helpUrl = config?.SUPPORT_URL || `${lmsBase}/help`;
  const logoutUrl = config?.LOGOUT_URL || `${lmsBase}/logout`;
  const instructorDashboardUrl = config?.INSTRUCTOR_DASHBOARD_URL || dashboardUrl;
  const studioUrl = config?.STUDIO_BASE_URL;
  const notificationsCount = config?.NOTIFICATIONS_COUNT;

  // Footer links
  const privacyUrl = config?.PRIVACY_POLICY_URL || `${lmsBase}/privacy`;
  const termsUrl = config?.TERMS_OF_SERVICE_URL || `${lmsBase}/tos`;
  const accessibilityUrl = config?.ACCESSIBILITY_URL || `${lmsBase}/accessibility`;
  const siteName = config?.SITE_NAME || 'Striverra';

  const displayName = user?.name || user?.username || 'User';
  const userRole = user?.administrator ? 'Administrator' : 'Learner';

  // Short chip name, e.g. "Alex Martinez" -> "Alex M."
  const nameParts = (user?.name || '').split(' ').filter(Boolean);
  const shortName = nameParts.length > 1
    ? `${nameParts[0]} ${nameParts[nameParts.length - 1].charAt(0).toUpperCase()}.`
    : (nameParts[0] || user?.username || 'Learner');

  const isStaff = !!user?.administrator
    || (user?.roles || []).some((role) => role.includes('staff') || role.includes('instructor'));

  // Active state compares against the real browser URL rather than the router
  // path, since these are cross-app links. Inside a course none of them match,
  // which is correct — the course tabs own the in-course active state.
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const isCurrent = (href) => !!href && href !== lmsBase && currentUrl.indexOf(href) === 0;

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') { setUserMenuOpen(false); }
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <div className="ch-layout">
      {/* ── Sidebar (navy rail) ───────────────────────────── */}
      <aside className="hpe-nav-sidebar">
        <div className="ch-logo">
          <a href={dashboardUrl} aria-label={siteName}>
            <BrandLogo variant="light" className="ch-logo-img" />
          </a>
        </div>

        <nav className="ch-nav" aria-label="Main">
          <ul className="ch-nav-list">
            <NavItem
              icon={<DashboardIcon />}
              label="Dashboard"
              href={dashboardUrl}
              active={isCurrent(dashboardUrl)}
            />
            <NavItem
              icon={<CatalogIcon />}
              label="Catalog"
              href={catalogUrl}
              active={isCurrent(catalogUrl)}
            />
            <NavItem
              icon={<ProfileIcon />}
              label="Profile"
              href={profileUrl}
              active={isCurrent(profileUrl)}
            />
          </ul>
        </nav>

        <a className="ch-sidebar-footer" href={accountSettingsUrl}>
          <Avatar name={displayName} size={32} className="ch-sidebar-avatar" />
          <span className="ch-sidebar-user">
            <span className="ch-sidebar-user-name">{displayName}</span>
            <span className="ch-sidebar-user-role">{userRole}</span>
          </span>
        </a>
      </aside>

      {/* ── Main column ───────────────────────────────────── */}
      <div className="ch-main">
        <header className="ch-topbar">
          <div className="ch-topbar-left">
            {courseTitle ? (
              <span className="ch-breadcrumb">
                <a href={dashboardUrl}>My courses</a>
                <span className="ch-breadcrumb-sep">/</span>
                <span className="ch-breadcrumb-current" title={courseTitle}>{courseTitle}</span>
              </span>
            ) : (
              <span className="ch-breadcrumb">
                <a href={dashboardUrl}>Home</a>
                <span className="ch-breadcrumb-sep">/</span>
                <span className="ch-breadcrumb-current">Dashboard</span>
              </span>
            )}
          </div>

          <div className="ch-topbar-right">
            <div className="ch-search">
              <span className="ch-search-icon"><SearchIcon /></span>
              <input type="text" aria-label="Search" placeholder="Search courses, discussions…" />
            </div>

            <ThemeSwitch />

            <a className="ch-icon-btn" href={notificationsUrl} aria-label="Notifications">
              <BellIcon />
              <span className="ch-icon-dot" />
            </a>

            <div className={`ch-user-menu${userMenuOpen ? ' open' : ''}`} ref={userMenuRef}>
              <button
                type="button"
                className="ch-user-pill"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                onClick={() => setUserMenuOpen((o) => !o)}
              >
                <span className="ch-user-name">{shortName}</span>
                <Avatar name={displayName} size={28} className="ch-avatar" />
                <ChevronIcon />
              </button>

              {userMenuOpen && (
                <div className="ch-dropdown" role="menu">
                  <div className="ch-dropdown-header">
                    <Avatar name={displayName} size={38} className="ch-avatar ch-avatar-lg" />
                    <div className="ch-dropdown-identity">
                      <div className="ch-dropdown-name">{displayName}</div>
                      <div className="ch-dropdown-email">{user?.email || `@${user?.username}`}</div>
                    </div>
                  </div>

                  <a href={profileUrl} className="ch-dropdown-item" role="menuitem">
                    <ProfileIcon />
                    <span className="ch-dropdown-item-label">Profile</span>
                  </a>
                  <a href={dashboardUrl} className="ch-dropdown-item" role="menuitem">
                    <CoursesIcon />
                    <span className="ch-dropdown-item-label">My courses</span>
                  </a>
                  <a href={notificationsUrl} className="ch-dropdown-item" role="menuitem">
                    <BellIcon />
                    <span className="ch-dropdown-item-label">Notifications</span>
                    {(notificationsCount !== undefined && notificationsCount !== null) && (
                      <span className="ch-dropdown-count">{notificationsCount}</span>
                    )}
                  </a>
                  <a href={accountSettingsUrl} className="ch-dropdown-item" role="menuitem">
                    <SettingsIcon />
                    <span className="ch-dropdown-item-label">Account settings</span>
                  </a>

                  {isStaff && (
                    <>
                      <div className="ch-dropdown-sep" />
                      <div className="ch-dropdown-role">Staff tools</div>
                      <a href={instructorDashboardUrl} className="ch-dropdown-item" role="menuitem">
                        <InstructorIcon />
                        <span className="ch-dropdown-item-label">Instructor dashboard</span>
                      </a>
                      {studioUrl && (
                        <a href={studioUrl} className="ch-dropdown-item" role="menuitem">
                          <StudioIcon />
                          <span className="ch-dropdown-item-label">Studio</span>
                        </a>
                      )}
                    </>
                  )}

                  <div className="ch-dropdown-sep" />
                  <a href={helpUrl} className="ch-dropdown-item" role="menuitem">
                    <HelpIcon />
                    <span className="ch-dropdown-item-label">Help &amp; support</span>
                  </a>

                  <div className="ch-dropdown-sep" />
                  <a href={logoutUrl} className="ch-dropdown-item ch-dropdown-signout" role="menuitem">
                    <SignOutIcon />
                    <span className="ch-dropdown-item-label">Sign out</span>
                  </a>

                  <div className="ch-dropdown-footer">
                    <BrandLogo variant="ink" className="ch-dropdown-footer-logo" />
                    {config?.SITE_VERSION && (
                      <span className="ch-dropdown-footer-version">{config.SITE_VERSION}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="ch-page-content">
          {children}
        </div>

        {/* ── App footer ──────────────────────────────────────
            Replaces <FooterSlot /> (removed from TabPage.jsx). The mark is
            the real logo component at the same rendered height as the rail
            mark, so both follow --ch-logo-h.
            ───────────────────────────────────────────────── */}
        <footer className="ch-app-footer">
          <div className="ch-foot-inner">
            <div className="ch-foot-identity">
              <BrandLogo variant="ink" className="ch-foot-logo" />
              <p className="ch-foot-copy">
                &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
              </p>
            </div>
            <nav className="ch-foot-links" aria-label="Legal and accessibility">
              <a href={privacyUrl}>Privacy</a>
              <a href={termsUrl}>Terms</a>
              <a href={accessibilityUrl}>Accessibility</a>
            </nav>
          </div>
        </footer>
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