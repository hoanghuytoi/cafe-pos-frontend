import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Auth from './components/auth/Auth';
import Dashboard from './components/dashboard/Dashboard';
import Menu from './components/menu/Menu';
import Footer from './components/common/Footer';
import EmployeeManagement from './components/employee/EmployeeManagement';
import ShiftManagement from './components/shift/ShiftManagement';
import OrderCreate from './components/order/OrderCreate';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './styles/global.css';
import AllOrders from './components/order/AllOrders';
import OrderPayment from './components/order/OrderPayment';
import Report from './components/report/Report';
import SalaryManagement from './components/salary/SalaryManagement';
import MySalary from './components/salary/MySalary';
import TableMap from './components/table/TableMap';
import ReservedTableList from './components/table/ReservedTableList';
import TableManagement from './components/table/TableManagement';
import MyReservations from './components/table/MyReservations';

// Interface định nghĩa cấu trúc dữ liệu User
interface User {
  id: string; 
  username: string; 
  email: string;   
  role: string; 
}

function App() {
  // State quản lý trạng thái đăng nhập
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // State lưu thông tin user đã đăng nhập
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate(); // Gọi hook này luôn ở đầu
 
  useEffect(() => {
    // Lấy token và user data từ localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    // Nếu có token và user data
    if (token && userData) {
      try {
        // Parse user data từ JSON string
        const parsedUser = JSON.parse(userData);
        
        // Cập nhật state
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        // Nếu user data không hợp lệ, xóa khỏi localStorage
        console.error('Invalid user data in localStorage:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLoginSuccess = (token: string, userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  /**
   * Function xử lý đăng xuất
   * Xóa token và user info khỏi localStorage
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  // useEffect theo dõi isAuthenticated để chuyển về login khi logout
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Routes>
        {/* Route đăng nhập */}
        <Route path="/login" element={
          isAuthenticated && user ? <Navigate to="/" /> : <Auth onLoginSuccess={handleLoginSuccess} />
        } />
        {/* Các route yêu cầu đăng nhập */}
        {isAuthenticated && user ? (
          <>
            <Route path="/" element={<Dashboard user={user} onLogout={handleLogout} />} />
            <Route path="/menu" element={<Menu user={user} />} />
            {user.role === 'admin' && (
              <Route path="/employees" element={<EmployeeManagement user={user} />} />
            )}
            <Route path="/shifts" element={<ShiftManagement user={user} onLogout={handleLogout} />} />
            <Route path="/orders/new" element={<OrderCreate user={user} />} />
            <Route path="/orders" element={<AllOrders user={user} onLogout={handleLogout} />} />
            <Route path="/orders/payment" element={<OrderPayment user={user} />} />
            <Route path="/reports" element={<Report user={user} />} />
            {user.role === 'admin' && (
              <Route path="/salaries" element={<SalaryManagement user={user} />} />
            )}
            <Route path="/my-salary" element={<MySalary user={user} />} />
            {user.role === 'customer' && (
              <Route path="/tables" element={<TableMap user={user} onLogout={handleLogout} />} />
            )}
            {user.role === 'customer' && (
              <Route path="/my-reservations" element={<MyReservations user={user} onLogout={handleLogout} />} />
            )}
            {(user.role === 'employee' || user.role === 'admin') && (
              <Route path="/tables" element={<ReservedTableList user={user} onLogout={handleLogout} />} />
            )}
            {user.role === 'admin' && (
              <Route path="/tables/manage" element={<TableManagement />} />
            )}
            {/* Route không khớp sẽ về dashboard */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          // Nếu chưa đăng nhập, mọi route khác đều chuyển về /login
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
      {isAuthenticated && user && <Footer />}
    </div>
  );
}

export default App;
