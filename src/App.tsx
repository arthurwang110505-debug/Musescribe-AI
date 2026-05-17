import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Studio from './pages/Studio';
import Pricing from './pages/Pricing';
import Docs from './pages/Docs';
import Blog from './pages/Blog';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Auth from './pages/Auth';
import Library from './pages/Library';
import Settings from './pages/Settings';
import Discover from './pages/Discover';
import Analytics from './pages/Analytics';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

import DashboardLayout from './components/Layout/DashboardLayout';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen technical-grid flex flex-col text-slate-300 font-sans">
        <Routes>
          {/* Public Landing Pages with Header/Footer */}
          <Route path="/" element={<><div className="p-6 flex flex-col min-h-screen"><Header /><main className="flex-1 flex flex-col overflow-hidden"><Home /></main><Footer /></div></>} />
          <Route path="/pricing" element={<><div className="p-6 flex flex-col min-h-screen"><Header /><main className="flex-1 flex flex-col overflow-hidden"><Pricing /></main><Footer /></div></>} />
          <Route path="/docs" element={<><div className="p-6 flex flex-col min-h-screen"><Header /><main className="flex-1 flex flex-col overflow-hidden"><Docs /></main><Footer /></div></>} />
          <Route path="/blog" element={<><div className="p-6 flex flex-col min-h-screen"><Header /><main className="flex-1 flex flex-col overflow-hidden"><Blog /></main><Footer /></div></>} />
          <Route path="/terms" element={<><div className="p-6 flex flex-col min-h-screen"><Header /><main className="flex-1 flex flex-col overflow-hidden"><Terms /></main><Footer /></div></>} />
          <Route path="/privacy" element={<><div className="p-6 flex flex-col min-h-screen"><Header /><main className="flex-1 flex flex-col overflow-hidden"><Privacy /></main><Footer /></div></>} />
          
          {/* Auth Page - Clean Layout */}
          <Route path="/auth" element={<Auth />} />

          {/* Studio — accessible to guests; export/save require auth */}
          <Route 
            path="/studio" 
            element={
              <DashboardLayout>
                <div className="flex-1 overflow-hidden p-6 flex flex-col">
                  <Studio />
                </div>
              </DashboardLayout>
            } 
          />
          <Route 
            path="/discover" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Discover />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/library" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <div className="flex-1 overflow-y-auto p-12">
                    <Library />
                  </div>
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Analytics />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <div className="flex-1 overflow-y-auto p-6 md:p-12">
                    <Settings />
                  </div>
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Catch-All Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}
