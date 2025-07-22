import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EmployeeManagement.css';
import Header from '../common/Header';
import { useNavigate } from 'react-router-dom';

interface Employee {
  _id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  baseSalary: number;
  hourlyRate: number;
  commissionRate: number;
  createdAt: string;
}

interface EmployeeManagementProps {
  user: any;
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ user }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    baseSalary: '',
    hourlyRate: '',
    commissionRate: ''
  });

  const navigate = useNavigate();

  // Hàm lấy danh sách nhân viên
  const fetchEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/employees', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(res.data.data);
    } catch (err: any) {
      setError('Không thể tải danh sách nhân viên');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Mở form thêm/sửa nhân viên (nếu có employee thì sửa, nếu không thì thêm)
  const openForm = (employee?: Employee) => {
    if (employee) {
      setEditEmployee(employee);
      setFormData({ 
        username: employee.username, 
        email: employee.email, 
        password: '',
        baseSalary: employee.baseSalary?.toString() || '',
        hourlyRate: employee.hourlyRate?.toString() || '',
        commissionRate: employee.commissionRate?.toString() || ''
      });
    } else {
      setEditEmployee(null);
      setFormData({ 
        username: '', 
        email: '', 
        password: '',
        baseSalary: '',
        hourlyRate: '',
        commissionRate: ''
      });
    }
    setShowForm(true);
  };

  // Đóng form thêm/sửa nhân viên
  const closeForm = () => {
    setShowForm(false);
    setEditEmployee(null);
    setFormData({ 
      username: '', 
      email: '', 
      password: '',
      baseSalary: '',
      hourlyRate: '',
      commissionRate: ''
    });
  };

  // Hàm xử lý khi thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Hàm xử lý khi thêm/sửa nhân viên
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const submitData = {
        ...formData,
        baseSalary: Number(formData.baseSalary) || 0,
        hourlyRate: Number(formData.hourlyRate) || 0,
        commissionRate: Number(formData.commissionRate) || 0
      };
      
      if (editEmployee) {
        // Sửa nhân viên
        await axios.put(`http://localhost:5000/api/employees/${editEmployee._id}`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Thêm nhân viên
        await axios.post('http://localhost:5000/api/employees', submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchEmployees();
      closeForm();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi lưu nhân viên');
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi xóa nhân viên
  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa nhân viên này?')) return;
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEmployees();
    } catch (err: any) {
      setError('Lỗi khi xóa nhân viên');
    } finally {
      setLoading(false);
    }
  };

  // Hàm định dạng số tiền
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' ₫';
  };

  // Hàm xử lý khi đăng xuất
  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    window.location.href = '/';
  };

  return (
    <>
              <Header user={user} onLogout={onLogout}>
        <span className="user-role">{user.role === 'admin' ? 'Quản lý' : user.role}</span>
      </Header>
      <div className="employee-container">
        <div className="employee-header">
          <button
                  className="all-orders-back-btn"
                  onClick={() => navigate('/')}
                  title="Quay lại Dashboard"
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 28,
                    cursor: 'pointer',
                    marginRight: 12
                  }}
                >
                  ←
              </button>
        <span className="employee-title">QUẢN LÝ NHÂN VIÊN</span>
        <button className="employee-add-btn" onClick={() => openForm()}>+ Thêm nhân viên</button>
      </div>
        {loading && <div>Đang tải...</div>}
        {error && <div className="error-message">{error}</div>}
        <table className="employee-table">
          <thead>
            <tr>
              <th>Tên đăng nhập</th>
              <th>Email</th>
              <th>Lương cơ bản</th>
              <th>Lương/giờ</th>
              <th>Hoa hồng (%)</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp._id}>
                <td>{emp.username}</td>
                <td>{emp.email}</td>
                <td>{formatCurrency(emp.baseSalary || 0)}</td>
                <td>{formatCurrency(emp.hourlyRate || 0)}</td>
                <td>{emp.commissionRate || 0}%</td>
                <td>{new Date(emp.createdAt).toLocaleString()}</td>
                <td className="employee-actions">
                  <button className="edit-btn" onClick={() => openForm(emp)}>Sửa</button>
                  <button className="delete-btn" onClick={() => handleDelete(emp._id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Form thêm/sửa */}
        {showForm && (
          <div className="employee-form-modal">
            <form className="employee-form" onSubmit={handleSubmit}>
              <div className="employee-form-title">{editEmployee ? 'Sửa nhân viên' : 'Thêm nhân viên'}</div>
              <div className="employee-form-group">
                <label>Tên đăng nhập:</label>
                <input className="employee-form-input" type="text" name="username" value={formData.username} onChange={handleChange} required />
              </div>
              <div className="employee-form-group">
                <label>Email:</label>
                <input className="employee-form-input" type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="employee-form-group">
                <label>Mật khẩu{editEmployee ? ' (để trống nếu không đổi)' : ''}:</label>
                <input className="employee-form-input" type="password" name="password" value={formData.password} onChange={handleChange} minLength={editEmployee ? 0 : 6} />
              </div>
              <div className="employee-form-group">
                <label>Lương cơ bản (₫):</label>
                <input className="employee-form-input" type="number" name="baseSalary" value={formData.baseSalary} onChange={handleChange} min="0" />
              </div>
              <div className="employee-form-group">
                <label>Lương theo giờ (₫/h):</label>
                <input className="employee-form-input" type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleChange} min="0" />
              </div>
              <div className="employee-form-group">
                <label>Tỷ lệ hoa hồng (%):</label>
                <input className="employee-form-input" type="number" name="commissionRate" value={formData.commissionRate} onChange={handleChange} min="0" max="100" step="0.1" />
              </div>
              <div className="employee-form-actions">
                <button type="submit" className="employee-form-save-btn" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</button>
                <button type="button" className="employee-form-cancel-btn" onClick={closeForm}>Hủy</button>
              </div>
              {error && <div className="error-message">{error}</div>}
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default EmployeeManagement; 