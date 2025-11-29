
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CurrentAffairs from './pages/CurrentAffairs';
import Recruitments from './pages/Recruitments';
import Quiz from './pages/Quiz';
import StudyBot from './pages/StudyBot';
import StudyPlan from './pages/StudyPlan';
import PYQ from './pages/PYQ';
import Login from './pages/Login';
import Subscription from './pages/Subscription';
import { LoadingSpinner } from './components/Loading';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner text="Initializing AcePrep..." />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/current-affairs" element={<CurrentAffairs />} />
          <Route path="/recruitments" element={<Recruitments />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/study-plan" element={<StudyPlan />} />
          <Route path="/pyq" element={<PYQ />} />
          <Route path="/study-ai" element={<StudyBot />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
