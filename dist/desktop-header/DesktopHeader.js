import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import { useLocation } from 'react-router-dom';

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

// Map URL paths to readable page names
var getPageName = function getPageName(pathname) {
  if (pathname.includes('dashboard')) return 'Dashboard';
  if (pathname.includes('my-courses') || pathname.includes('learner-dashboard')) return 'My Courses';
  if (pathname.includes('catalog') || pathname.includes('course-search')) return 'Catalog';
  if (pathname.includes('progress')) return 'Progress';
  if (pathname.includes('discussion')) return 'Discussions';
  if (pathname.includes('certificate')) return 'Certificates';
  if (pathname.includes('profile')) return 'Profile';
  if (pathname.includes('account')) return 'Account';
  return 'Dashboard';
};

// Map menu item label to an SVG icon
var getIcon = function getIcon() {
  var label = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var l = label.toLowerCase();
  if (l.includes('course')) {
    return /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "18",
      height: "18",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
    }));
  }
  if (l.includes('discover')) {
    return /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "18",
      height: "18",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z"
    }));
  }
  if (l.includes('dashboard')) {
    return /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "18",
      height: "18",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    }));
  }
  if (l.includes('catalog')) {
    return /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "18",
      height: "18",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M4 6h16M4 10h16M4 14h16M4 18h16"
    }));
  }
  if (l.includes('progress')) {
    return /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "18",
      height: "18",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    }));
  }
  if (l.includes('discussion')) {
    return /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "18",
      height: "18",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    }));
  }
  if (l.includes('certificate')) {
    return /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "18",
      height: "18",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
    }));
  }
  // default icon
  return /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "18",
    height: "18",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M13 10V3L4 14h7v7l9-11h-7z"
  }));
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

  // Get current page name from URL
  var pageName = 'Dashboard';
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    var location = useLocation();
    pageName = getPageName(location.pathname);
  } catch (e) {
    pageName = getPageName(window.location.pathname);
  }
  var renderUserMenu = function renderUserMenu() {
    return /*#__PURE__*/React.createElement(Menu, {
      transitionClassName: "menu-dropdown",
      transitionTimeout: 250
    }, /*#__PURE__*/React.createElement(MenuTrigger, {
      tag: "button",
      "aria-label": intl.formatMessage(messages['header.label.account.menu.for'], {
        username: username
      }),
      className: "btn btn-outline-primary d-inline-flex align-items-center pl-2 pr-3"
    }, /*#__PURE__*/React.createElement(DesktopUserMenuToggleSlot, {
      avatar: avatar,
      label: username
    })), /*#__PURE__*/React.createElement(MenuContent, {
      className: "mb-0 dropdown-menu show dropdown-menu-right pin-right shadow py-2"
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
  var isActive = function isActive(item) {
    try {
      return window.location.pathname.includes(item.href) || item.isActive;
    } catch (e) {
      return false;
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("aside", {
    className: "site-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "site-sidebar__logo"
  }, /*#__PURE__*/React.createElement(LogoSlot, logoProps)), /*#__PURE__*/React.createElement("nav", {
    "aria-label": intl.formatMessage(messages['header.label.main.nav']),
    className: "site-sidebar__nav"
  }, mainMenu.map(function (item) {
    return /*#__PURE__*/React.createElement("a", {
      key: item.href || item.label,
      href: item.href,
      className: "site-sidebar__nav-item ".concat(isActive(item) ? 'active' : '')
    }, /*#__PURE__*/React.createElement("span", {
      className: "site-sidebar__nav-icon"
    }, getIcon(item.label)), /*#__PURE__*/React.createElement("span", {
      className: "site-sidebar__nav-label"
    }, item.label));
  }))), /*#__PURE__*/React.createElement("header", {
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