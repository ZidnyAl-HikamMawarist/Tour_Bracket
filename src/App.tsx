import { Routes, Route } from 'react-router-dom';
import { TournamentProvider } from './context/TournamentContext';
import AdminLayout from './components/AdminLayout';
import ViewerLayout from './components/ViewerLayout';
import MatchController from './pages/admin/MatchController';
import Settings from './pages/admin/Settings';
import Participants from './pages/admin/Participants';
import Login from './pages/admin/Login';
import Register from './pages/admin/Register';
import LiveViewer from './pages/viewer/LiveViewer';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <TournamentProvider>
      <Routes>
        {/* Public SaaS Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<MatchController />} />
          <Route path="match" element={<MatchController />} />
          <Route path="settings" element={<Settings />} />
          <Route path="participants" element={<Participants />} />
        </Route>

        {/* Public Live Broadcast Viewer Routes */}
        <Route path="/viewer" element={<ViewerLayout />}>
          <Route index element={<LiveViewer />} />
          <Route path=":slug" element={<LiveViewer />} />
        </Route>
      </Routes>
    </TournamentProvider>
  );
}

export default App;
