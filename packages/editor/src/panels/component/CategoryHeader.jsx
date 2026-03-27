// components/CategoryHeader.jsx
import React from 'react';

const CategoryHeader = ({ title, count }) => (
  <div className='category-header'>
    <div className='category-header-title'>
      {title}
      <span className='category-header-count'>{count}个</span>
    </div>
  </div>
);

export default CategoryHeader;