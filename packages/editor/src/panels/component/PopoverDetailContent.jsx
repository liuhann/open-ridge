// components/PopoverDetailContent.jsx
import React from 'react';
import { Typography } from '@douyinfe/semi-ui';
import { loader } from 'ridgejs';
import { getDisplayName, getInitial, getIconUrl, estimateBundleSize, CATEGORIES } from './componentUtils.js';

const { Text } = Typography;

const PopoverDetailContent = ({ item }) => {
  const displayName = getDisplayName(item);
  const version = item.version || '未知';
  const iconUrl = getIconUrl(item);
  const dependencies = item.dependencies || [];
  const bundleSize = estimateBundleSize(item.dist);
  const categoryInfo = CATEGORIES[item.category] || {};

  return (
    <div className='popover-detail'>
      <div className='popover-detail-header'>
        <div className='popover-detail-title'>
          {iconUrl ? (
            <img src={iconUrl} alt={displayName} className='popover-detail-icon' />
          ) : (
            <div className='popover-detail-icon'>
              {getInitial(displayName)}
            </div>
          )}
          <div>
            <h3 className='popover-detail-name'>{displayName}</h3>
            <div className='popover-detail-meta'>
              <span className='popover-detail-version'>{version}</span>
            </div>
          </div>
        </div>

        {item.description && (
          <Text className='popover-detail-description'>
            {item.description}
          </Text>
        )}
      </div>

      <div className='popover-detail-body'>
        <div className='popover-detail-section'>
          <h4 className='popover-detail-section-title'>许可</h4>
          <div className='popover-detail-tags'>
            {item.license && (
              <span className='popover-detail-tag'>{item.license}</span>
            )}
          </div>
        </div>

        <div className='popover-detail-section'>
          <h4 className='popover-detail-section-title'>技术信息</h4>
          <div className='popover-detail-stats'>
            <div className='popover-detail-stat'>
              <div className='popover-detail-stat-label'>版本</div>
              <div className='popover-detail-stat-value'>{version}</div>
            </div>
            <div className='popover-detail-stat'>
              <div className='popover-detail-stat-label'>加载大小</div>
              <div className='popover-detail-stat-value'>{bundleSize}</div>
            </div>
            <div className='popover-detail-stat'>
              <div className='popover-detail-stat-label'>依赖数量</div>
              <div className='popover-detail-stat-value'>{dependencies.length}</div>
            </div>
          </div>
        </div>

        {dependencies.length > 0 && (
          <div className='popover-detail-section'>
            <h4 className='popover-detail-section-title'>依赖项</h4>
            <div className='popover-detail-dependencies'>
              {dependencies.map((dep, index) => (
                <span key={index} className='popover-detail-dependency'>
                  {dep}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className='popover-detail-section'>
          <h4 className='popover-detail-section-title'>组件示例</h4>
          <div className='popover-detail-image'>
            {item.splash ? (
              <img src={loader.addUrlPrefix(item.splash)} alt={`${displayName}示例`} />
            ) : (
              <div className='image-placeholder'>
                暂无示例图片
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='popover-detail-footer'>
        <Text className='popover-detail-action'>
          点击查看组件库中的组件
        </Text>
      </div>
    </div>
  );
};

export default PopoverDetailContent;