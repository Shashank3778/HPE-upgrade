function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';

// Local Components
import MobileUserMenuToggleSlot from '../plugin-slots/MobileUserMenuToggleSlot';
import { Menu, MenuTrigger, MenuContent } from '../Menu';
import LogoSlot from '../plugin-slots/LogoSlot';
import MobileLoggedOutItemsSlot from '../plugin-slots/MobileLoggedOutItemsSlot';
import { mobileHeaderLoggedOutItemsDataShape } from './MobileLoggedOutItems';
import MobileMainMenuSlot from '../plugin-slots/MobileMainMenuSlot';
import { mobileHeaderMainMenuDataShape } from './MobileHeaderMainMenu';
import MobileUserMenuSlot from '../plugin-slots/MobileUserMenuSlot';
import { mobileHeaderUserMenuDataShape } from './MobileHeaderUserMenu';

// i18n
import messages from '../Header.messages';

// Assets
import { MenuIcon } from '../Icons';
var MobileHeader = function MobileHeader(_ref) {
  var mainMenu = _ref.mainMenu,
    secondaryMenu = _ref.secondaryMenu,
    userMenu = _ref.userMenu,
    loggedOutItems = _ref.loggedOutItems,
    logo = _ref.logo,
    logoAltText = _ref.logoAltText,
    logoDestination = _ref.logoDestination,
    avatar = _ref.avatar,
    username = _ref.username,
    loggedIn = _ref.loggedIn,
    stickyOnMobile = _ref.stickyOnMobile;
  var intl = useIntl();
  var renderMainMenu = function renderMainMenu() {
    return /*#__PURE__*/React.createElement(MobileMainMenuSlot, {
      menu: [].concat(_toConsumableArray(mainMenu), _toConsumableArray(secondaryMenu))
    });
  };
  var renderUserMenuItems = function renderUserMenuItems() {
    return /*#__PURE__*/React.createElement(MobileUserMenuSlot, {
      menu: userMenu
    });
  };
  var renderLoggedOutItems = function renderLoggedOutItems() {
    return /*#__PURE__*/React.createElement(MobileLoggedOutItemsSlot, {
      items: loggedOutItems
    });
  };
  var renderUserMenuToggle = function renderUserMenuToggle() {
    return /*#__PURE__*/React.createElement(MobileUserMenuToggleSlot, {
      avatar: avatar,
      label: username
    });
  };
  var logoProps = {
    src: logo,
    alt: logoAltText,
    href: logoDestination
  };
  var stickyClassName = stickyOnMobile ? 'sticky-top' : '';
  var logoClasses = getConfig().AUTHN_MINIMAL_HEADER ? 'justify-content-left pl-3' : 'justify-content-center';
  return /*#__PURE__*/React.createElement("header", {
    "aria-label": intl.formatMessage(messages['header.label.main.header']),
    className: "site-header-mobile d-flex justify-content-between align-items-center shadow ".concat(stickyClassName)
  }, /*#__PURE__*/React.createElement("a", {
    className: "nav-skip sr-only sr-only-focusable",
    href: "#main"
  }, intl.formatMessage(messages['header.label.skip.nav'])), mainMenu.length > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "w-100 d-flex justify-content-start"
  }, /*#__PURE__*/React.createElement(Menu, {
    className: "position-static"
  }, /*#__PURE__*/React.createElement(MenuTrigger, {
    tag: "button",
    className: "icon-button",
    "aria-label": intl.formatMessage(messages['header.label.main.menu']),
    title: intl.formatMessage(messages['header.label.main.menu'])
  }, /*#__PURE__*/React.createElement(MenuIcon, {
    role: "img",
    "aria-hidden": true,
    focusable: "false",
    style: {
      width: '1.5rem',
      height: '1.5rem'
    }
  })), /*#__PURE__*/React.createElement(MenuContent, {
    tag: "nav",
    "aria-label": intl.formatMessage(messages['header.label.main.nav']),
    className: "nav flex-column pin-left pin-right border-top shadow py-2"
  }, renderMainMenu()))) : null, /*#__PURE__*/React.createElement("div", {
    className: "w-100 d-flex ".concat(logoClasses)
  }, /*#__PURE__*/React.createElement(LogoSlot, _extends({}, logoProps, {
    itemType: "http://schema.org/Organization"
  }))), userMenu.length > 0 || loggedOutItems.length > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "w-100 d-flex justify-content-end align-items-center"
  }, /*#__PURE__*/React.createElement(Menu, {
    tag: "nav",
    "aria-label": intl.formatMessage(messages['header.label.secondary.nav']),
    className: "position-static"
  }, /*#__PURE__*/React.createElement(MenuTrigger, {
    tag: "button",
    className: "icon-button",
    "aria-label": intl.formatMessage(messages['header.label.account.menu']),
    title: intl.formatMessage(messages['header.label.account.menu'])
  }, renderUserMenuToggle()), /*#__PURE__*/React.createElement(MenuContent, {
    tag: "ul",
    className: "nav flex-column pin-left pin-right border-top shadow py-2"
  }, loggedIn ? renderUserMenuItems() : renderLoggedOutItems()))) : null);
};
export var mobileHeaderDataShape = {
  mainMenu: mobileHeaderMainMenuDataShape,
  secondaryMenu: mobileHeaderMainMenuDataShape,
  userMenu: mobileHeaderUserMenuDataShape,
  loggedOutItems: mobileHeaderLoggedOutItemsDataShape,
  logo: PropTypes.string,
  logoAltText: PropTypes.string,
  logoDestination: PropTypes.string,
  avatar: PropTypes.string,
  username: PropTypes.string,
  loggedIn: PropTypes.bool,
  stickyOnMobile: PropTypes.bool
};
MobileHeader.propTypes = {
  mainMenu: mobileHeaderDataShape.mainMenu,
  secondaryMenu: mobileHeaderDataShape.secondaryMenu,
  userMenu: mobileHeaderDataShape.userMenu,
  loggedOutItems: mobileHeaderDataShape.loggedOutItems,
  logo: mobileHeaderDataShape.logo,
  logoAltText: mobileHeaderDataShape.logoAltText,
  logoDestination: mobileHeaderDataShape.logoDestination,
  avatar: mobileHeaderDataShape.avatar,
  username: mobileHeaderDataShape.username,
  loggedIn: mobileHeaderDataShape.loggedIn,
  stickyOnMobile: mobileHeaderDataShape.stickyOnMobile
};
MobileHeader.defaultProps = {
  mainMenu: [],
  secondaryMenu: [],
  userMenu: [],
  loggedOutItems: [],
  logo: null,
  logoAltText: null,
  logoDestination: null,
  avatar: null,
  username: null,
  loggedIn: false,
  stickyOnMobile: true
};
export default MobileHeader;
//# sourceMappingURL=MobileHeader.js.map