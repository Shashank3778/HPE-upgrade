import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, Form, StatefulButton,
} from '@openedx/paragon';

import SwitchContent from './SwitchContent';
import messages from './AccountSettingsPage.messages';

import {
  openForm,
  closeForm,
} from './data/actions';
import { editableFieldSelector } from './data/selectors';
import CertificatePreference from './certificate-preference/CertificatePreference';

const EditableSelectField = (props) => {
  const intl = useIntl();
  const {
    name,
    label,
    emptyLabel,
    type,
    value,
    userSuppliedValue,
    options,
    saveState,
    error,
    confirmationMessageDefinition,
    confirmationValue,
    helpText,
    onEdit,
    onCancel,
    onSubmit,
    onChange,
    isEditing,
    isEditable,
    isGrayedOut,
    ...others
  } = props;
  const id = `field-${name}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(name, new FormData(e.target).get(name));
  };

  const handleChange = (e) => {
    onChange(name, e.target.value);
  };

  const handleEdit = () => {
    onEdit(name);
  };

  const handleCancel = () => {
    onCancel(name);
  };

  const renderEmptyLabel = () => {
    if (isEditable) {
      return <Button variant="link" onClick={handleEdit} className="p-0">{emptyLabel}</Button>;
    }
    return <span className="text-muted">{emptyLabel}</span>;
  };

  const renderValue = (rawValue) => {
    if (!rawValue) {
      return renderEmptyLabel();
    }
    let finalValue = rawValue;

    if (options) {
      // Use == instead of === to prevent issues when HTML casts numbers as strings
      // eslint-disable-next-line eqeqeq
      const selectedOption = options.find(option => option.value == rawValue);
      if (selectedOption) {
        finalValue = selectedOption.label;
      }
    }

    if (userSuppliedValue) {
      finalValue += `: ${userSuppliedValue}`;
    }

    return finalValue;
  };

  const renderConfirmationMessage = () => {
    if (!confirmationMessageDefinition || !confirmationValue) {
      return null;
    }
    return intl.formatMessage(confirmationMessageDefinition, {
      value: confirmationValue,
    });
  };
  const selectOptions = options.map((option) => {
    if (option.group) {
      // If the option has a 'group' property, it represents an element with sub-options.
      return (
        <optgroup label={option.label} key={option.label}>
          {option.group.map((subOption) => (
            <option
              value={subOption.value}
              key={`${subOption.value}-${subOption.label}`}
              disabled={subOption?.disabled}
            >
              {subOption.label}
            </option>
          ))}
        </optgroup>
      );
    }
    return (
      <option value={option.value} key={`${option.value}-${option.label}`} disabled={option?.disabled}>
        {option.label}
      </option>
    );
  });

  return (
    <SwitchContent
      expression={isEditing ? 'editing' : 'default'}
      cases={{
        editing: (
          <>
            <form onSubmit={handleSubmit}>
              <Form.Group
                controlId={id}
                isInvalid={error != null}
              >
                <Form.Label size="sm" className="h6 d-block" htmlFor={id}>{label}</Form.Label>
                <Form.Control
                  data-hj-suppress
                  name={name}
                  id={id}
                  type={type}
                  as={type}
                  value={value}
                  onChange={handleChange}
                  {...others}
                >
                  {options.length > 0 && selectOptions}
                </Form.Control>
                {!!helpText && <Form.Text>{helpText}</Form.Text>}
                {error != null && <Form.Control.Feedback>{error}</Form.Control.Feedback>}
                {others.children}
              </Form.Group>
              <p>
                <StatefulButton
                  type="submit"
                  className="mr-2"
                  state={saveState}
                  labels={{
                    default: intl.formatMessage(messages['account.settings.editable.field.action.save']),
                  }}
                  onClick={(e) => {
                    // Swallow clicks if the state is pending.
                    // We do this instead of disabling the button to prevent
                    // it from losing focus (disabled elements cannot have focus).
                    // Disabling it would causes upstream issues in focus management.
                    // Swallowing the onSubmit event on the form would be better, but
                    // we would have to add that logic for every field given our
                    // current structure of the application.
                    if (saveState === 'pending') { e.preventDefault(); }
                  }}
                  disabledStates={[]}
                />
                <Button
                  variant="outline-primary"
                  onClick={handleCancel}
                >
                  {intl.formatMessage(messages['account.settings.editable.field.action.cancel'])}
                </Button>
              </p>
            </form>
            {['name', 'verified_name'].includes(name) && <CertificatePreference fieldName={name} />}
          </>
        ),
        default: (
          <div className="account-field-row">
            <div className="account-field-row__label">
              <span className="account-field-row__label-text">{label}</span>
              {!!helpText && !renderConfirmationMessage() && (
                <span className="account-field-row__help">{helpText}</span>
              )}
            </div>
            <div className="account-field-row__control">
              <div
                data-hj-suppress
                className={classNames('account-field-row__box', { 'grayed-out': isGrayedOut })}
              >
                {renderValue(value)}
              </div>
              {renderConfirmationMessage() && (
                <p className="account-field-row__confirmation text-muted mb-0">{renderConfirmationMessage()}</p>
              )}
            </div>
            <div className="account-field-row__action">
              {isEditable ? (
                <Button variant="link" onClick={handleEdit}>
                  {intl.formatMessage(messages['account.settings.editable.field.action.edit'])}
                </Button>
              ) : null}
            </div>
          </div>
        ),
      }}
    />
  );
};

EditableSelectField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
  emptyLabel: PropTypes.node,
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  userSuppliedValue: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
  saveState: PropTypes.oneOf(['default', 'pending', 'complete', 'error']),
  error: PropTypes.string,
  confirmationMessageDefinition: PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultMessage: PropTypes.string.isRequired,
    description: PropTypes.string,
  }),
  confirmationValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  helpText: PropTypes.node,
  onEdit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
  isEditable: PropTypes.bool,
  isGrayedOut: PropTypes.bool,
};

EditableSelectField.defaultProps = {
  value: undefined,
  options: [],
  saveState: undefined,
  label: undefined,
  emptyLabel: undefined,
  error: undefined,
  confirmationMessageDefinition: undefined,
  confirmationValue: undefined,
  helpText: undefined,
  isEditing: false,
  isEditable: true,
  isGrayedOut: false,
  userSuppliedValue: undefined,
};

export default connect(editableFieldSelector, {
  onEdit: openForm,
  onCancel: closeForm,
})(EditableSelectField);