function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import { useLocation } from 'react-router-dom';
import { Icon } from '@openedx/paragon';
import { BookOpen, Compass, Layout, GridView } from '@openedx/paragon/icons';

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
var SIDEBAR_TABS = [{
  label: 'Courses',
  href: '/',
  icon: BookOpen
}, {
  label: 'Discovery',
  href: '/courses',
  icon: Compass
}, {
  label: 'Programs',
  href: '/programs',
  icon: GridView
}];

// Map URL paths to readable page names
var getPageName = function getPageName(pathname) {
  if (pathname.includes('dashboard')) {
    return 'Dashboard';
  }
  if (pathname.includes('my-courses') || pathname.includes('learner-dashboard')) {
    return 'My Courses';
  }
  if (pathname.includes('catalog') || pathname.includes('course-search') || pathname.includes('courses')) {
    return 'Discovery';
  }
  if (pathname.includes('progress')) {
    return 'Progress';
  }
  if (pathname.includes('discussion')) {
    return 'Discussions';
  }
  if (pathname.includes('certificate')) {
    return 'Certificates';
  }
  if (pathname.includes('profile')) {
    return 'Profile';
  }
  if (pathname.includes('account')) {
    return 'Account';
  }
  if (pathname.includes('programs')) {
    return 'Programs';
  }
  return 'Dashboard';
};

// Get initials from full name or username
var getInitials = function getInitials(name) {
  if (!name) {
    return 'U';
  }
  var parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};
var DesktopHeader = function DesktopHeader(_ref) {
  var mainMenu = _ref.mainMenu,
    secondaryMenu = _ref.secondaryMenu,
    userMenu = _ref.userMenu,
    loggedOutItems = _ref.loggedOutItems,
    logo = _ref.logo,
    logoAltText = _ref.logoAltText,
    logoDestination = _ref.logoDestination,
    avatar = _ref.avatar,
    username = _ref.username,
    loggedIn = _ref.loggedIn;
  var intl = useIntl();
  var headerRef = useRef(null);
  var _useState = useState(true),
    _useState2 = _slicedToArray(_useState, 2),
    headerVisible = _useState2[0],
    setHeaderVisible = _useState2[1];

  // Watch when top header scrolls out of view
  useEffect(function () {
    var observer = new IntersectionObserver(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 1),
        entry = _ref3[0];
      setHeaderVisible(entry.isIntersecting);
    }, {
      threshold: 0
    });
    if (headerRef.current) {
      observer.observe(headerRef.current);
    }
    return function () {
      return observer.disconnect();
    };
  }, []);

  // Get current page name from URL
  var pageName = 'Dashboard';
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    var location = useLocation();
    pageName = getPageName(location.pathname);
  } catch (e) {
    pageName = getPageName(window.location.pathname);
  }
  var isActive = function isActive(href) {
    try {
      return window.location.pathname === href || href !== '/' && window.location.pathname.includes(href);
    } catch (e) {
      return false;
    }
  };

  // ── Top header user chip (username + avatar pill) ──
  var renderUserMenu = function renderUserMenu() {
    return /*#__PURE__*/React.createElement(Menu, {
      transitionClassName: "menu-dropdown",
      transitionTimeout: 250
    }, /*#__PURE__*/React.createElement(MenuTrigger, {
      tag: "button",
      "aria-label": intl.formatMessage(messages['header.label.account.menu.for'], {
        username: username
      }),
      className: "site-header-user-trigger"
    }, /*#__PURE__*/React.createElement("div", {
      className: "site-header-user-chip"
    }, /*#__PURE__*/React.createElement("span", {
      className: "site-header-user-chip__name"
    }, username), /*#__PURE__*/React.createElement("div", {
      className: "site-header-user-chip__avatar"
    }, avatar ? /*#__PURE__*/React.createElement("img", {
      src: avatar,
      alt: username
    }) : /*#__PURE__*/React.createElement("span", null, getInitials(username))))), /*#__PURE__*/React.createElement(MenuContent, {
      className: "mb-0 dropdown-menu show dropdown-menu-right pin-right shadow py-2"
    }, /*#__PURE__*/React.createElement(DesktopUserMenuSlot, {
      menu: userMenu
    })));
  };

  // ── Sidebar user profile (avatar circle + name + role) ──
  var renderSidebarUserMenu = function renderSidebarUserMenu() {
    return /*#__PURE__*/React.createElement(Menu, {
      transitionClassName: "menu-dropdown",
      transitionTimeout: 250
    }, /*#__PURE__*/React.createElement(MenuTrigger, {
      tag: "button",
      "aria-label": intl.formatMessage(messages['header.label.account.menu.for'], {
        username: username
      }),
      className: "site-sidebar__user-trigger"
    }, /*#__PURE__*/React.createElement("div", {
      className: "site-sidebar__user"
    }, /*#__PURE__*/React.createElement("div", {
      className: "site-sidebar__user-avatar"
    }, avatar ? /*#__PURE__*/React.createElement("img", {
      src: avatar,
      alt: username
    }) : /*#__PURE__*/React.createElement("span", null, getInitials(username))), /*#__PURE__*/React.createElement("div", {
      className: "site-sidebar__user-info"
    }, /*#__PURE__*/React.createElement("span", {
      className: "site-sidebar__user-name"
    }, username), /*#__PURE__*/React.createElement("span", {
      className: "site-sidebar__user-role"
    }, "Learner")))), /*#__PURE__*/React.createElement(MenuContent, {
      className: "mb-0 dropdown-menu show shadow py-2"
    }, /*#__PURE__*/React.createElement(DesktopUserMenuSlot, {
      menu: userMenu
    })));
  };
  var renderLoggedOutItems = function renderLoggedOutItems() {
    return /*#__PURE__*/React.createElement(DesktopLoggedOutItemsSlot, {
      items: loggedOutItems
    });
  };
  var logoProps = {
    src: logo,
    alt: logoAltText,
    href: logoDestination
  };
  var logoClasses = getConfig().AUTHN_MINIMAL_HEADER ? 'mw-100' : null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("aside", {
    className: "site-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "site-sidebar__logo"
  }, /*#__PURE__*/React.createElement(LogoSlot, logoProps)), /*#__PURE__*/React.createElement("nav", {
    "aria-label": intl.formatMessage(messages['header.label.main.nav']),
    className: "site-sidebar__nav"
  }, SIDEBAR_TABS.map(function (tab) {
    return /*#__PURE__*/React.createElement("a", {
      key: tab.href,
      href: tab.href,
      className: "site-sidebar__nav-item".concat(isActive(tab.href) ? ' active' : '')
    }, /*#__PURE__*/React.createElement("span", {
      className: "site-sidebar__nav-icon"
    }, /*#__PURE__*/React.createElement(Icon, {
      src: tab.icon
    })), /*#__PURE__*/React.createElement("span", {
      className: "site-sidebar__nav-label"
    }, tab.label));
  })), loggedIn && !headerVisible && /*#__PURE__*/React.createElement("div", {
    className: "site-sidebar__user-section"
  }, renderSidebarUserMenu())), /*#__PURE__*/React.createElement("header", {
    ref: headerRef,
    className: "site-header-desktop site-header-top"
  }, /*#__PURE__*/React.createElement("a", {
    className: "nav-skip sr-only sr-only-focusable",
    href: "#main"
  }, intl.formatMessage(messages['header.label.skip.nav'])), /*#__PURE__*/React.createElement("div", {
    className: "container-fluid ".concat(logoClasses)
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-container position-relative d-flex align-items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "site-header-top__page-title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "site-header-breadcrumb"
  }, /*#__PURE__*/React.createElement("span", {
    className: "site-header-breadcrumb__home"
  }, "Home"), /*#__PURE__*/React.createElement("span", {
    className: "site-header-breadcrumb__separator"
  }, " / "), /*#__PURE__*/React.createElement("span", {
    className: "site-header-breadcrumb__current"
  }, pageName))), /*#__PURE__*/React.createElement("nav", {
    "aria-label": intl.formatMessage(messages['header.label.secondary.nav']),
    className: "nav secondary-menu-container align-items-center ml-auto"
  }, loggedIn ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DesktopSecondaryMenuSlot, {
    menu: secondaryMenu
  }), renderUserMenu()) : renderLoggedOutItems())))));
};
export var desktopHeaderDataShape = {
  mainMenu: desktopHeaderMainOrSecondaryMenuDataShape,
  secondaryMenu: desktopHeaderMainOrSecondaryMenuDataShape,
  userMenu: desktopUserMenuDataShape,
  loggedOutItems: desktopLoggedOutItemsDataShape,
  logo: PropTypes.string,
  logoAltText: PropTypes.string,
  logoDestination: PropTypes.string,
  avatar: PropTypes.string,
  username: PropTypes.string,
  loggedIn: PropTypes.bool
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
  loggedIn: desktopHeaderDataShape.loggedIn
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
  loggedIn: false
};
export default DesktopHeader;
//# sourceMappingURL=DesktopHeader.js.map