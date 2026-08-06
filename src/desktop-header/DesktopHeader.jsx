import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import { Icon } from '@openedx/paragon';
import {
  Home,
  ViewList,
  GridView,
  ShowChart,
  Forum,
  StarFilled,
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

// Sidebar tabs. `key` drives which tab shows as active — see
// classifyPage() below — independent of the href itself.
const SIDEBAR_TABS = [
  { key: 'dashboard', label: 'Dashboard', href: '/', icon: Home },
  { key: 'catalog', label: 'Catalog', href: 'https://stage.lxp.striverra.com/courses', icon: GridView },
];

// Classify the current page from the real browser URL (hostname + pathname),
// not react-router's location. This header package is shared across several
// separately-deployed MFEs (dashboard, account, profile, learning, ...),
// each with its own router basename — react-router's useLocation() strips
// that basename, so on e.g. the account app "/account/" becomes just "/"
// and every keyword check below would silently fail. window.location gives
// us the real, unstripped URL instead, so this works the same everywhere.
const classifyPage = () => {
  let combined = '';
  try {
    combined = `${window.location.hostname}${window.location.pathname}`.toLowerCase();
  } catch (e) {
    return { pageName: 'Dashboard', navKey: 'dashboard' };
  }

  if (combined.includes('certificate')) { return { pageName: 'Certificates', navKey: 'certificates' }; }
  if (combined.includes('discussion')) { return { pageName: 'Discussions', navKey: 'discussions' }; }
  if (combined.includes('progress')) { return { pageName: 'Progress', navKey: 'progress' }; }
  if (combined.includes('catalog') || combined.includes('course-search') || combined.includes('course-catalog')) {
    return { pageName: 'Catalog', navKey: 'catalog' };
  }
  if (combined.includes('my-courses') || combined.includes('learner-dashboard') || combined.includes('dashboard')) {
    return { pageName: 'Dashboard', navKey: 'dashboard' };
  }
  if (combined.includes('profile')) { return { pageName: 'Profile', navKey: null }; }
  if (combined.includes('account')) { return { pageName: 'Account', navKey: null }; }
  if (combined.includes('courses')) { return { pageName: 'My Courses', navKey: 'mycourses' }; }
  return { pageName: 'Dashboard', navKey: 'dashboard' };
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

  // Get current page name + which sidebar tab (if any) should be active,
  // from the real browser URL — see classifyPage() for why this must not
  // use react-router's useLocation() here.
  const { pageName, navKey } = classifyPage();

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
            <span className="site-sidebar__user-role">User</span>
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
              className={`site-sidebar__nav-item${navKey === tab.key ? ' active' : ''}`}
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