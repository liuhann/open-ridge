import RelativeContainer from './RelativeContainer.js'
import { children, classList, boolean } from 'ridge-build/src/props.js'
export default {
  name: 'relative-container',
  component: RelativeContainer,
  title: '自由容器',
  type: 'vanilla',
  icon: 'icons/relative.svg',
  props: [
    children,
    boolean('overflow', '超出隐藏', true),
    classList()
  ],
  childProps: [{
    label: '距左',
    type: 'number',
    field: 'style.x'
  }, {
    label: '距上',
    type: 'number',
    field: 'style.y'
  }, {
    label: '宽度',
    type: 'number',
    field: 'style.width'
  }, {
    label: '高度',
    type: 'number',
    field: 'style.height'
  }, {
    label: '位置',
    field: 'style.align',
    type: 'array',
    control: 'select',
    multiple: true,
    options: [{
      label: '靠左',
      value: 'left'
    }, {
      label: '靠右',
      value: 'right'
    }, {
      label: '靠上',
      value: 'top'
    }, {
      label: '靠下',
      value: 'bottom'
    }],
    value: ['left', 'top']
  }],
  fullScreenable: true,
  width: 540,
  height: 360
}
