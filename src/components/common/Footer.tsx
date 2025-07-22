import React from 'react';
import './Footer.css';

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-section">
        <h4>LIÊN HỆ</h4>
        <ul style={{lineHeight: "2.1", marginLeft: 25}}>
          <li>
            <span role="img" aria-label="email" style={{marginRight: 8}}>📧</span>
            Email: support@cafepos.com
          </li>
          <li>
            <span role="img" aria-label="hotline" style={{marginRight: 8}}>📞</span>
            Hotline: 0985484725
          </li>
          <li>
            <span role="img" aria-label="address" style={{marginRight: 8}}>📍</span>
            Địa chỉ: 01 Đường 48, Phước Long B, Thủ Đức, Hồ Chí Minh, Việt Nam
          </li>
          <li>
            <span role="img" aria-label="clock" style={{marginRight: 8}}>⏰</span>
            Giờ làm việc: 7:00 - 22:00 (T2 - CN)
          </li>
        </ul>
      </div>
      <div className="footer-section social">
        <h4>KẾT NỐI</h4>
        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook">🌐</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram">📸</a>
          <a href="mailto:support@cafepos.com" title="Email">✉️</a>
        </div>
      </div>
      <div className="footer-section footer-map">
        <h4>BẢN ĐỒ</h4>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.0390662178597!2d106.7787771!3d10.808319899999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752779281a9f39%3A0xfd68fff2c80582d4!2sSOLAR%20CAFE!5e0!3m2!1svi!2s!4v1753079436765!5m2!1svi!2s"
          width="100%"
          height="140"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Bản đồ quán cafe"
        ></iframe>
      </div>
    </div>
    <div className="footer-bottom">
      © {new Date().getFullYear()} Cafe POS System. All rights reserved.
    </div>
  </footer>
);

export default Footer; 