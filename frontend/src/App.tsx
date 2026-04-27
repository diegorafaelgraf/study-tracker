import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import ClosedYears from './pages/Years/ClosedYears';
import YearTopics from './pages/Years/YearTopics';
import ClosedYearTopics from './pages/Years/ClosedYearTopics';
import AddTopicToYear from './pages/Years/AddTopicToYear';
import Topics from './pages/Topics/Topics'
import TopicYears from './pages/Topics/TopicYears';
import CreateTopic from './pages/Topics/CreateTopic';
import NewPractice from './pages/Practices/NewPractice';
import CreateYear from './pages/Years/CreateYear';
import Login from './pages/Auth/Login';
import ChangePassword from './pages/Auth/ChangePassword';
import ProtectedRoute from './components/ProtectedRoutes';
import AdminRoute from './components/AdminRoutes';
import CreateUser from './pages/Admin/CreateUser';
// import Logout from './pages/Auth/Logout';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN PAGE */}
        <Route path="/login" element={<Login />} />

        {/* USERS PAGES */}
        {/* Home Page */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        {/* Closed Years Pages */}
        <Route path="/closed-years" element={<ProtectedRoute><ClosedYears /></ProtectedRoute>} />
        <Route path="/closed-years/:yearId" element={<ProtectedRoute><ClosedYearTopics /></ProtectedRoute>} />
        {/* Current Year Page */}
        <Route path="/current-year/:yearId" element={<ProtectedRoute><YearTopics /></ProtectedRoute>} />
        <Route path="/years/:yearId/add-topic" element={<ProtectedRoute><AddTopicToYear /></ProtectedRoute>} />
        {/* Topics Pages */}
        <Route path="/topics" element={<ProtectedRoute><Topics /></ProtectedRoute>} />
        <Route path="/topics/:topicId" element={<ProtectedRoute><TopicYears /></ProtectedRoute>} />
        <Route path="/topics/create" element={<ProtectedRoute><CreateTopic /></ProtectedRoute>} />
        {/* Practices Pages */}
        <Route path="/practices/new" element={<ProtectedRoute><NewPractice /></ProtectedRoute>} />
        {/* Year Pages */}
        <Route path="/years" element={<ProtectedRoute><CreateYear /></ProtectedRoute>} />
        {/* Change Password Page */}
        <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

        {/* ADMIN PAGES */}
        {/* User Pages */}
        <Route path="/admin/users" element={<AdminRoute><CreateUser /></AdminRoute>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;