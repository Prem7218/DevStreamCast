import React from 'react';

const PrivacySelector = ({ value, onChange }) => {
  return (
    <select className="select cursor-pointer" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="public">🌐 Public</option>
      <option value="connections">👥 Connections Only</option>
      <option value="private">👥 Private</option>
    </select>
  );
};

export default PrivacySelector;
