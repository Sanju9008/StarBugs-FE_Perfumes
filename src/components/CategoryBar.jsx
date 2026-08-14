import React from 'react';

const categoriesData = [
  {
    id: 'mens',
    label: "Men's",
    icon: '/mens_perfume_icon.jpeg'
  },
  {
    id: 'womens',
    label: "Women's",
    icon: '/womes_perfume_icon.jpeg'
  },
  {
    id: 'luxury',
    label: 'Luxury',
    icon: '/luxury_perfume_icon.jpeg'
  }
];

const CategoryBar = ({ selectedCategoryFilter, onSelectCategory }) => {
  return (
    <div className="category-bar">
      <ul className="category-list">
        {categoriesData.map((cat) => {
          const isActive = selectedCategoryFilter === cat.id;
          return (
            <li
              key={cat.id}
              className={`category-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(isActive ? 'all' : cat.id)}
            >
              <div className="category-icon-wrapper">
                <img src={cat.icon} alt={cat.label} className="category-icon-img" />
              </div>
              <span className="category-label">{cat.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CategoryBar;
