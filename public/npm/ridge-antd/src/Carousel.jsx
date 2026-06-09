import { Carousel } from 'antd'
import React from 'react'

const MyCarousel = ({
  slides = [],
  effect = 'scrollx',
  autoplay = false,
  autoplaySpeed = 3000,
  dots = true,
  arrows = false,
  infinite = true,
  draggable = false,
  adaptiveHeight = false,
  dotPlacement = 'bottom',
  width,
  height,
  speed = 500,
  style,
  className
}) => {
  return (
    <Carousel
      effect={effect}
      autoplay={autoplay}
      autoplaySpeed={autoplaySpeed}
      dots={dots}
      arrows={arrows}
      infinite={infinite}
      draggable={draggable}
      adaptiveHeight={adaptiveHeight}
      dotPlacement={dotPlacement}
      speed={speed}
      style={{
        width: width + 'px',
        height: height + 'px',
        ...style
      }}
      className={className}
    >
      {slides.map((item, index) => {
        const { src, title } = item || {}
        const hasImage = !!src
        const hasTitle = !!title

        return (
          <div key={index}>
            <div
              style={{
                position: 'relative',
                width: width + 'px',
                height: height + 'px',
                overflow: 'hidden'
              }}
            >
              {/* 图片：填满整个容器 */}
              {hasImage && (
                <img
                  src={src}
                  alt={title || `slide-${index}`}
                  style={{
                    width: width + 'px',
                    height: height + 'px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              )}

              {/* 文字：固定在底部居中 */}
              {hasTitle && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    right: 0,
                    padding: '12px 16px 24px',
                    backgroundColor: hasImage ? 'rgba(0, 0, 0, 0.5)' : '#364d79',
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: 16,
                    fontWeight: 500
                  }}
                >
                  {title}
                </div>
              )}

              {/* 纯文字（无图片）撑满容器 */}
              {!hasImage && hasTitle && (
                <div
                  style={{
                    width: width + 'px',
                    height: height + 'px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#364d79',
                    color: '#fff',
                    fontSize: 18
                  }}
                />
              )}
            </div>

          </div>
        )
      })}
    </Carousel>
  )
}

export default MyCarousel
