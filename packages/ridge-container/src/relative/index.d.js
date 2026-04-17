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
  }],
  fullScreenable: true,
  width: 540,
  height: 360
}
