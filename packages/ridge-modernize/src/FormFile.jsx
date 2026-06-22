import React from 'react'

const FormFile = ({
  size = 'md',
  disabled = false,
  accept = '',
  multiple = false,
  className = '',
  style,
  onChange
}) => {
  let inputClass = 'form-control'
  if (size === 'sm') inputClass += ' form-control-sm'
  if (size === 'lg') inputClass += ' form-control-lg'
  inputClass += ` ${className}`

  const handleChange = (e) => {
    const files = multiple ? Array.from(e.target.files) : e.target.files[0]
    onChange && onChange(files, e)
  }

  return (
    <input
      type='file'
      className={inputClass.trim()}
      disabled={disabled}
      accept={accept}
      multiple={multiple}
      style={style}
      onChange={handleChange}
    />
  )
}

export default FormFile
