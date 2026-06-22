import React from 'react'

const EmptyTipCard = ({
  imgSrc = '../assets/images/backgrounds/website-under-construction.svg',
  imgAlt = 'modernize-img',
  imgWidth = 200,
  title = 'Oops something went wrong!',
  desc = 'Trying again to bypasses these temporary error.',
  btnText = 'Retry',
  btnTheme = 'danger',
  onBtnClick,
  style
}) => {
  const btnClassMap = {
    primary: 'btn btn-primary',
    success: 'btn btn-success',
    warning: 'btn btn-warning',
    danger: 'btn btn-danger',
    info: 'btn btn-info',
    secondary: 'btn btn-secondary'
  }
  const btnCls = btnClassMap[btnTheme] || btnClassMap.danger

  const handleClick = () => {
    if (typeof onBtnClick === 'function') onBtnClick()
  }

  return (
    <div className='card' style={style}>
      <div className='card-body text-center'>
        {imgSrc && <img
          src={imgSrc}
          alt={imgAlt}
          className='img-fluid mb-4'
          width={imgWidth}
                   />}
        <h5 className='fw-semibold fs-5 mb-2'>{title}</h5>
        <p className='mb-3 px-xl-5'>{desc}</p>
        <button className={btnCls} onClick={handleClick}>
          {btnText}
        </button>
      </div>
    </div>
  )
}

export default EmptyTipCard
