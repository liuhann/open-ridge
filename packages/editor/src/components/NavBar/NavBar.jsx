import React from 'react'
import moduleStyle from './index.module.less'
import { Button } from '@douyinfe/semi-ui'
const NavBar = ({
  style,
  active = 0,
  iconSize,
  size = 'default',
  onChange,
  navs,
  bottoms
}) => {
  return (
    <div className={moduleStyle.nav} style={style}>
      <div className={moduleStyle.navList}>
        {navs && navs.map((n, index) => {
          return (
            <Button
              style={{
                fontSize: '24px',
                padding: '18px 6px'
              }}
              onClick={() => {
                onChange && onChange(n, index)
              }} theme={active === n.name ? 'solid' : 'borderless'} type={active === n.name ? 'primary' : 'tertiary'} key={index} size={size} icon={n.icon} iconSize={iconSize || size}
            />
          )
        })}
      </div>
      {bottoms && bottoms.map((n, index) => {
        return (
          <Button
            style={{
              fontSize: '24px',
              padding: '18px 6px'
            }} theme='borderless' type='tertiary' key={index} size={size} icon={n.icon} iconSize={iconSize || size}
          />
        )
      })}
    </div>
  )
}

export default NavBar
