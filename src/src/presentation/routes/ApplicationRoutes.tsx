import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HelloWorld from '../components/HelloWorld';

const ApplicationRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HelloWorld />} />
    </Routes>
  );
};

export default ApplicationRoutes;
