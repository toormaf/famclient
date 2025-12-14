import { Link } from "react-router-dom";
import { FormConfig } from "../components";

export const LOGIN_FORM_CONFIG: FormConfig = {
    layout: 'vertical',
    submitButtonAlign: 'center',
    columns: 2,
    size: 'middle',
    fields: [
      {
        name: 'emailOrMobile',
        type: 'emailOrMobile',
        placeholder: 'Enter your email or mobile number',
        required: true,
        span: 24,
      },
      {
        name: 'password',
        type: 'password',
        placeholder: 'Enter your password',
        required: true,
        minLength: 3,
        span: 24,
      },
      {
        name: 'rememberMe',
        label: 'Remember Me',
        type: 'checkbox',
        defaultValue: true,
        span: 12,
      },  
      {
        span: 12,
        name: 'termsLink',
        type: 'custom',
        render: () => (
            <Link to="/reset-password" className="text-link" target="_blank">Forgot Password ?</Link>
        ),
      }
    ],
};