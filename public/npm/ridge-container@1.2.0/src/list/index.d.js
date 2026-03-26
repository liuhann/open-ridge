import ListContainer from './ListContainer'
import { boolean, number, radiogroup } from 'ridge-build/src/props'
export default {
  name: 'list-container',
  component: ListContainer,
  title: '列表容器',
  icon: 'icons/list.svg',
  type: 'vanilla',
  props: [{
    name: 'dataSource',
    label: '数据',
    type: 'array',
    connect: true,
    control: 'json',
    value: []
  }, {
    name: 'selected',
    label: '选中项',
    type: 'array',
    connect: true,
    control: 'json',
    value: []
  }, {
    name: 'template',
    label: '单项模板',
    resizable: true,
    type: 'slot'
  },
  boolean('overflowAuto', '超出滚动', true, false),
  radiogroup('direction', '方向', [{
    label: '横向',
    value: 'x'
  }, {
    label: '纵向',
    value: 'y'
  }], 'y'),
  {
    name: 'fixedHeight',
    label: '固定高度',
    type: 'boolean',
    value: true
  }, {
    name: 'fixedWidth',
    label: '固定宽度',
    type: 'boolean',
    value: true
  },
  {
    name: 'horizontalDivide',
    label: '水平等分',
    hidden: props => props.fixedWidth === true,
    type: 'number',
    value: 3
  }, {
    name: 'verticalDivide',
    label: '垂直等分',
    hidden: props => props.fixedHeight === true,
    type: 'number',
    value: 3
  },
  boolean('sortable', '拖拽排序', false, false),
  number('gap', '间隔', 4),
  {
    name: 'classNames',
    label: '整体样式',
    type: 'style',
    value: []
  }],
  childProps: [{
    label: 'W',
    width: '50%',
    control: 'number',
    field: 'style.width',
    fieldEx: 'styleEx.width'
  }, {
    label: 'H',
    width: '50%',
    control: 'number',
    field: 'style.height',
    fieldEx: 'styleEx.height'
  }],
  events: [{
    name: 'onItemClick',
    label: '单项点击'
  }],
  width: 420,
  height: 360
}
