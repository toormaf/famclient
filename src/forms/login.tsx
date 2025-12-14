import { FormConfig } from "../components";

export const LOGIN_FORM_CONFIG: FormConfig = {
    layout: 'vertical',
    columns: 1,
    size: 'middle',
    fields: [
      {
        name: 'emailOrMobile',
        type: 'emailOrMobile',
        placeholder: 'Enter your email or mobile number',
        required: true,
      },
      {
        name: 'password',
        type: 'password',
        placeholder: 'Enter your password',
        required: true,
        minLength: 3,
      },
    ],
};