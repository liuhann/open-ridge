import React, { useState } from 'react'
import NavBar from '../../components/NavBar/NavBar.jsx'
import moduleStyle from './index.module.less'
import { Button } from '@douyinfe/semi-ui'
import { ICON_NAV_COMPONENTS, ICON_NAV_FOLDERS, ICON_NAV_RUN, ICON_COMMON_GEAR, ICON_COMMON_ARROW_LEFT } from '../../icons/icons.js'
const LeftNav = ({
  active,
  onBack,
  onChange
}) => {
  // const [active, setActive] = useState(0)
  return (
    <div className={moduleStyle.navRoot}>
      <Button
        icon={ICON_COMMON_ARROW_LEFT}
        style={{
          fontSize: 22
        }}
        theme='borderless' type='tertiary'
        onClick={onBack}
      />
      <NavBar
        onChange={(item, index) => {
          // setActive(index)
          onChange(item.name)
        }}
        active={active}
        navs={[{
          name: 'app',
          icon: ICON_NAV_FOLDERS
        }, {
          name: 'component',
          icon: ICON_NAV_COMPONENTS
        }, {
          name: 'preview',
          icon: ICON_NAV_RUN
        }]}
      />
    </div>
  )
}

export default LeftNav
