import { Routes, Route, Navigate } from 'react-router-dom';
import { TournamentProvider } from './context/TournamentContext';
import AdminLayout from './components/AdminLayout';
import ViewerLayout from './components/ViewerLayout';
import MatchController from './pages/admin/MatchController';
import Settings from './pages/admin/Settings';
import Participants from './pages/admin/Participants';
import Login from './pages/admin/Login';
import LiveViewer from './pages/viewer/LiveViewer';

function App() {
  return (
    <TournamentProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/match" replace />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="match" element={<MatchController />} />
          <Route path="settings" element={<Settings />} />
          <Route path="participants" element={<Participants />} />
        </Route>

        {/* Viewer Routes */}
        <Route path="/viewer" element={<ViewerLayout />}>
          <Route index element={<LiveViewer />} />
        </Route>
      </Routes>
    </TournamentProvider>
  );
}

export default App;
