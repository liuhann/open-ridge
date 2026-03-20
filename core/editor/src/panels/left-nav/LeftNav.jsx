import React, { useState } from 'react'
import NavBar from '../../components/NavBar/NavBar.jsx'

const LeftNav = ({
  onChange
}) => {
  const [active, setActive] = useState(0)
  return (
    <NavBar
      onChange={(item, index) => {
        setActive(index)
        onChange(item.name)
      }}
      active={active}
      navs={[{
        name: 'app',
        icon: <i className='bi bi-folder2' />
      }, {
        name: 'component',
        icon: <i className='bi bi-grid-1x2' />
      }, {
        name: 'preview',
        icon: <i class='bi bi-caret-right-square' />
      }]}
      bottoms={[{
        icon: <i className='bi bi-gear' />
      }]}
    />
  )
}

export default LeftNav
