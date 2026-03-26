import MultiPageSwitch from './MultiPageSwitch.js'
import { classList } from 'ridge-build/src/props'
export default {
  name: 'page-switch',
  component: MultiPageSwitch,
  title: '多页切换',
  type: 'vanilla',
  icon: 'icons/pages.svg',
  props: [{
    name: 'currentPageId',
    label: '当前内容',
    connect: true,
    input: true,
    type: 'string',
    value: ''
  },
  {
    name: 'pages',
    label: '页面列表',
    connect: true,
    type: 'array',
    value: []
  },
  classList()
  ],
  events: [],
  fullScreenable: true,
  width: 540,
  height: 360
}
