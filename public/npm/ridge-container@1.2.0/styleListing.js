const CURSOR_NAMES = [
  'default',
  'pointer',
  'text',
  'help',
  'wait',
  'move',
  'not-allowed',
  'crosshair',
  'copy',
  'zoom-in',
  'zoom-out'
]

const text = (cursor) => {
  return {
    html: `<div class="p-2 ${cursor}">${cursor}</div>`,
    key: 'cursor-' + cursor
  }
}

const cursor = {
  label: '鼠标',
  value: 'mouse',
  multiple: false,
  classList: CURSOR_NAMES.map(cursor => text(cursor))
}

const display = {
  label: '可见性',
  value: 'visibility',
  multiple: true,
  classList: [{
    key: 'vis-visible',
    html: '<div class="p-2">可见</div>'
  }, {
    key: 'vis-visible-im',
    html: '<div class="p-2">可见(强制)</div>'
  }, {
    key: 'vis-hidden',
    html: '<div class="p-2">不可见</div>'
  }, {
    key: 'vis-hidden-im',
    html: '<div class="p-2">不可见(强制)</div>'
  }, {
    key: 'hidden-to-visible',
    html: '<div class="p-2">上浮可见</div>'
  }]
}

const writingMode = {
  label: '书写方向',
  value: 'writing-mode',
  multiple: false,
  classList: [{
    key: 'horizontal-tb',
    html: '<div class="p-2">从左到右</div>'
  }, {
    key: 'vertical-rl',
    html: '<div class="p-2">垂直从右到左</div>'
  }, {
    key: 'vertical-lr',
    html: '<div class="p-2">垂直从左到右</div>'
  }]
}

export default {
  type: 'style',
  data: [cursor, display, writingMode]
}
