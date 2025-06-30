import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import TasksPage from '@/components/pages/TasksPage';
import AnalyticsPage from '@/components/pages/AnalyticsPage';
import SettingsPage from '@/components/pages/SettingsPage';
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-body">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<TasksPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;