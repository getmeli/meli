import { EmailForm, Form } from './form';

function serializeEmailForm(form: EmailForm) {
  return {
    recipient: form.recipient,
  };
}

function customFields(form: Form) {
  switch (form.type) {
    case 'email':
      return serializeEmailForm(form);
    default: {
      return {};
    }
  }
}

export function serializeForm(form: Form) {
  return {
    type: form.type,
    name: form.name,
    ...customFields(form),
  };
}
