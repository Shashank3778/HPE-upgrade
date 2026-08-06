import React, { useContext } from 'react';
import Responsive from 'react-responsive';
import { useIntl } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';
import {
  APP_CONFIG_INITIALIZED,
  ensureConfig,
  mergeConfig,
  getConfig,
  subscribe,
} from '@edx/frontend-platform';

import PropTypes from 'prop-types';
import {
  Person, MenuBook, Star, NotificationsNone, Settings, BarChart, Edit, HelpOutline, Logout,
} from '@openedx/paragon/icons';
import DesktopHeaderSlot from './plugin-slots/DesktopHeaderSlot';
import MobileHeaderSlot from './plugin-slots/MobileHeaderSlot';

import messages from './Header.messages';

ensureConfig([
  'LMS_BASE_URL',
  'LOGOUT_URL',
  'LOGIN_URL',
  'SITE_NAME',
  'LOGO_URL',
  'ORDER_HISTORY_URL',
], 'Header component');

subscribe(APP_CONFIG_INITIALIZED, () => {
  mergeConfig({
    AUTHN_MINIMAL_HEADER: !!process.env.AUTHN_MINIMAL_HEADER,
  }, 'Header additional config');
});

/**
 * Header component for the application.
 * Displays a header with the provided main menu, secondary menu, and user menu when the user is authenticated.
 * If any of the props (mainMenuItems, secondaryMenuItems, userMenuItems) are not provided, default
 * items are displayed.
 * For more details on how to use this component, please refer to this document:
 * https://github.com/openedx/frontend-component-header/blob/master/docs/using_custom_header.rst
 *
 * @param {list} mainMenuItems - The list of main menu items to display.
 * See the documentation for the structure of main menu item.
 * @param {list} secondaryMenuItems - The list of secondary menu items to display.
 * See the documentation for the structure of secondary menu item.
 * @param {list} userMenuItems - The list of user menu items to display.
 * See the documentation for the structure of user menu item.
 */
const Header = ({
  mainMenuItems, secondaryMenuItems, userMenuItems,
}) => {
  const { authenticatedUser, config } = useContext(AppContext);
  const intl = useIntl();

  const defaultMainMenu = [
    {
      type: 'item',
      href: `${config.LMS_BASE_URL}/dashboard`,
      content: intl.formatMessage(messages['header.links.courses']),
    },
  ];
  const isStaff = !!authenticatedUser?.administrator
    || (authenticatedUser?.roles || []).some((role) => role.includes('staff') || role.includes('instructor'));

  const defaultUserMenu = authenticatedUser === null ? [] : [
    {
      heading: '',
      items: [
        {
          type: 'item',
          href: `${config.ACCOUNT_PROFILE_URL}/u/${authenticatedUser.username}`,
          content: intl.formatMessage(messages['header.user.menu.profile']),
          icon: Person,
        },
        {
          type: 'item',
          href: `${config.LMS_BASE_URL}/dashboard`,
          content: intl.formatMessage(messages['header.user.menu.dashboard']),
          icon: MenuBook,
        },
        {
          type: 'item',
          href: config.ACCOUNT_CERTIFICATES_URL || `${config.LMS_BASE_URL}/dashboard`,
          content: intl.formatMessage(messages['header.user.menu.certificates']),
          icon: Star,
          badge: config.CERTIFICATES_COUNT,
        },
        {
          type: 'item',
          href: config.NOTIFICATIONS_URL || `${config.LMS_BASE_URL}/notifications`,
          content: intl.formatMessage(messages['header.user.menu.notifications']),
          icon: NotificationsNone,
          badge: config.NOTIFICATIONS_COUNT,
        },
        {
          type: 'item',
          href: config.ACCOUNT_SETTINGS_URL,
          content: intl.formatMessage(messages['header.user.menu.account.settings']),
          icon: Settings,
        },
        // Users should only see Order History if have a ORDER_HISTORY_URL define in the environment.
        ...(config.ORDER_HISTORY_URL ? [{
          type: 'item',
          href: config.ORDER_HISTORY_URL,
          content: intl.formatMessage(messages['header.user.menu.order.history']),
        }] : []),
      ],
    },
    // Staff-only tools group — only shown for administrators/instructors/staff.
    ...(isStaff ? [{
      heading: intl.formatMessage(messages['header.user.menu.staff.tools']),
      items: [
        {
          type: 'item',
          href: config.INSTRUCTOR_DASHBOARD_URL || `${config.LMS_BASE_URL}/dashboard`,
          content: intl.formatMessage(messages['header.user.menu.instructor.dashboard']),
          icon: BarChart,
        },
        {
          type: 'item',
          href: config.STUDIO_BASE_URL,
          content: intl.formatMessage(messages['header.user.menu.studio.home']),
          icon: Edit,
        },
      ],
    }] : []),
    {
      heading: '',
      items: [
        {
          type: 'item',
          href: config.SUPPORT_URL || `${config.LMS_BASE_URL}/help`,
          content: intl.formatMessage(messages['header.user.menu.help']),
          icon: HelpOutline,
        },
      ],
    },
    {
      heading: '',
      items: [
        {
          type: 'item',
          href: config.LOGOUT_URL,
          content: intl.formatMessage(messages['header.user.menu.logout']),
          icon: Logout,
          isDanger: true,
        },
      ],
    },
  ];

  const mainMenu = mainMenuItems || defaultMainMenu;
  const secondaryMenu = secondaryMenuItems || [];
  const userMenu = authenticatedUser === null ? [] : userMenuItems || defaultUserMenu;

  const loggedOutItems = [
    {
      type: 'item',
      href: config.LOGIN_URL,
      content: intl.formatMessage(messages['header.user.menu.login']),
    },
    {
      type: 'item',
      href: `${config.LMS_BASE_URL}/register`,
      content: intl.formatMessage(messages['header.user.menu.register']),
    },
  ];

  const props = {
    logo: config.LOGO_URL,
    logoAltText: config.SITE_NAME,
    logoDestination: `${config.LMS_BASE_URL}/dashboard`,
    loggedIn: authenticatedUser !== null,
    username: authenticatedUser !== null ? authenticatedUser.username : null,
    name: authenticatedUser !== null ? authenticatedUser.name : null,
    email: authenticatedUser !== null ? authenticatedUser.email : null,
    avatar: authenticatedUser !== null ? authenticatedUser.avatar : null,
    mainMenu: getConfig().AUTHN_MINIMAL_HEADER ? [] : mainMenu,
    secondaryMenu: getConfig().AUTHN_MINIMAL_HEADER ? [] : secondaryMenu,
    userMenu: getConfig().AUTHN_MINIMAL_HEADER ? [] : userMenu,
    loggedOutItems: getConfig().AUTHN_MINIMAL_HEADER ? [] : loggedOutItems,
  };

  return (
    <>
      <Responsive maxWidth={769}>
        <MobileHeaderSlot props={props} />
      </Responsive>
      <Responsive minWidth={769}>
        <DesktopHeaderSlot props={props} />
      </Responsive>
    </>
  );
};

Header.defaultProps = {
  mainMenuItems: null,
  secondaryMenuItems: null,
  userMenuItems: null,
};

Header.propTypes = {
  mainMenuItems: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.array,
  ]),
  secondaryMenuItems: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.array,
  ]),
  userMenuItems: PropTypes.arrayOf(PropTypes.shape({
    heading: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.oneOf(['item', 'menu']),
      href: PropTypes.string,
      content: PropTypes.string,
      isActive: PropTypes.bool,
    })),
  })),
};

export default Header;