import React from 'react';

const CategoryBar = ({ selectedCategoryFilter, onSelectCategory }) => {
  return (
    <div className="category-bar">
      <ul className="category-list">
        <li 
          className={`category-item ${selectedCategoryFilter === 'all' ? 'active' : ''}`}
          onClick={() => onSelectCategory('all')}
        >
          All Perfumes
        </li>
        <li 
          className={`category-item ${selectedCategoryFilter === 'mens' ? 'active' : ''}`}
          onClick={() => onSelectCategory('mens')}
        >
          Men's Perfumes
        </li>
        <li 
          className={`category-item ${selectedCategoryFilter === 'womens' ? 'active' : ''}`}
          onClick={() => onSelectCategory('womens')}
        >
          Women's Perfumes
        </li>
        <li 
          className={`category-item ${selectedCategoryFilter === 'luxury' ? 'active' : ''}`}
          onClick={() => onSelectCategory('luxury')}
        >
          Luxury Perfumes
        </li>
      </ul>
    </div>
  );
};

export default CategoryBar;
