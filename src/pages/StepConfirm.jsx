import { useState } from 'react';
import { createBooking } from '../api.js';

export default function StepConfirm({ booking, totalDuration, formStart, onConfirm, onBack }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addonNames = booking.addons.map(a => a.name).join('、');
  const totalPrice = booking.service.price
    + booking.addons.reduce((sum, a) => sum + a.price, 0);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await createBooking({
        displayName: booking.userInfo.name,
        phone: booking.userInfo.phone,
        email: booking.userInfo.email,
        service: booking.service.name,
        duration: totalDuration,
        addons: addonNames,
        date: booking.date,
        time: booking.time,
        notes: booking.userInfo.notes,
        _hp: booking.userInfo._hp || '',
        _t: formStart,
      });
      if (result.success) {
        onConfirm(result);
      } else {
        setError(result.error || '預約失敗，請再試一次');
      }
    } catch {
      setError('網路錯誤，請檢查網路後再試');
    } finally {
      setLoading(false);
    }
  };

  const { service, date, time, userInfo } = booking;

  return (
    <div className="step-confirm">
      <h2>確認預約資料</h2>

      <div className="confirm-card">
        <div className="confirm-row">
          <span className="label">服務項目</span>
          <span className="value">{service.name}</span>
        </div>
        {booking.addons.length > 0 && (
          <div className="confirm-row">
            <span className="label">加值項目</span>
            <span className="value">{addonNames}</span>
          </div>
        )}
        <div className="confirm-row">
          <span className="label">時間長度</span>
          <span className="value">{totalDuration} 分鐘</span>
        </div>
        <div className="confirm-row">
          <span className="label">費用</span>
          <span className="value">NT$ {totalPrice.toLocaleString()}</span>
        </div>

        <div className="confirm-divider" />

        <div className="confirm-row">
          <span className="label">預約日期</span>
          <span className="value">{date}</span>
        </div>
        <div className="confirm-row">
          <span className="label">預約時間</span>
          <span className="value">{time}</span>
        </div>

        <div className="confirm-divider" />

        <div className="confirm-row">
          <span className="label">姓名</span>
          <span className="value">{userInfo.name}</span>
        </div>
        <div className="confirm-row">
          <span className="label">電話</span>
          <span className="value">{userInfo.phone}</span>
        </div>
        {userInfo.email && (
          <div className="confirm-row">
            <span className="label">Email</span>
            <span className="value">{userInfo.email}</span>
          </div>
        )}
        {userInfo.notes && (
          <div className="confirm-row">
            <span className="label">備註</span>
            <span className="value">{userInfo.notes}</span>
          </div>
        )}
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="btn-group">
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? '送出中...' : '確認送出'}
        </button>
        <button className="btn-back" onClick={onBack} disabled={loading}>
          ← 返回修改
        </button>
      </div>
    </div>
  );
}
