import React from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';

// Interface định nghĩa props cho component Dashboard
interface DashboardProps {
  user: any;
  onLogout: () => void;
}

// Interface định nghĩa cấu trúc tính năng
interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  roles: string[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  // Danh sách tất cả các tính năng
  const allFeatures: Feature[] = [
    {
      id: 'employee-management',
      icon: '👥',
      title: 'Quản lý nhân viên',
      description: 'Quản lý thông tin nhân viên và ca làm việc',
      roles: ['admin']
    },
    {
      id: 'shift-management',
      icon: '⏰',
      title: 'Quản lý ca làm',
      description: 'Bắt đầu, chốt ca và xem lịch sử ca làm',
      roles: ['admin', 'employee']
    },
    {
      id: 'menu-management',
      icon: '📋',
      title: 'Quản lý menu',
      description: 'Thêm, sửa, xóa các món trong menu',
      roles: ['admin']
    },
    {
      id: 'create-order',
      icon: '🛒',
      title: 'Tạo đơn hàng',
      description: 'Tạo đơn hàng mới cho khách',
      roles: ['employee']
    },
    {
      id: 'calculate-order',
      icon: '💰',
      title: 'Thanh toán đơn hàng',
      description: 'Thanh toán đơn hàng và thối tiền cho khách',
      roles: ['employee']
    },
    {
      id: 'all-orders',
      icon: '📋',
      title: 'Xem tất cả đơn hàng',
      description: 'Xem và quản lý tất cả đơn hàng trong hệ thống',
      roles: ['admin']
    },
    {
      id: 'reports',
      icon: '📊',
      title: 'Báo cáo',
      description: 'Xem báo cáo doanh thu và tiến độ',
      roles: ['admin']
    },
    {
      id: 'view-menu',
      icon: '📋',
      title: 'Xem menu',
      description: 'Xem danh sách món trong menu',
      roles: ['employee', 'customer']
    },
    {
      id: 'salary-management',
      icon: '💵',
      title: 'Quản lý lương',
      description: 'Tính lương và quản lý thanh toán lương nhân viên',
      roles: ['admin']
    },
    {
      id: 'my-salary',
      icon: '💳',
      title: 'Lương của tôi',
      description: 'Xem thông tin lương và lịch sử thanh toán',
      roles: ['employee']
    },
    {
      id: 'table-management',
      icon: '🪑',
      title: 'Quản lý đơn đặt bàn',
      description: 'Quản lý sơ đồ bàn và trạng thái bàn',
      roles: ['employee', 'admin']
    },
    {
      id: 'table-admin-management',
      icon: '🪑',
      title: 'Quản lý bàn',
      description: 'Thêm, xóa, chỉnh sửa bàn',
      roles: ['admin']
    },
    {
      id: 'book-table',
      icon: '🪑',
      title: 'Đặt bàn',
      description: 'Xem sơ đồ bàn và đặt chỗ trước',
      roles: ['customer']
    },
    {
      id: 'my-reservations',
      icon: '🪑',
      title: 'Đơn đặt bàn của tôi',
      description: 'Xem đơn đặt bàn của tôi',
      roles: ['customer']
    }
  ];

  // Lọc tính năng theo role của user
  const userFeatures = allFeatures.filter(feature => 
    feature.roles.includes(user.role)
  );

  // Debug: Log ra để kiểm tra
  console.log('User role:', user.role);
  console.log('User features:', userFeatures);

  // Lấy tên role hiển thị
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Quản lý';
      case 'employee':
        return 'Nhân viên';
      case 'customer':
        return 'Khách hàng';
      default:
        return role;
    }
  };

  // Lấy thông báo chào mừng dựa trên role
  const getWelcomeMessage = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Chào mừng Quản lý! Bạn có quyền truy cập tất cả tính năng của hệ thống.';
      case 'employee':
        return 'Chào mừng Nhân viên! Hãy bắt đầu ca làm việc của bạn.';
      default:
        return 'Chào mừng bạn đến với hệ thống Cafe POS!';
    }
  };

  return (
    <div className="dashboard-container">
      <Header user={user} onLogout={onLogout}>
        <span className="user-role">{getRoleDisplayName(user.role)}</span>
      </Header>
      <main className="dashboard-main">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h2>🎉 Chào mừng trở lại Cafe POS 🎉</h2>
          <div className="role-description">
            {getWelcomeMessage(user.role)}
          </div>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          {userFeatures.map((feature) => (
            <div
              key={feature.id}
              className="feature-card"
              onClick={
                feature.id === 'menu-management' || feature.id === 'view-menu' || feature.id === 'employee-management' || feature.id === 'shift-management' || feature.id === 'create-order' || feature.id === 'all-orders' || feature.id === 'calculate-order' || feature.id === 'reports' || feature.id === 'salary-management' || feature.id === 'my-salary' || feature.id === 'book-table' || feature.id === 'table-management' || feature.id === 'table-admin-management' || feature.id === 'my-reservations'
                  ? () => navigate(
                      feature.id === 'employee-management' ? '/employees' :
                      feature.id === 'shift-management' ? '/shifts' :
                      feature.id === 'create-order' ? '/orders/new' :
                      feature.id === 'all-orders' ? '/orders' :
                      feature.id === 'calculate-order' ? '/orders/payment' :
                      feature.id === 'reports' ? '/reports' :
                      feature.id === 'salary-management' ? '/salaries' :
                      feature.id === 'my-salary' ? '/my-salary' :
                      feature.id === 'book-table' ? '/tables' :
                      feature.id === 'table-management' ? '/tables' :
                      feature.id === 'table-admin-management' ? '/tables/manage' :
                      feature.id === 'my-reservations' ? '/my-reservations' :
                      '/menu')
                  : undefined
              }
              style={
                feature.id === 'menu-management' || feature.id === 'view-menu' || feature.id === 'employee-management' || feature.id === 'shift-management' || feature.id === 'create-order' || feature.id === 'all-orders' || feature.id === 'calculate-order' || feature.id === 'reports' || feature.id === 'salary-management' || feature.id === 'my-salary' || feature.id === 'book-table' || feature.id === 'table-management' || feature.id === 'table-admin-management' || feature.id === 'my-reservations'
                  ? { cursor: 'pointer' }
                  : {}
              }
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 