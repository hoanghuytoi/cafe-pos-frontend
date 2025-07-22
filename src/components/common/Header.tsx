import React from 'react';
import './Header.css';

interface HeaderProps {
  user: { username: string; role: string };
  onLogout: () => void;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, children }) => {
  return (
    <header className="dashboard-header">
      <div className="header-content">
        <span className="logo">
          <span className="coffee-icon" role="img" aria-label="coffee">☕</span>
          <span className="logo-text">Cafe POS System</span>
        </span>
        <div className="user-info">
          <span>Xin chào, {user.username}</span>
          {children}
          <button className="logout-button" onClick={onLogout}>Đăng xuất</button>
        </div>
      </div>
    </header>
  );
};

export default Header; 