import React from 'react'

const BlogCard = ({
  imgSrc = './assets/images/blog/blog-img1.jpg', // 图片地址默认值
  imgAlt = 'Card image cap', // 图片alt
  title = 'Card title', // 卡片标题
  text = "Some quick example text to build on the card title and make up the bulk of the card's content.", // 卡片正文
  btnText = 'Go somewhere', // 按钮文字
  btnHref = 'javascript:void(0)', // 按钮默认链接
  onBtnClick // 按钮点击回调事件
}) => {
  // 按钮点击处理函数
  const handleBtnClick = (e) => {
    if (typeof onBtnClick === 'function') {
      e.preventDefault() // 阻止a标签默认跳转
      onBtnClick()
    }
  }

  return (
    <div className='card'>
      <img
        className='card-img-top img-responsive'
        src={imgSrc}
        alt={imgAlt}
      />
      <div className='card-body'>
        <h4 className='card-title'>{title}</h4>
        <p className='card-text'>{text}</p>
        <a
          href={btnHref}
          className='btn btn-primary'
          onClick={handleBtnClick}
        >
          {btnText}
        </a>
      </div>
    </div>
  )
}

export default BlogCard
