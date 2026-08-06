import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@openedx/paragon';

const DesktopHeaderUserMenu = ({ menu }) => menu.map((group, index) => (
  // eslint-disable-next-line react/jsx-no-comment-textnodes,react/no-array-index-key
  <React.Fragment key={index}>
    {group.heading && (
      <div className="dropdown-header site-header-user-menu__section-label" role="heading" aria-level="1">
        {group.heading}
      </div>
    )}
    {group.items.map(({
      type, content, href, disabled, isActive, onClick, icon, badge, isDanger,
    }) => (
      <a
        className={`dropdown-${type}${isActive ? ' active' : ''}${disabled ? ' disabled' : ''}${isDanger ? ' site-header-user-menu__item--danger' : ''}`}
        key={`${type}-${content}`}
        href={href}
        onClick={onClick || null}
      >
        {icon && (
          <span className="site-header-user-menu__item-icon">
            <Icon src={icon} />
          </span>
        )}
        <span className="site-header-user-menu__item-label">{content}</span>
        {(badge !== undefined && badge !== null) && (
          <span className="site-header-user-menu__item-badge">{badge}</span>
        )}
      </a>
    ))}
    {index < menu.length - 1 && <div className="dropdown-divider" role="separator" />}
  </React.Fragment>
));

export const desktopUserMenuDataShape = PropTypes.arrayOf(PropTypes.shape({
  heading: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf(['item', 'menu']),
    href: PropTypes.string,
    content: PropTypes.string,
    isActive: PropTypes.bool,
    onClick: PropTypes.func,
    // eslint-disable-next-line react/forbid-prop-types
    icon: PropTypes.any,
    badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isDanger: PropTypes.bool,
  })),
}));

DesktopHeaderUserMenu.propTypes = {
  menu: desktopUserMenuDataShape,
};

export default DesktopHeaderUserMenu;