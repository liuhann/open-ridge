import React, { useState, useEffect } from 'react'

import {
  Button, Tree, Dropdown, Typography, Toast, Upload, Modal, Input
} from '@douyinfe/semi-ui'
import DialogCreate from './DialogCreate.jsx'

import appStore from '../../store/app.store.js'
import editorStore from '../../store/editor.store.js'
import { ICON_COMMON_PLUS, ICON_COMMON_GEAR, ICON_COMMON_DOT_VERT } from '../../icons/icons.js'
import PackageJsonEditorModal from '../apps/PackageJsonEditorModal.jsx'
import { getAppTreeData } from './utils.js'
import TitleBar from '../../components/TitleBar/TitleBar.jsx'
import './index.less'
import AIGenerateModal from '../ai/AIGenneratModal.jsx'

const { Text } = Typography

const ACCEPT_FILES = '.svg,.png,.jpg,.json,.css,.js,.md,.webp,.zip,.gif'

const AppFileList = () => {
  const [dialgeCreateFileType, setDialogCreateFileType] = useState('')
  const [dialogCreateShow, setDialogCreateShow] = useState(false)
  const [currentSelected, setCurrentSelected] = useState(null)

  const [currentDir, setCurrentDir] = useState('/')
  const [currentDirId, setCurrentDirId] = useState(-1)
  const [currentRename, setCurrentRename] = useState(null)
  const [treeData, setTreeData] = useState([])

  const [appModalEditVisible, setAppModalEditVisible] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  const currentAppName = appStore((state) => state.currentAppName)
  const currentAppIcon = appStore((state) => state.currentAppIcon)
  const currentAppFilesTree = appStore((state) => state.currentAppFilesTree)
  const exitToAppList = appStore((state) => state.exitToAppList)
  const renameFile = appStore((state) => state.renameFile)
  const uploadFile = appStore((state) => state.uploadFile)
  const moveFile = appStore((state) => state.moveFile)
  const deleteFile = appStore((state) => state.deleteFile)
  const exportFile = appStore((state) => state.exportFile)
  const finishAI = appStore((state) => state.finishAI)

  const openFile = editorStore(state => state.openFile)
  const openedPages = editorStore(state => state.openedPages)
  const closeAllPages = editorStore(state => state.closeAllPages)

  useEffect(() => {
    const appTreeData = getAppTreeData(currentAppFilesTree, currentAppName)

    // if (currentAppIcon) {
    //   appTreeData[0].icon = <img className='w24' src={currentAppIcon} />
    // }
    setTreeData(appTreeData)
  }, [currentAppFilesTree, currentAppName])

  const showCreateDialog = (fileType) => {
    setDialogCreateFileType(fileType)
    setDialogCreateShow(true)
  }

  const onFileUpload = async (files) => {
    for (const file of files) {
      const result = await uploadFile(currentDirId, file)
      if (result) {
        Toast.success('文件上传完成')
      } else {
        Toast.warning({
          content: '文件添加错误：存在相同名称文件',
          duration: 3
        })
      }
    }
  }

  const onRemoveClicked = async (data) => {
    Modal.confirm({
      zIndex: 10001,
      title: '删除后文件无法找回,是否确认',
      content: '推荐您可先通过导出先进行备份',
      onOk: async () => {
        await deleteFile(data.key)
        Toast.success('已经成功删除 ' + data.label)
      }
    })
  }

  const onCopyClicked = async (node) => {
    Toast.success('文件复制完成')
  }

  const onOpenClicked = (node) => {
    if (currentRename && currentRename.key === node.key) return
    if (node.type !== 'directory') {
      openFile(node.key)
    }
  }

  const move = async (node, dragNode, dropToGap) => {
    let parentId = -1

    if (dropToGap === false) { // 放置于node内
      if (node.children) {
        parentId = node.key
      } else {
        parentId = node.raw.parent
      }
    } else {
      parentId = node.raw.parent
    }

    const movedResult = await moveFile(dragNode.key, parentId)

    if (!movedResult) {
      Toast.warning({
        content: '目录移动错误：存在同名的文件',
        duration: 3
      })
    }
  }

  // 根据 key 查找树节点
  const findTreeNodeByKey = (treeData, key) => {
    for (const node of treeData) {
      if (node.key === key) return node
      if (node.children) {
        const res = findTreeNodeByKey(node.children, key)
        if (res) return res
      }
    }
    return null
  }

  const confirmFileRename = async () => {
    let finalName = currentRename.value

    // 找到当前正在重命名的节点
    const node = findTreeNodeByKey(treeData, currentRename.key)

    // 如果是 page 类型，自动补上 .json
    if (node && node.raw?.type === 'page' && !finalName.endsWith('.json')) {
      finalName += '.json'
    }

    const result = await renameFile(currentRename.key, finalName)
    if (result === -1) {
      Toast.error('文件名称冲突')
    } else {
      setCurrentRename(null)
    }
  }

  const onFileExportClick = async (fileid) => {
    exportFile(fileid)
  }

  // const confirmFileRename = async () => {
  //   const result = await renameFile(currentRename.key, currentRename.value)
  //   if (result === -1) {
  //     Toast.error('文件名称冲突')
  //   } else {
  //     setCurrentRename(null)
  //   }
  // }

  const CREATE_MENUS = [
    <Dropdown.Item key='page' onClick={() => showCreateDialog('page')}>手动创建空白页面</Dropdown.Item>,
    <Dropdown.Divider key='d1' />,
    <Dropdown.Item key='folder' onClick={() => showCreateDialog('folder')}>创建目录</Dropdown.Item>,
    <Dropdown.Item key='js' onClick={() => showCreateDialog('js')}>创建脚本库</Dropdown.Item>,
    <Dropdown.Item key='upload'>
      <Upload
        action='none'
        multiple showUploadList={false} uploadTrigger='custom' onFileChange={files => {
          onFileUpload(files)
        }} accept={ACCEPT_FILES}
      >
        上传文件
      </Upload>
    </Dropdown.Item>]

  const renderFullLabel = (label, data) => {
    const MORE_MENUS = []

    if (data.children) { // 位于根
      MORE_MENUS.push(...CREATE_MENUS)
    } else {
      MORE_MENUS.push(
        <Dropdown.Item
          key='open'
          onClick={() => {
            onOpenClicked(data)
          }}
        >打开
        </Dropdown.Item>
      )
    }

    if (data.key !== '-1') {
      MORE_MENUS.push(
        <Dropdown.Item
          key='copy'
          onClick={() => {
            onCopyClicked(data)
          }}
        >复制
        </Dropdown.Item>
      )
      MORE_MENUS.push(
        <Dropdown.Item
          key='rename'
          onClick={() => {
            setCurrentRename({
              key: data.key,
              value: label
            })
          }}
        >重命名
        </Dropdown.Item>
      )
      MORE_MENUS.push(
        <Dropdown.Item
          key='export'
          onClick={() => {
            onFileExportClick(data.key)
          }}
        >导出
        </Dropdown.Item>
      )
      MORE_MENUS.push(<Dropdown.Divider key='div' />)

      MORE_MENUS.push(
        <Dropdown.Item
          key='delete'
          type='danger'
          onClick={() => {
            onRemoveClicked(data)
          }}
        >删除
        </Dropdown.Item>
      )
    }
    return (
      <div className={'tree-label' + ((currentSelected && currentSelected.key === data.key) ? ' opened' : '')}>
        {(currentRename && currentRename.key === data.key)
          ? <Input
              size='small'
              suffix={<i onClick={confirmFileRename} className='bi bi-check2' />}
              onKeyPress={async ({ key }) => {
                if (key === 'Enter') {
                  confirmFileRename()
                }
              }}
              value={currentRename.value} onChange={val => {
                setCurrentRename({
                  ...currentRename,
                  value: val
                })
              }}
            />
          : <>
            <Text ellipsis>{label}</Text>
            <Dropdown
              className='app-files-dropdown'
              trigger='click'
              keepDOM
              position='bottomRight'
              clickToHide
              render={<Dropdown.Menu>{MORE_MENUS}</Dropdown.Menu>}
            >
              {data.key === '-1' && <div className='more-button'>{ICON_COMMON_PLUS}</div>}
              {data.key !== '-1' && <div className='more-button hover-show'>{ICON_COMMON_DOT_VERT}</div>}
            </Dropdown>
            </>}
        {/* <Text
          onClick={() => {
            const now = new Date().getTime()
            if (currentSelected && currentSelected.key === data.key && currentSelectedTime && now - currentSelectedTime > 1000 && now - currentSelectedTime < 3000) {
              setCurrentRename({
                key: data.key,
                value: currentSelected.label
              })
            }
          }} ellipsis={{ showTooltip: true }} style={{ width: 'calc(100% - 48px)' }} className='label-content'
        >{label}
        </Text> */}
      </div>
    )
  }

  const RenderCreateDropDown = () => {
    return (
      <Dropdown
        trigger='click'
        closeOnEsc
        clickToHide
        keepDOM
        position='bottomLeft'
        render={
          <Dropdown.Menu className='app-files-dropdown'>
            {CREATE_MENUS}
          </Dropdown.Menu>
          }
      >
        <Button
          theme='borderless' type='primary' icon={ICON_COMMON_PLUS}
        />
      </Dropdown>
    )
  }

  const onNodeSelect = async node => {
    if (currentSelected && node.key === currentSelected.key) {
      return
    }
    if (currentRename && currentRename.key !== node.key) {
      confirmFileRename()
    }
    if (Array.isArray(node.children)) {
      setCurrentDir(node.raw.path)
      setCurrentDirId(node.raw.id)
    } else {
      if (node.raw.parent) {
        setCurrentDir(node.raw.parentPath)
        setCurrentDirId(node.raw.parent)
      }
    }
    setCurrentSelected(node)
  }

  // 渲染逻辑
  return (
    <div className='left-panel app-file-list'>
      {/* 顶部标题栏：优化对齐，参考提供的样式 */}
      <TitleBar
        // onBack={confirmExitToAppList}
        icon={currentAppIcon}
        title={currentAppName}
        right={
          <Button
            style={{
              fontSize: '18px'
            }}
            theme='borderless' type='tertiary'
            icon={ICON_COMMON_GEAR} onClick={() => {
              setAppModalEditVisible(true)
            }}
          />
        }
      />
      <PackageJsonEditorModal
        visible={appModalEditVisible}
        onClose={() => setAppModalEditVisible(false)}
      />
      <DialogCreate
        show={dialogCreateShow}
        type={dialgeCreateFileType}
        parentPath={currentDir}
        parentId={currentDirId}
        close={() => {
          setDialogCreateShow(false)
        }}
      />

      <AIGenerateModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onFinish={async ({
          userPrompt,
          pageJson,
          scriptContent
        }) => {
          const result = await finishAI(pageJson, scriptContent, userPrompt)
          if (result) {
            // 提示成功  打开页面
            Modal.success({
              title: '页面已生成',
              content: '请点击确定打开预览您的杰作！',
              onOk: () => {
                openFile(result.id)
              }
            })
            return true
          } else {
            return false
          }
        }}
      />
      <div className='buttons-bar'>
        <Button
          style={{
            flex: 1
          }} colorful theme='solid' type='tertiary' onClick={() => setModalVisible(true)}
        >创建页面
        </Button>
        <RenderCreateDropDown />
      </div>
      <Tree
        autoExpandParent
        showRoo
        className='file-tree'
        showFilteredOnly
        draggable
        defaultExpandedKeys={['-1']}
        renderLabel={renderFullLabel}
        treeData={treeData}
        onDrop={({ node, dragNode, dropPosition, dropToGap }) => {
          move(node, dragNode, dropToGap)
        }}
        onDoubleClick={(ev, node) => {
          onOpenClicked(node)
        }}
        onSelect={(key, selected, node) => {
          onNodeSelect(node)
        }}
      />

    </div>
  )
}

export default AppFileList
