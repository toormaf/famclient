import { FormConfig } from "../../components";

export const useBasicForm = () => {

  const basicFormConfig: FormConfig = {
    layout: 'vertical',
    submitButtonAlign: 'center',
    columns: 2,
    size: 'middle',
    fields: [
      {
        label: "First Name",
        name: 'firstName',
        type: 'input',
        placeholder: 'Enter your first name',
        required: true,
        span: 12,
      },
      {
        label: "Last Name",
        name: 'lastName',
        type: 'input',
        placeholder: 'Enter your last name',
        span: 12,
      },
      {
        label: "Select Gender",
        name: 'gender',
        type: 'select',
        placeholder: 'Select gender',
        required: true,
        options: [
          { label: 'Male', value: 1 },
          { label: 'Female', value: 2 },
          { label: 'Transgender', value: 3 },
        ],  
        span: 12,
      },
      {
        label: "Date of birth & time",
        name: 'dob',
        type: 'datetime',
        span: 12,
      },
      {
        label: "Login ID",
        name: 'loginId',
        type: 'select',
        placeholder: 'Select Login ID',
        required: true,
        options: [],
        span: 12,
      }
    ]
  };

  return {
    basicFormConfig
  };
}