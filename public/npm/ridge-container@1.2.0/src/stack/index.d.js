import StackContainer from './StackContainer.js'
import { children, classList } from 'ridge-build/src/props'
export default {
  name: 'stack-container',
  component: StackContainer,
  title: '多层容器',
  type: 'vanilla',
  icon: 'icons/stack.svg',
  props: [
    classList(),
    children],
  childProps: [{
    label: '悬浮展示',
    width: '50%',
    control: 'boolean',
    field: 'style.showOnHover',
    connect: true
  }],
  fullScreenable: true,
  width: 540,
  height: 360
}
