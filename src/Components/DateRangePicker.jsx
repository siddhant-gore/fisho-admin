import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

export default function DateRangePicker({onSelect}) {
  const onChange = (dates, dateStrings) => {
    console.log('Selected range: ', dates);
    console.log('Formatted: ', dateStrings);
    onSelect && onSelect(dateStrings);
  };

  return (
    <RangePicker
      onChange={onChange}
      format="YYYY-MM-DD"
      allowEmpty
    />
  );
}
