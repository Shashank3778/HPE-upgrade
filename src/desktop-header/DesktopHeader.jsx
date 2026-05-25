import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';

// Local Components
import DesktopUserMenuToggleSlot from '../plugin-slots/DesktopUserMenuToggleSlot';
import { Menu, MenuTrigger, MenuContent } from '../Menu';
import LogoSlot from '../plugin-slots/LogoSlot';
import DesktopLoggedOutItemsSlot from '../plugin-slots/DesktopLoggedOutItemsSlot';
import { desktopLoggedOutItemsDataShape } from './DesktopLoggedOutItems';
import DesktopMainMenuSlot from '../plugin-slots/DesktopMainMenuSlot';
import { desktopHeaderMainOrSecondaryMenuDataShape } from './DesktopHeaderMainOrSecondaryMenu';
import DesktopSecondaryMenuSlot from '../plugin-slots/DesktopSecondaryMenuSlot';
import DesktopUserMenuSlot from '../plugin-slots/DesktopUserMenuSlot';
import { desktopUserMenuDataShape } from './DesktopHeaderUserMenu';

// i18n
import messages from '../Header.messages';

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
  loggedIn,
}) => {
  const intl = useIntl();

  const renderUserMenu = () => (
    <Menu transitionClassName="menu-dropdown" transitionTimeout={250}>
      <MenuTrigger
        tag="button"
        aria-label={intl.formatMessage(messages['header.label.account.menu.for'], { username })}
        className="btn btn-outline-primary d-inline-flex align-items-center pl-2 pr-3"
      >
        <DesktopUserMenuToggleSlot avatar={avatar} label={username} />
      </MenuTrigger>
      <MenuContent className="mb-0 dropdown-menu show dropdown-menu-right pin-right shadow py-2">
        <DesktopUserMenuSlot menu={userMenu} />
      </MenuContent>
    </Menu>
  );

  const renderLoggedOutItems = () => <DesktopLoggedOutItemsSlot items={loggedOutItems} />;

  const logoProps = { src: logo, alt: logoAltText, href: logoDestination };
  const logoClasses = getConfig().AUTHN_MINIMAL_HEADER ? 'mw-100' : null;

  return (
    <>
      {/* ── SIDEBAR — mainMenu tabs moved here from top nav ── */}
      <aside className="site-sidebar">
        <div className="site-sidebar__logo">
          <LogoSlot {...logoProps} />
        </div>
        <nav
          aria-label={intl.formatMessage(messages['header.label.main.nav'])}
          className="site-sidebar__nav"
        >
          <DesktopMainMenuSlot menu={mainMenu} />
        </nav>
      </aside>

      {/* ── TOP HEADER — page name left, user info right ── */}
      <header className="site-header-desktop site-header-top">
        <a className="nav-skip sr-only sr-only-focusable" href="#main">
          {intl.formatMessage(messages['header.label.skip.nav'])}
        </a>
        <div className={`container-fluid ${logoClasses}`}>
          <div className="nav-container position-relative d-flex align-items-center">
            {/* Left: empty — page title/breadcrumb injected by the consuming page */}
            <div className="site-header-top__page-title" />

            {/* Right: secondary menu + user (or logged-out items) */}
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
  loggedIn: false,
};

export default DesktopHeader;
