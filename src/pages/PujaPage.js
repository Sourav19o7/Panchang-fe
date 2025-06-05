
// ==================================================
// 2. src/pages/PujaPage.js
// ==================================================
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PropositionGenerator from '../components/puja/PropositionGenerator';
import PujaList from '../components/puja/PujaList';
import PanchangViewer from '../components/puja/PanchangViewer';
import ExperimentalPujas from '../components/puja/ExperimentalPujas';

const PujaPage = () => {
  const { setBreadcrumbs } = useApp();

  React.useEffect(() => {
    setBreadcrumbs([
      { label: 'Dashboard', path: '/' },
      { label: 'Puja Management', path: '/puja' }
    ]);
  }, [setBreadcrumbs]);

  return (
    <div className="page">
      <Routes>
        <Route index element={<PujaList />} />
        <Route path="generate" element={<PropositionGenerator />} />
        <Route path="calendar" element={<PujaList />} />
        <Route path="panchang" element={<PanchangViewer />} />
        <Route path="experimental" element={<ExperimentalPujas />} />
      </Routes>
    </div>
  );
};

export default PujaPage;
