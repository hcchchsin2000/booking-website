export default function StepComplete({ bookingResult, booking }) {
  const hasEmail = !!booking.userInfo.email;
  const addonNames = booking.addons.map(a => a.name).join('、');

  return (
    <div className="step-complete">
      <div className="success-icon">✅</div>
      <h2>預約成功！</h2>
      <p>{hasEmail ? '確認信已寄送至您的信箱' : '預約已完成，請截圖保存以下資訊'}</p>

      <div className="result-card">
        <div className="result-row">
          <span className="label">預約編號</span>
          <span className="value booking-id">{bookingResult?.bookingId}</span>
        </div>
        <div className="result-row">
          <span className="label">服務項目</span>
          <span className="value">{booking.service.name}</span>
        </div>
        {addonNames && (
          <div className="result-row">
            <span className="label">加值項目</span>
            <span className="value">{addonNames}</span>
          </div>
        )}
        <div className="result-row">
          <span className="label">日期</span>
          <span className="value">{booking.date}</span>
        </div>
        <div className="result-row">
          <span className="label">時間</span>
          <span className="value">{booking.time}</span>
        </div>
        <div className="result-row">
          <span className="label">姓名</span>
          <span className="value">{booking.userInfo.name}</span>
        </div>
      </div>

      <p className="reminder-text">
        預約前一天將以簡訊或電話提醒您，如需取消或更改請提早告知。
      </p>
    </div>
  );
}
