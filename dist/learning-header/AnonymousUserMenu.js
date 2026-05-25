import React from 'react';
import { getConfig } from '@edx/frontend-platform';
import { getLoginRedirectUrl } from '@edx/frontend-platform/auth';
import { useIntl } from '@edx/frontend-platform/i18n';
import LearningLoggedOutItemsSlot from '../plugin-slots/LearningLoggedOutItemsSlot';
import genericMessages from '../generic/messages';
var AnonymousUserMenu = function AnonymousUserMenu() {
  var intl = useIntl();
  var buttonsInfo = [{
    message: intl.formatMessage(genericMessages.registerSentenceCase),
    href: "".concat(getConfig().LMS_BASE_URL, "/register?next=").concat(encodeURIComponent(global.location.href))
  }, {
    message: intl.formatMessage(genericMessages.signInSentenceCase),
    href: getLoginRedirectUrl(global.location.href),
    variant: 'primary'
  }];
  return /*#__PURE__*/React.createElement(LearningLoggedOutItemsSlot, {
    buttonsInfo: buttonsInfo
  });
};
export default AnonymousUserMenu;
//# sourceMappingURL=AnonymousUserMenu.js.map