import { Select as AntSelect, SelectProps } from 'antd';

function Select({ children, ...props }: SelectProps) {
  return (
    <AntSelect {...props}>
      {children}
    </AntSelect>
  );
}

Select.Option = AntSelect.Option;
Select.OptGroup = AntSelect.OptGroup;

export default Select;
