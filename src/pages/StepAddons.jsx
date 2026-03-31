import { useState, useEffect } from 'react';
import { getAddons } from '../api.js';

export default function StepAddons({ selected, serviceName, serviceDuration, onSelect, onBack }) {
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chosen, setChosen] = useState(selected || []);

  useEffect(() => {
    getAddons()
      .then(data => setAddons(data.addons || []))
      .catch(() => setAddons([]))
      .finally(() => setLoading(false));
  }, []);

  // 篩選適用此服務的加值項目
  const availableAddons = addons.filter(addon => {
    if (!addon.services || addon.services.length === 0) return true;
    return addon.services.includes(serviceName);
  });

  const toggle = (addon) => {
    setChosen(prev => {
      const exists = prev.find(a => a.id === addon.id);
      return exists ? prev.filter(a => a.id !== addon.id) : [...prev, addon];
    });
  };

  const totalAddonPrice = chosen.reduce((sum, a) => sum + a.price, 0);

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div className="step-addons">
      <h2>加值項目</h2>
      <p className="addon-hint">可複選，不需要可直接下一步（加值統一 +30 分鐘）</p>

      {availableAddons.length === 0 ? (
        <p className="addon-hint">此服務目前沒有可選的加值項目</p>
      ) : (
        <div className="addon-list">
          {availableAddons.map(addon => {
            const isChosen = chosen.some(a => a.id === addon.id);
            return (
              <button
                key={addon.id}
                className={`addon-card${isChosen ? ' selected' : ''}`}
                onClick={() => toggle(addon)}
              >
                <div className="addon-check">
                  <svg viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3" /></svg>
                </div>
                <div className="addon-info">
                  <div className="addon-name">{addon.name}</div>
                  <div className="addon-price">+NT$ {addon.price.toLocaleString()}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {chosen.length > 0 && (
        <div className="addon-summary">
          <span>總時長 {serviceDuration + 30} 分鐘</span>
          <span>加值合計 +NT$ {totalAddonPrice.toLocaleString()}</span>
        </div>
      )}

      <div className="btn-group">
        <button className="btn-primary" onClick={() => onSelect(chosen)}>
          {chosen.length > 0 ? '確認加值，下一步' : '不加值，下一步'}
        </button>
        <button className="btn-back" onClick={onBack}>← 返回</button>
      </div>
    </div>
  );
}
