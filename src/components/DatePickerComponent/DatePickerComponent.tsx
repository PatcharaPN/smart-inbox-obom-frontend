import React from "react";
import { DatePicker, Space } from "antd";
import { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;
const dateFormat = "DD/MM/YYYY";

interface DatePickerComponentProp {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onChange?: (
    dates: [Dayjs | null, Dayjs | null] | null,
    dateStrings: [string, string]
  ) => void;
  clearbtn?: () => void;
}

const DatePickerComponent: React.FC<DatePickerComponentProp> = ({
  startDate,
  endDate,
  onChange,
}) => (
  <Space direction="vertical" size={12}>
    <RangePicker
      value={[startDate, endDate]}
      onChange={onChange}
      format={dateFormat}
      allowClear={true}
      className="custom-range-picker border border-gray-300 rounded-md w-full"
    />
  </Space>
);

export default DatePickerComponent;
