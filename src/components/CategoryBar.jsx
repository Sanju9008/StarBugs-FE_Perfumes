import React from 'react';

const CategoryBar = ({ categories, selectedCategoryId, onSelectCategory }) => {
  return (
    <div className="category-bar">
      <ul className="category-list">
        <li 
          className={`category-item ${selectedCategoryId === null ? 'active' : ''}`}
          onClick={() => onSelectCategory(null)}
        >
          All Perfumes
        </li>
        {categories.map((cat) => (
          <li 
            key={cat.categoryId} 
            className={`category-item ${selectedCategoryId === cat.categoryId ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.categoryId)}
          >
            {cat.categoryName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryBar;
