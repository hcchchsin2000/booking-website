import { useState } from 'react';

export default function StepUserInfo({ userInfo, onChange, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    onChange({ ...userInfo, [field]: value });
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!userInfo.name.trim()) errs.name = '請輸入姓名';
    if (!userInfo.phone.trim()) errs.phone = '請輸入電話';
    else if (!/^[0-9]{9,10}$/.test(userInfo.phone.replace(/[-\s]/g, '')))
      errs.phone = '電話格式不正確（請輸入 09 開頭的手機號碼）';
    if (userInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email))
      errs.email = '電子郵件格式不正確';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  return (
    <div className="step-userinfo">
      <h2>填寫預約資料</h2>

      <div className="form-group">
        <label>姓名 *</label>
        <input
          type="text"
          value={userInfo.name}
          onChange={e => update('name', e.target.value)}
          placeholder="請輸入您的姓名"
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label>手機號碼 *</label>
        <input
          type="tel"
          value={userInfo.phone}
          onChange={e => update('phone', e.target.value)}
          placeholder="0912345678"
        />
        {errors.phone && <span className="field-error">{errors.phone}</span>}
      </div>

      <div className="form-group">
        <label>電子郵件（選填，接收預約確認信）</label>
        <input
          type="email"
          value={userInfo.email}
          onChange={e => update('email', e.target.value)}
          placeholder="example@email.com"
        />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label>備註（選填）</label>
        <textarea
          value={userInfo.notes}
          onChange={e => update('notes', e.target.value)}
          placeholder="特殊需求或說明..."
          rows={3}
        />
      </div>

      {/* 蜜罐欄位 - 真人看不到，機器人會填 */}
      <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <label>Website</label>
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={userInfo._hp || ''}
          onChange={e => update('_hp', e.target.value)}
        />
      </div>

      <div className="btn-group">
        <button className="btn-primary" onClick={() => { if (validate()) onNext(); }}>
          下一步 →
        </button>
        <button className="btn-back" onClick={onBack}>← 返回</button>
      </div>
    </div>
  );
}
