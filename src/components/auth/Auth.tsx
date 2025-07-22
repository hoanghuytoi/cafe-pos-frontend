import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

// Interface định nghĩa props cho component Auth
interface AuthProps {
  onLoginSuccess: (token: string, user: any) => void; // Callback function khi đăng nhập thành công
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  // true = hiển thị form đăng nhập, false = hiển thị form đăng ký
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitchToRegister = () => {
    setIsLogin(false);
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
  };

  /**
   * Hàm xử lý khi đăng ký thành công
   */
  const handleRegisterSuccess = () => {
  };

  return (
    <div>
      {isLogin ? (
        // Hiển thị form đăng nhập
        <Login 
          onSwitchToRegister={handleSwitchToRegister} // Truyền function để chuyển sang đăng ký
          onLoginSuccess={onLoginSuccess} // Truyền callback khi đăng nhập thành công
        />
      ) : (
        // Hiển thị form đăng ký
        <Register 
          onSwitchToLogin={handleSwitchToLogin} // Truyền function để chuyển về đăng nhập
          onRegisterSuccess={handleRegisterSuccess} // Truyền callback khi đăng ký thành công
        />
      )}
    </div>
  );
};

export default Auth; 