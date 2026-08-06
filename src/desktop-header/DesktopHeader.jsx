import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import { useLocation } from 'react-router-dom';
import { Icon } from '@openedx/paragon';
import {
  BookOpen,
  Compass,
  Layout,
  GridView,

} from '@openedx/paragon/icons';

// Local Components
import DesktopUserMenuToggleSlot from '../plugin-slots/DesktopUserMenuToggleSlot';
import { Menu, MenuTrigger, MenuContent } from '../Menu';
import LogoSlot from '../plugin-slots/LogoSlot';
import DesktopLoggedOutItemsSlot from '../plugin-slots/DesktopLoggedOutItemsSlot';
import { desktopLoggedOutItemsDataShape } from './DesktopLoggedOutItems';
import { desktopHeaderMainOrSecondaryMenuDataShape } from './DesktopHeaderMainOrSecondaryMenu';
import DesktopSecondaryMenuSlot from '../plugin-slots/DesktopSecondaryMenuSlot';
import DesktopUserMenuSlot from '../plugin-slots/DesktopUserMenuSlot';
import { desktopUserMenuDataShape } from './DesktopHeaderUserMenu';

// i18n
import messages from '../Header.messages';

// Hardcoded sidebar tabs
const SIDEBAR_TABS = [
  { label: 'Courses', href: '/', icon: BookOpen },
  { label: 'Discovery', href: '/courses', icon: Compass },
  { label: 'Programs', href: '/programs', icon:   GridView },
];

// Map URL paths to readable page names
const getPageName = (pathname) => {
  if (pathname.includes('dashboard')) { return 'Dashboard'; }
  if (pathname.includes('my-courses') || pathname.includes('learner-dashboard')) { return 'My Courses'; }
  if (pathname.includes('catalog') || pathname.includes('course-search') || pathname.includes('courses')) { return 'Discovery'; }
  if (pathname.includes('progress')) { return 'Progress'; }
  if (pathname.includes('discussion')) { return 'Discussions'; }
  if (pathname.includes('certificate')) { return 'Certificates'; }
  if (pathname.includes('profile')) { return 'Profile'; }
  if (pathname.includes('account')) { return 'Account'; }
  if (pathname.includes('programs')) { return 'Programs'; }
  return 'Dashboard';
};

// Get initials from full name or username
const getInitials = (name) => {
  if (!name) { return 'U'; }
  const parts = name.trim().split(' ');
  if (parts.length === 1) { return parts[0].charAt(0).toUpperCase(); }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Short display name, e.g. "Alex Martinez" -> "Alex M."
const getDisplayName = (name, username) => {
  if (!name) { return username; }
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 1) { return parts[0]; }
  return `${parts[0]} ${parts[parts.length - 1].charAt(0).toUpperCase()}.`;
};

const DesktopHeader = ({
  mainMenu,
  secondaryMenu,
  userMenu,
  loggedOutItems,
  logo,
  logoAltText,
  logoDestination,
  avatar,
  username,
  name,
  email,
  loggedIn,
}) => {
  const intl = useIntl();
  const headerRef = useRef(null);
  const [headerVisible, setHeaderVisible] = useState(true);

  // Watch when top header scrolls out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeaderVisible(entry.isIntersecting);
      },
      { threshold: 0 },
    );
    if (headerRef.current) {
      observer.observe(headerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Only push page content over when this sidebar is actually mounted (LMS),
  // so apps that render a different header (e.g. Studio) are unaffected.
  useEffect(() => {
    document.body.classList.add('has-site-sidebar');
    return () => document.body.classList.remove('has-site-sidebar');
  }, []);

  // Get current page name from URL
  let pageName = 'Dashboard';
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const location = useLocation();
    pageName = getPageName(location.pathname);
  } catch (e) {
    pageName = getPageName(window.location.pathname);
  }

  const isActive = (href) => {
    try {
      return window.location.pathname === href
        || (href !== '/' && window.location.pathname.includes(href));
    } catch (e) {
      return false;
    }
  };

  const displayName = getDisplayName(name, username);

  // ── Shared profile header block + footer logo, wraps the menu items ──
  const renderUserMenuContent = () => (
    <>
      <div className="site-header-user-menu__profile">
        <div className="site-header-user-menu__profile-avatar">
          {avatar
            ? <img src={avatar} alt={username} />
            : <span>{getInitials(name || username)}</span>}
        </div>
        <div className="site-header-user-menu__profile-info">
          <span className="site-header-user-menu__profile-name">{name || username}</span>
          {email && <span className="site-header-user-menu__profile-email">{email}</span>}
        </div>
      </div>
      <div className="dropdown-divider" role="separator" />
      <DesktopUserMenuSlot menu={userMenu} />
      <div className="site-header-user-menu__footer">
        {logo && <img className="site-header-user-menu__footer-logo" src={logo} alt={logoAltText} />}
        <span className="site-header-user-menu__footer-version">{getConfig().SITE_VERSION || ''}</span>
      </div>
    </>
  );

  // ── Top header user chip (short name + avatar pill) ──
  const renderUserMenu = () => (
    <Menu transitionClassName="menu-dropdown" transitionTimeout={250}>
      <MenuTrigger
        tag="button"
        aria-label={intl.formatMessage(messages['header.label.account.menu.for'], { username })}
        className="site-header-user-trigger"
      >
        <div className="site-header-user-chip">
          <span className="site-header-user-chip__name">{displayName}</span>
          <div className="site-header-user-chip__avatar">
            {avatar
              ? <img src={avatar} alt={username} />
              : <span>{getInitials(name || username)}</span>}
          </div>
        </div>
      </MenuTrigger>
      <MenuContent className="mb-0 dropdown-menu show dropdown-menu-right pin-right shadow py-2 site-header-user-menu">
        {renderUserMenuContent()}
      </MenuContent>
    </Menu>
  );

  // ── Sidebar user profile (avatar circle + name + role) ──
  const renderSidebarUserMenu = () => (
    <Menu transitionClassName="menu-dropdown" transitionTimeout={250}>
      <MenuTrigger
        tag="button"
        aria-label={intl.formatMessage(messages['header.label.account.menu.for'], { username })}
        className="site-sidebar__user-trigger"
      >
        <div className="site-sidebar__user">
          <div className="site-sidebar__user-avatar">
            {avatar
              ? <img src={avatar} alt={username} />
              : <span>{getInitials(name || username)}</span>}
          </div>
          <div className="site-sidebar__user-info">
            <span className="site-sidebar__user-name">{displayName}</span>
            <span className="site-sidebar__user-role">Learner</span>
          </div>
        </div>
      </MenuTrigger>
      <MenuContent className="mb-0 dropdown-menu show shadow py-2 site-header-user-menu">
        {renderUserMenuContent()}
      </MenuContent>
    </Menu>
  );

  const renderLoggedOutItems = () => <DesktopLoggedOutItemsSlot items={loggedOutItems} />;

  const logoProps = { src: logo, alt: logoAltText, href: logoDestination };
  const logoClasses = getConfig().AUTHN_MINIMAL_HEADER ? 'mw-100' : null;

  return (
    <>
      {/* ── SIDEBAR ── */}
      <aside className="site-sidebar">
        <div className="site-sidebar__logo">
          <LogoSlot {...logoProps} />
        </div>

        <nav
          aria-label={intl.formatMessage(messages['header.label.main.nav'])}
          className="site-sidebar__nav"
        >
          {SIDEBAR_TABS.map((tab) => (
            <a
              key={tab.href}
              href={tab.href}
              className={`site-sidebar__nav-item${isActive(tab.href) ? ' active' : ''}`}
            >
              <span className="site-sidebar__nav-icon">
                <Icon src={tab.icon} />
              </span>
              <span className="site-sidebar__nav-label">{tab.label}</span>
            </a>
          ))}
        </nav>

        {/* User profile — appears at bottom when top header scrolls out */}
        {loggedIn && !headerVisible && (
          <div className="site-sidebar__user-section">
            {renderSidebarUserMenu()}
          </div>
        )}
      </aside>

      {/* ── TOP HEADER ── */}
      <header ref={headerRef} className="site-header-desktop site-header-top">
        <a className="nav-skip sr-only sr-only-focusable" href="#main">
          {intl.formatMessage(messages['header.label.skip.nav'])}
        </a>
        <div className={`container-fluid ${logoClasses}`}>
          <div className="nav-container position-relative d-flex align-items-center">

            {/* Left: breadcrumb */}
            <div className="site-header-top__page-title">
              <span className="site-header-breadcrumb">
                <span className="site-header-breadcrumb__home">Home</span>
                <span className="site-header-breadcrumb__separator"> / </span>
                <span className="site-header-breadcrumb__current">{pageName}</span>
              </span>
            </div>

            {/* Right: secondary menu + user chip */}
            <nav
              aria-label={intl.formatMessage(messages['header.label.secondary.nav'])}
              className="nav secondary-menu-container align-items-center ml-auto"
            >
              {loggedIn
                ? (
                  <>
                    <DesktopSecondaryMenuSlot menu={secondaryMenu} />
                    {renderUserMenu()}
                  </>
                )
                : renderLoggedOutItems()}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export const desktopHeaderDataShape = {
  mainMenu: desktopHeaderMainOrSecondaryMenuDataShape,
  secondaryMenu: desktopHeaderMainOrSecondaryMenuDataShape,
  userMenu: desktopUserMenuDataShape,
  loggedOutItems: desktopLoggedOutItemsDataShape,
  logo: PropTypes.string,
  logoAltText: PropTypes.string,
  logoDestination: PropTypes.string,
  avatar: PropTypes.string,
  username: PropTypes.string,
  name: PropTypes.string,
  email: PropTypes.string,
  loggedIn: PropTypes.bool,
};

DesktopHeader.propTypes = {
  mainMenu: desktopHeaderDataShape.mainMenu,
  secondaryMenu: desktopHeaderDataShape.secondaryMenu,
  userMenu: desktopHeaderDataShape.userMenu,
  loggedOutItems: desktopHeaderDataShape.loggedOutItems,
  logo: desktopHeaderDataShape.logo,
  logoAltText: desktopHeaderDataShape.logoAltText,
  logoDestination: desktopHeaderDataShape.logoDestination,
  avatar: desktopHeaderDataShape.avatar,
  username: desktopHeaderDataShape.username,
  name: desktopHeaderDataShape.name,
  email: desktopHeaderDataShape.email,
  loggedIn: desktopHeaderDataShape.loggedIn,
};

DesktopHeader.defaultProps = {
  mainMenu: [],
  secondaryMenu: [],
  userMenu: [],
  loggedOutItems: [],
  logo: null,
  logoAltText: null,
  logoDestination: null,
  avatar: null,
  username: null,
  name: null,
  email: null,
  loggedIn: false,
};

export default DesktopHeader;