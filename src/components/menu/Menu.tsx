import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './Menu.css';
import Header from '../common/Header';
import { useNavigate } from 'react-router-dom';

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl: string;
  category: 'cafe' | 'tea' | 'smoothie';
}

interface MenuProps {
  user: any;
}

const Menu: React.FC<MenuProps> = ({ user }) => {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: null as File | null,
    category: 'cafe'
  });
  const [filterCategory, setFilterCategory] = useState<'all' | 'cafe' | 'tea' | 'smoothie'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const isAdmin = user.role === 'admin';

  // Lấy danh sách menu
  const fetchMenus = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/menu', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMenus(res.data.data);
    } catch (err: any) {
      setError('Không thể tải menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // Xử lý input form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Xử lý file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  // Mở form thêm/sửa
  const openForm = (item?: MenuItem) => {
    if (item) {
      setEditItem(item);
      setFormData({
        name: item.name,
        price: item.price.toString(),
        description: item.description || '',
        image: null,
        category: item.category || 'cafe'
      });
    } else {
      setEditItem(null);
      setFormData({ name: '', price: '', description: '', image: null, category: 'cafe' });
    }
    setShowForm(true);
  };

  // Đóng form
  const closeForm = () => {
    setShowForm(false);
    setEditItem(null);
    setFormData({ name: '', price: '', description: '', image: null, category: 'cafe' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Thêm/sửa món
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', String(Number(formData.price)));
      data.append('description', formData.description);
      data.append('category', formData.category);
      if (formData.image) data.append('image', formData.image);
      if (editItem) {
        // Sửa
        await axios.put(`http://localhost:5000/api/menu/${editItem._id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Thêm
        await axios.post('http://localhost:5000/api/menu', data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchMenus();
      closeForm();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Lỗi khi lưu món';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Xóa món
  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa món này?')) return;
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMenus();
    } catch (err: any) {
      setError('Lỗi khi xóa món');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Xóa token khỏi axios headers
    delete axios.defaults.headers.common['Authorization'];
    // Redirect về trang chủ thay vì reload
    window.location.href = '/';
  };

  const filteredMenus = filterCategory === 'all'
    ? menus
    : menus.filter(item => item.category === filterCategory);

  return (
    <>
      <Header user={user} onLogout={handleLogout}>
        <span className="user-role">
          {user.role === 'admin'
            ? 'Quản lý'
            : user.role === 'employee'
            ? 'Nhân viên'
            : 'Khách hàng'}
        </span>
      </Header>
      <div className="menu-container">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          {/* Icon quay lại */}
          <button
            onClick={() => window.location.href = '/'}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 28,
              cursor: 'pointer',
              marginRight: 12
            }}
            title="Quay lại màn hình chính"
          >
            ←
          </button>
          <h2 className="menu-title" style={{ margin: 0, flex: 1 }}>DANH SÁCH MENU</h2>
        </div>
        {/* Nút Đặt bàn cho khách hàng */}
        {user.role !== 'admin' && user.role !== 'employee' && (
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <button
              className="menu-reserve-btn"
              style={{ background: '#4caf50', color: '#fff', padding: '8px 20px', border: 'none', borderRadius: 4, fontSize: 16, cursor: 'pointer' }}
              onClick={() => navigate('/tables')}
            >
              Đặt bàn
            </button>
          </div>
        )}
        {isAdmin && (
          <button className="menu-add-btn" onClick={() => openForm()}>+ Thêm món</button>
        )}
        <div className="menu-filter-category">
          <label>Lọc loại: </label>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value as any)}>
            <option value="all">Tất cả</option>
            <option value="cafe">Cafe</option>
            <option value="tea">Trà</option>
            <option value="smoothie">Sinh tố</option>
          </select>
        </div>
        {loading && <div>Đang tải...</div>}
        {error && <div className="error-message">{error}</div>}
        <div className="menu-list-grid">
          {filteredMenus.map(item => (
            <div className="menu-card" key={item._id}>
              <div className="menu-img-wrapper">
                <img src={item.imageUrl} alt={item.name} className="menu-img" />
              </div>
              <div className="menu-info">
                <h3 className="menu-item-title">{item.name}</h3>
                <p className="menu-item-desc">{item.description}</p>
                <div className="menu-price">{item.price.toLocaleString()} đ</div>
                {isAdmin && (
                  <div className="menu-actions">
                    <button className="menu-edit-btn" onClick={() => openForm(item)}>Sửa</button>
                    <button className="menu-delete-btn" onClick={() => handleDelete(item._id)}>Xóa</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Form thêm/sửa */}
        {showForm && (
          <div className="menu-form-modal">
            <form className="menu-form" onSubmit={handleSubmit}>
              <h3 className="menu-form-title">{editItem ? 'Sửa món' : 'Thêm món mới'}</h3>
              <input
                type="text"
                name="name"
                placeholder="Tên món"
                value={formData.name}
                onChange={handleChange}
                required
                className="menu-form-input"
              />
              <input
                type="number"
                name="price"
                placeholder="Giá món"
                value={formData.price}
                onChange={handleChange}
                required
                min={1000}
                className="menu-form-input"
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="menu-form-input"
              >
                <option value="cafe">Cafe</option>
                <option value="tea">Trà</option>
                <option value="smoothie">Sinh tố</option>
              </select>
              <textarea
                name="description"
                placeholder="Mô tả"
                value={formData.description}
                onChange={handleChange}
                className="menu-form-textarea"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="menu-form-file"
              />
              <div className="menu-form-actions">
                <button type="submit" className="menu-form-save-btn" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</button>
                <button type="button" className="menu-form-cancel-btn" onClick={closeForm}>Hủy</button>
              </div>
              {error && <div className="error-message">{error}</div>}
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Menu; 