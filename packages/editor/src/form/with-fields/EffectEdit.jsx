import React, { useState } from 'react'
import { Popover, withField, Button, Tabs, TabPane, Spin, Empty, Typography, TextArea } from '@douyinfe/semi-ui'
import context from '../../service/RidgeEditorContext.js'

const RenderEmpty = () => (
  <Empty
    title='应用未安装效果库'
    description={
      <span>
        <Typography.Text>试试 </Typography.Text>
        <Typography.Text link>去查找安装</Typography.Text>
      </span>
        }
  />
)

const EffectEdit = ({
  value,
  onChange
}) => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pluginList, setPluginList] = useState([])

  const [, pluginValue = ''] = (value || '').split('/')

  const renderContent = () => {
    if (loading) {
      return <Spin />
    } else {
      return (
        <div className='effect-pop-content'>
          {pluginList && pluginList.length === 0 && <RenderEmpty />}
          <Tabs
            style={{ height: '100%' }}
            size='small'
            type='button'
          >
            {pluginList && pluginList.map((plugin) => {
              const EditControl = plugin.EditControl
              return (
                <TabPane
                  style={{ height: '100%' }}
                  key={plugin.name} tab={
                    <span>
                      {plugin.description}
                    </span>
                  }
                >
                  <EditControl
                    value={pluginValue} onChange={val => {
                      onChange && onChange(plugin.packageName + '/' + val)
                      // onChange(plugin.packageName + '/' + val)
                    }}
                  />
                </TabPane>
              )
            })}
          </Tabs>
        </div>
      )
    }
  }

  const onEditClick = async () => {
    const pluginPackages = context.pluginPackages || []

    const list = []
    for (const pkg of pluginPackages) {
      const plugin = await context.loadPlugin(pkg)
      if (plugin.control) {
        plugin.EditControl = (await plugin.control()).default
        list.push(plugin)
      }
    }

    setPluginList(list)
    setLoading(false)
    setVisible(true)
  }

  return (

    <>
      <TextArea
        value={value} rows={2} showClear onChange={val => {
          onChange && onChange(val)
        }}
      />
      <Popover
        visible={visible} content={renderContent()} trigger='custom' onClickOutSide={() => {
          setVisible(false)
        }}
      >
        <Button
          theme='borderless'
          type='tertiary'
          icon={<i className='bi bi-pencil' />}
          size='small' onClick={() => {
            onEditClick()
          }}
        >配置
        </Button>
      </Popover>
    </>
  )
}

export default withField(EffectEdit)
