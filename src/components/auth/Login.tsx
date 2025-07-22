import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

// Interface định nghĩa props cho component Login
interface LoginProps {
  onSwitchToRegister: () => void; // Function để chuyển sang form đăng ký
  onLoginSuccess: (token: string, user: any) => void; // Callback khi đăng nhập thành công
}

const Login: React.FC<LoginProps> = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '' 
  });
  
  const [loading, setLoading] = useState(false);
  
  const [error, setError] = useState('');

  /**
   * Hàm xử lý khi user nhập liệu vào các field
   * Cập nhật state formData với giá trị mới
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  /**
   * Hàm xử lý khi user submit form
   * Gọi API đăng nhập và xử lý kết quả
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn form reload trang
    
    setLoading(true);
    setError('');

    try {
      // Gọi API đăng nhập
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // Kiểm tra nếu đăng nhập thành công
      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Lưu token và user info vào localStorage để duy trì session
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Gọi callback để thông báo đăng nhập thành công
        onLoginSuccess(token, user);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header của form */}
        <div className="auth-header">
          <h2>☕ Cafe POS</h2>
          <p>Đăng nhập vào hệ thống</p>
        </div>

        {/* Form đăng nhập */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Field username */}
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>

          {/* Field password */}
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          {/* Hiển thị error message nếu có */}
          {error && <div className="error-message">{error}</div>}

          {/* Button submit */}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        {/* Footer với link chuyển sang đăng ký */}
        <div className="auth-footer">
          <p>
            Chưa có tài khoản?{' '}
            <button onClick={onSwitchToRegister} className="link-button">
              Đăng ký ngay
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 