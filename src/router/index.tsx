import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../pages/dashboard/DashboardPage';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      {/* OAuth2 콜백 처리 라우트 */}
      <Route path="/auth/callback" element={<div>인증 처리 중...</div>} />
    </Routes>
  );
};

export default AppRouter; 