import React from 'react';

const Sidebar = ({ active, activeSection, changeSection }) => {
  return (
    <div className={`sidebar ${active ? 'active' : ''}`}>
      <div className="logo">MusicApp</div>
      <ul className="nav-links">
        <li 
          className={activeSection === 'home' ? 'active' : ''}
          onClick={() => changeSection('home')}
        >
          Home
        </li>
        <li 
          className={activeSection === 'library' ? 'active' : ''}
          onClick={() => changeSection('library')}
        >
          Your Library
        </li>
      </ul>
    </div>
  );
};

export default Sidebar; 