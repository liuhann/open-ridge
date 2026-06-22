import React, { useState } from 'react'

// 统一全局主题配色
const themeClassMap = {
  primary: {
    checkbox: 'form-check-input primary check-light-primary',
    badge: 'bg-primary-subtle text-primary'
  },
  success: {
    checkbox: 'form-check-input success check-light-success',
    badge: 'bg-success-subtle text-success'
  },
  warning: {
    checkbox: 'form-check-input warning check-light-warning',
    badge: 'bg-warning-subtle text-warning'
  },
  danger: {
    checkbox: 'form-check-input danger check-light-danger',
    badge: 'bg-danger-subtle text-danger'
  },
  info: {
    checkbox: 'form-check-input info check-light-info',
    badge: 'bg-info-subtle text-info'
  },
  secondary: {
    checkbox: 'form-check-input secondary check-light-secondary',
    badge: 'bg-secondary-subtle text-secondary'
  }
}

const TodoTaskList = ({
  showCheckbox = true,
  dataSource = [
    {
      title: 'Give purchase report to john',
      desc: '2 January 2024',
      theme: 'success',
      tags: [
        { label: 'Primary', theme: 'success' },
        { label: 'Social', theme: 'primary' }
      ],
      menus: ['Edit', 'Copy', 'Delete']
    },
    {
      title: 'Hit the gym',
      desc: '5 January 2024',
      theme: 'primary',
      tags: [
        { label: 'Promotions', theme: 'warning' }
      ],
      menus: ['Edit', 'Delete']
    }
  ],
  onCheckChange,
  onMenuClick,
  style
}) => {
  // 控制每条下拉菜单展开状态
  const [openDropdownIdx, setOpenDropdownIdx] = useState(-1)

  const handleCheckbox = (index, checked) => {
    if (typeof onCheckChange === 'function') {
      onCheckChange(index, checked)
    }
  }

  // 下拉选项点击：传出当前行下标 + 菜单标识字符串
  const handleMenuSelect = (itemIndex, menuKey) => {
    setOpenDropdownIdx(-1)
    if (typeof onMenuClick === 'function') {
      onMenuClick(itemIndex, menuKey)
    }
  }

  // 切换下拉显隐
  const toggleDropdown = (idx) => {
    setOpenDropdownIdx(openDropdownIdx === idx ? -1 : idx)
  }

  return (
    <div className='todo-widget' style={style}>
      <ul className='list-task todo-list list-group mb-0' data-role='tasklist'>
        {dataSource.map((item, idx) => {
          const currentTheme = themeClassMap[item.theme] || themeClassMap.primary
          const isDropdownOpen = openDropdownIdx === idx
          return (
            <li
              key={idx}
              className='list-group-item todo-item border-0 mb-0 py-3 pe-3 ps-0'
              data-role='task'
            >
              <div className='form-check d-flex align-items-start w-100'>
                {showCheckbox && (
                  <input
                    type='checkbox'
                    className={currentTheme.checkbox}
                    id={`task-check-${idx}`}
                    onChange={(e) => handleCheckbox(idx, e.target.checked)}
                  />
                )}
                <label
                  className={`form-check-label todo-label d-md-flex align-items-center flex-grow-1 ${showCheckbox ? 'ps-2' : ''}`}
                  htmlFor={`task-check-${idx}`}
                >
                  <div>
                    <h5 className='todo-desc mb-0 fs-3 fw-medium mt-n1'>
                      {item.title}
                    </h5>
                    <div className='todo-desc text-muted fw-normal fs-2'>
                      {item.desc}
                    </div>
                  </div>
                </label>

                {/* 右侧区域：标签 + 三点下拉菜单 */}
                <div className='ms-auto d-flex align-items-center gap-3'>
                  {item.tags && item.tags.length > 0 && (
                    <div className='d-flex gap-2 flex-wrap align-items-center'>
                      {item.tags.map((tag, tagIdx) => {
                        const tagTheme = themeClassMap[tag.theme] || themeClassMap.primary
                        return (
                          <span
                            key={tagIdx}
                            className={`badge fw-medium ${tagTheme.badge}`}
                          >
                            {tag.label}
                          </span>
                        )
                      })}
                    </div>
                  )}

                  {/* 三点下拉 dropstart */}
                  {item.menus && item.menus.length > 0 && (
                    <div className='dropdown dropstart position-relative'>
                      <a
                        href='javascript:void(0)'
                        className='link'
                        onClick={() => toggleDropdown(idx)}
                        aria-expanded={isDropdownOpen}
                      >
                        <i className='ti ti-dots fs-6 text-dark' />
                      </a>
                      {isDropdownOpen && (
                        <ul className='dropdown-menu show position-absolute' style={{ inset: '0px 0px auto auto', transform: 'translate(-22px, 4px)' }}>
                          <li>
                            <h6 className='dropdown-header'>选择操作</h6>
                          </li>
                          {item.menus.map((menuKey, mIdx) => (
                            <li key={mIdx}>
                              <a
                                className='dropdown-item'
                                href='javascript:void(0)'
                                onClick={() => handleMenuSelect(idx, menuKey)}
                              >
                                {menuKey}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default TodoTaskList
