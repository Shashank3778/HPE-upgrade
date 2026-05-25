import React from 'react';
import { PluginSlot } from '@openedx/frontend-plugin-framework';
import { desktopHeaderMainOrSecondaryMenuDataShape } from '../../../desktop-header/DesktopHeaderMainOrSecondaryMenu';
import HeaderNotificationsSlot from '../../HeaderNotificationsSlot';
import DesktopSecondaryMenuSlotV1 from '../v1';
var DesktopSecondaryMenuSlot = function DesktopSecondaryMenuSlot(_ref) {
  var menu = _ref.menu;
  return /*#__PURE__*/React.createElement(PluginSlot, {
    id: "org.openedx.frontend.layout.header_desktop_secondary_menu.v2",
    pluginProps: {
      menu: menu
    }
  }, /*#__PURE__*/React.createElement(HeaderNotificationsSlot, null), /*#__PURE__*/React.createElement(DesktopSecondaryMenuSlotV1, {
    menu: menu
  }));
};
DesktopSecondaryMenuSlot.propTypes = {
  menu: desktopHeaderMainOrSecondaryMenuDataShape
};
export default DesktopSecondaryMenuSlot;
//# sourceMappingURL=index.js.map