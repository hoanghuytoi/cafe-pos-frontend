import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

// Interface định nghĩa props cho component Register
interface RegisterProps {
  onSwitchToLogin: () => void; // Function để chuyển về form đăng nhập
  onRegisterSuccess: () => void; // Callback khi đăng ký thành công
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin, onRegisterSuccess }) => {
  // State quản lý dữ liệu form
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // State quản lý trạng thái loading khi gọi API
  const [loading, setLoading] = useState(false);
  
  // State quản lý thông báo lỗi
  const [error, setError] = useState('');

  /**
   * Hàm xử lý khi user nhập liệu vào các field
   * Hỗ trợ cả input và select elements
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  /**
   * Hàm xử lý khi user submit form
   * Validation và gọi API đăng ký
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn form reload trang
    
    setLoading(true);
    setError('');

    // Validation: Kiểm tra mật khẩu xác nhận có khớp không
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setLoading(false);
      return;
    }

    try {
      // Tách confirmPassword ra khỏi dữ liệu gửi lên API
      const { confirmPassword, ...registerData } = formData;
      
      // Gọi API đăng ký
      const response = await axios.post('http://localhost:5000/api/auth/register', registerData);
      
      // Kiểm tra nếu đăng ký thành công
      if (response.data.success) {
        // Gọi callback thông báo đăng ký thành công
        onRegisterSuccess();
        
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        
        // Tự động chuyển về form đăng nhập
        onSwitchToLogin();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Đăng ký thất bại';
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
          <p>Đăng ký tài khoản mới</p>
        </div>

        {/* Form đăng ký */}
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

          {/* Field email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email"
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
              placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
              required
              minLength={6}
            />
          </div>

          {/* Field confirm password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          {/* Button submit */}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        {/* Footer với link chuyển về đăng nhập */}
        <div className="auth-footer">
          <p>
            Đã có tài khoản?{' '}
            <button onClick={onSwitchToLogin} className="link-button">
              Đăng nhập
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 