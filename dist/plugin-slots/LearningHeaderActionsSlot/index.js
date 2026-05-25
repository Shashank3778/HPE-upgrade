import React from 'react';
import { PluginSlot } from '@openedx/frontend-plugin-framework';
import HeaderNotificationsSlot from '../HeaderNotificationsSlot';
import LearningHelpSlot from '../LearningHelpSlot';
var LearningHeaderActionsSlot = function LearningHeaderActionsSlot() {
  return /*#__PURE__*/React.createElement(PluginSlot, {
    id: "org.openedx.frontend.layout.learning_header_actions.v1"
  }, /*#__PURE__*/React.createElement(HeaderNotificationsSlot, null), /*#__PURE__*/React.createElement(LearningHelpSlot, null));
};
export default LearningHeaderActionsSlot;
//# sourceMappingURL=index.js.map