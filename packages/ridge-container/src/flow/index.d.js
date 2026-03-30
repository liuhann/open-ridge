import FlowContainer from './FlowContainer'
import { classList, children } from 'ridge-build/src/props'

export default {
  name: 'flow-container',
  component: FlowContainer,
  title: '流式容器',
  // description: '内部节点类似文档内部图文一样，按序自然摆放。通常用于文字、图片类的内容的混合放置。 另外因为其不限制内部元素大小，元素大小完全根据内容进行伸缩',
  // splash: 'icons/inline_layout.png',
  type: 'vanilla',
  order: 3,
  icon: 'icons/wrap.svg',
  props: [children, classList()],
  childProps: [
    {
      field: 'style.width',
      label: '宽度',
      type: 'number',
      width: '50%'
    }, {
      field: 'style.height',
      label: '高度',
      type: 'number',
      width: '50%'
    }, {
      field: 'style.block',
      label: '块级',
      type: 'boolean',
      width: '50%'
    }],
  width: 800,
  height: 600
}
