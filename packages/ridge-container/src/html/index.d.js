import Html from './Html.js'

export default {
  name: 'html',
  component: Html,
  icon: 'icons/html.svg',
  title: '网页代码',
  type: 'vanilla',
  order: 20,
  width: 260,
  height: 160,
  props: [{
    name: 'html',
    type: 'string',
    label: 'HTML',
    connect: true,
    value: '<div>HTML</div>'
  }, {
    name: 'isCenter',
    type: 'boolean',
    label: '正中',
    value: true
  }, {
    name: 'classNames',
    label: '样式',
    type: 'style',
    value: []
  }]
}
