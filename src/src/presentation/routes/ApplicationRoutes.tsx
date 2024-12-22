import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PlayItemListContainer from '../containers/PlayItemListContainer';

const ApplicationRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PlayItemListContainer  />} />
    </Routes>
  );
};

export default ApplicationRoutes;
