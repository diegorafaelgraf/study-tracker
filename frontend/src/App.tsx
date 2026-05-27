import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Toaster } from 'sonner';

import Home from './pages/Home/Home';
import ClosedYears from './pages/Years/ClosedYears';
import YearTopics from './pages/Years/YearTopics';
import ClosedYearTopics from './pages/Years/ClosedYearTopics';
import Topics from './pages/Topics/Topics'
import TopicYears from './pages/Topics/TopicYears';
import Login from './pages/Auth/Login';
import ChangePassword from './pages/Auth/ChangePassword';
import ProtectedRoute from './components/ProtectedRoutes';
import YearTopicStats from './pages/YearTopics/YearTopicStats';

function App() {
  return (
    <>
      <Toaster position='top-center' richColors expand duration={4000} />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/closed-years" element={<ProtectedRoute><ClosedYears /></ProtectedRoute>} />
          <Route path="/closed-years/:yearId" element={<ProtectedRoute><ClosedYearTopics /></ProtectedRoute>} />
          <Route path="/current-year/:yearId" element={<ProtectedRoute><YearTopics /></ProtectedRoute>} />
          <Route path="/topics" element={<ProtectedRoute><Topics /></ProtectedRoute>} />
          <Route path="/topics/:topicId" element={<ProtectedRoute><TopicYears /></ProtectedRoute>} />
          <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="/year-topic/:yearTopicId" element={<ProtectedRoute><YearTopicStats /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;