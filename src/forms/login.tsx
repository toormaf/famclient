import { Link } from "react-router-dom";
import { FormConfig } from "../components";

export const useLoginForm = () => {

  const loginFormConfig: FormConfig = {
    layout: 'vertical',
    submitButtonAlign: 'center',
    columns: 2,
    size: 'middle',
    fields: [
      {
        name: 'username',
        type: 'emailOrMobile',
        placeholder: 'Enter your email or mobile number',
        rules:[{required:true, message: 'Please enter email or mobile number'}],
        span: 24,
      },
      {
        name: 'password',
        type: 'password',
        placeholder: 'Enter your password',
        rules:[{required:true}],
        span: 24,
      },
      {
        name: 'rememberMe',
        label: 'Remember Me',
        className: 'hide-label',
        type: 'checkbox',
        defaultValue: true,
        span: 12,
      },  
      {
        span: 12,
        name: 'termsLink',
        className: 'text-right',
        type: 'custom',
        render: () => (
            <Link to="/reset-password" className="text-link" target="_blank">Forgot Password ?</Link>
        ),
      }
    ],
  };

  return {
    loginFormConfig
  };
}