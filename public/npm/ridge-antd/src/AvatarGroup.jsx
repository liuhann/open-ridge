import { Avatar } from 'antd'

const AvatarGroup = ({ srcList = [], max, size, shape }) => {
  return (
    <Avatar.Group
      max={{
        count: max
      }} size={size} shape={shape}
    >
      {srcList.map((item, index) => {
        // 情况 1：字符串 → 图片头像
        if (typeof item === 'string') {
          return <Avatar key={index} src={item} />
        }

        // 情况 2：对象 { text, color } → 文字头像
        if (typeof item === 'object' && item.text) {
          return (
            <Avatar
              key={index}
              style={{ backgroundColor: item.color }}
            >
              {item.text}
            </Avatar>
          )
        }

        return null
      })}
    </Avatar.Group>
  )
}

export default AvatarGroup
