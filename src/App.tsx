import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';

const Landing = lazy(() => import('./pages/Landing'));
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));
const Home = lazy(() => import('./pages/modules/Home'));
const Connects = lazy(() => import('./pages/modules/Connects'));
const Chat = lazy(() => import('./pages/modules/Chat'));
const Vault = lazy(() => import('./pages/modules/Vault'));
const Notes = lazy(() => import('./pages/modules/Notes'));
const Maps = lazy(() => import('./pages/modules/Maps'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Spin size="large" />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard/home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="connects" element={<Connects />} />
            <Route path="chat" element={<Chat />} />
            <Route path="vault" element={<Vault />} />
            <Route path="notes" element={<Notes />} />
            <Route path="maps" element={<Maps />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
