import React from 'react';

interface DateTimeInputProps {
  format?: string;
  formatValue?: string;
  change?: (value: string) => void;
}

declare const DateTimeInput: React.FC<DateTimeInputProps>;
export default DateTimeInput;
