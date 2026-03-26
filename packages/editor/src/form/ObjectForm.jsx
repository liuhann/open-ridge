import React from 'react'
import { Form, Divider, Typography } from '@douyinfe/semi-ui'
import './form.less'

import StateBindEdit from './with-fields/StateBindEdit.jsx'
import EventEdit from './with-fields/EventEdit.jsx'
import JSONEdit from './with-fields/JSONEdit.jsx'
import ImageEdit from './with-fields/ImageEdit.jsx'
import ImageSelect from './with-fields/ImageSelect.jsx'
import RadioGroupEdit from './with-fields/RadioGroupEdit.jsx'
import CustomControlEdit from './with-fields/CustomControlEdit.jsx'
import AppFileSelectEdit from './with-fields/AppFileSelectEdit.jsx'
import SlotEdit from './with-fields/SlotEdit.jsx'
import AudioEdit from './with-fields/AudioEdit.jsx'
import BooleanEdit from './with-fields/BooleanEdit.jsx'
import FieldTreeSelect from './with-fields/TreeSelect.jsx'
import ClassSelect from './with-fields/ClassSelect.jsx'
import EffectEdit from './with-fields/EffectEdit.jsx'
import StringEdit from './with-fields/StringEdit.jsx'
import WithFieldEdit from './with-fields/WithFieldEdit.jsx'
import ColorPicker from './with-fields/ColorPicker.jsx'
import OptionEdit from './with-fields/OptionEdit.jsx'
const {
  InputNumber,
  Select,
  TagInput,
  DatePicker,
  Checkbox
} = Form

const getOptionList = (options) => {
  if (Array.isArray(options)) {
    return options.map(item => {
      if (typeof item === 'string') {
        return {
          label: item,
          value: item
        }
      } else {
        return item
      }
    })
  }
  return options
}

const {
  Text
} = Typography
class ObjectForm extends React.Component {
  constructor (props) {
    super(props)
    this.ref = React.createRef()

    this.controlGeneratorMap = {
      divider: (col) => <Divider margin='0' align='center'>{col.label}</Divider>,
      number: (col, readonly) => <InputNumber size='small' label={col.label} disabled={readonly} innerButtons field={col.field} />, // 数字
      string: (col, readonly) => <StringEdit size='small' label={col.label} field={col.field} disabled={readonly} />, // 字符串
      textarea: (col, readonly) => <JSONEdit label={col.label} field={col.field} disabled={readonly} type='string' />, // 文本域
      checkbox: (col, readonly) => <Checkbox size='small' label={col.label} field={col.field} disabled={readonly} />,
      boolean: (col, readonly) => <BooleanEdit noLabel={col.label == null} label={col.label ?? ''} {...col} />, // 布尔值
      select: (col, readonly) => { // 下拉选择
        const optionList = getOptionList(col.options || col.optionList)
        return <Select size='small' allowCreate={col.allowCreate} filter={col.filter} label={col.label} showClear={col.required === false} field={col.field} placeholder={col.placeholder} multiple={col.multiple} optionList={optionList} disabled={readonly} />
      },
      radiogroup: (col, readonly) => <RadioGroupEdit label={col.label} field={col.field} options={col.optionList || col.options} disabled={readonly} />, // 单选框组
      event: (col, readonly, options) => <EventEdit className='event-field' noLabel field={col.field} options={{ label: col.label, ...options, fieldId: col.field }} />,
      image: (col, readonly) => <ImageSelect label={col.label} field={col.field} disabled={readonly} options={col} />, // 图片选择
      page: (col, readonly) => <ImageEdit label={col.label} field={col.field} disabled={readonly} options={col} />, // 页面选择
      audio: (col, readonly) => <AudioEdit label={col.label} field={col.field} disabled={readonly} />,
      json: (col, readonly) => <JSONEdit label={col.label} field={col.field} disabled={readonly} />,
      object: (col, readonly) => <JSONEdit label={col.label} field={col.field} disabled={readonly} />,
      array: (col, readonly) => <JSONEdit label={col.label} field={col.field} disabled={readonly} />,
      class: (col) => <ClassSelect label={col.label} field={col.field} options={col} />,
      tree: col => <FieldTreeSelect label={col.label} field={col.field} options={col} />,
      style: col => <ClassSelect label={col.label} field={col.field} options={col} />,
      // slot: col => <SlotEdit label={col.label} field={col.field} options={col} />,
      element: col => <SlotEdit label={col.label} field={col.field} options={{ tree: true }} />,
      file: col => <AppFileSelectEdit label={col.label} field={col.field} options={col} />,
      color: col => <ColorPicker label={col.label} field={col.field} options={col} />,
      strings: col => <TagInput size='small' label={col.label} field={col.field} />,
      datetime: col => <DatePicker size='small' label={col.label} field={col.field} type='dateTime' />,
      effect: col => <EffectEdit label={col.label} field={col.field} />,
      options: col => <OptionEdit label={col.label} field={col.field} />
      // icon: col => <FontIconEdit label={col.label} field={col.field} options={col} />
    }
  }

  getRenderField (field, readonly, options) {
    if (!field.field) {
      return <Form.Slot label={field.label}><Text disabled>未定义属性名称</Text></Form.Slot>
    }
    if (this.controlGeneratorMap[field.control]) {
      try {
        return this.controlGeneratorMap[field.control](field, readonly, options)
      } catch (e) {
        return <div>---</div>
      }
    } else if (typeof field.control === 'function') {
      if (field.controlComponent) {
        const result = (
          <WithFieldEdit
            label={field.label ?? ''} field={field.field} options={{
              Component: field.controlComponent
            }}
          />
        )
        return result
        // const WithField = withField(field.controlComponent)
        // const result = <WithField label={field.label ?? ''} field={field.field} />
        // return result
      } else {
        // Legacy 遗留功能，后续不再支持
        return (
          <CustomControlEdit
            label={field.label ?? ''} field={field.field} options={{
              controlFunc: field.control,
              controlBtnText: field.btnText,
              inline: field.inline,
              preload: field.preload
            }}
          />
        )
      }
    } else {
      // 未定义的配置方式
      return <Form.Slot label={field.label}><Text disabled>未定义配置方式</Text></Form.Slot>
    }
  }

  renderField (field, index, formState, options) {
    if (field.type === 'children' || field.type === 'slot') {
      return
    }
    const hidden = (typeof field.hidden === 'function') ? field.hidden(formState.values) : field.hidden
    if (hidden) {
      return
    }
    const readonly = (typeof field.readonly === 'function') ? field.readonly(formState.values) : field.readonly
    if (field.control == null) {
      field.control = field.type
    }
    if (!field.label && field.description) {
      field.label = field.description
    }

    if (field.type === 'number' || field.type === 'color' || field.type === 'boolean') {
      if (!field.width) {
        field.width = '50%'
      }
    }
    const RenderField = this.getRenderField(field, readonly, options)

    const fieldClassList = ['field-block']
    if (!field.width || field.width === '100%') {
      fieldClassList.push('full')
    }
    if (field.type === 'divider') {
      return <Divider key={index} margin='0' align='left'>{field.label || ''}</Divider>
    } else if (field.fieldEx) {
      // 封装动态绑定的支持
      fieldClassList.push('with-code-expr')
      return (
        <div key={index} className={fieldClassList.join(' ')} style={{ width: field.width || '100%' }}>
          <div style={{ flex: 1 }}>
            {RenderField}
          </div>
          <div style={{
            width: '22px'
          }}
          >
            <StateBindEdit
              className='field-code-expr' noLabel field={field.fieldEx} options={options}
            />

          </div>
        </div>
      )
    } else {
      return (
        <div key={index} className={fieldClassList.join(' ')} style={{ width: field.width || '100%' }}>
          {RenderField}
        </div>
      )
    }
  }

  render () {
    const renderField = this.renderField.bind(this)

    const { fields, getFormApi, onValueChange, style, initValues, options, labelPosition = 'left' } = this.props
    const callback = (api) => {
      this.api = api
      getFormApi && getFormApi(api)
    }
    return (
      <div className='object-form' style={style}>
        <Form
          size='small'
          labelAlign='right'
          labelPosition={labelPosition}
          layout='horizontal'
          getFormApi={callback}
          initValues={initValues}
          onValueChange={onValueChange}
          render={({ formState, formApi, values }) => {
            return (
              <>
                {fields && fields.map((field, index) => {
                  try {
                    return renderField(field, index, formState, options)
                  } catch (e) {
                    return null
                  }
                })}
                {/* {sections && sections.map(renderSection)} */}
              </>
            )
          }}
        />
      </div>
    )
  }
}

export default ObjectForm
