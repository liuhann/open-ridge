import dayjs from 'dayjs'
import { DatePicker, ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
dayjs.locale('zh-cn')
/**
 * 🔥 封装重点：
 * value 接收 字符串 YYYY-MM-DD
 * onChange 返回 字符串 YYYY-MM-DD
 * 内部自动转换为 dayjs
 */
const RidgeDatePicker = (props) => {
  const { value, onChange, ...restProps } = props

  // 字符串 → dayjs（给 antd 用）
  const dayjsValue = value ? dayjs(value) : undefined

  // 内部 onChange：dayjs → 字符串（给业务用）
  const handleChange = (date, dateString) => {
    if (onChange) {
      onChange(dateString || null) // 👈 直接返回字符串
    }
  }

  return (
    <ConfigProvider locale={zhCN}>
      <DatePicker
        {...restProps}
        value={dayjsValue}
        onChange={handleChange}
      />
    </ConfigProvider>
  )
}

// 保持 antd 原生用法
RidgeDatePicker.RangePicker = DatePicker.RangePicker
RidgeDatePicker.WeekPicker = DatePicker.WeekPicker
RidgeDatePicker.MonthPicker = DatePicker.MonthPicker
RidgeDatePicker.QuarterPicker = DatePicker.QuarterPicker
RidgeDatePicker.YearPicker = DatePicker.YearPicker

export default RidgeDatePicker
