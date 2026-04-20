import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import ClosedYears from './pages/Years/ClosedYears';
import YearTopics from './pages/Years/YearTopics';
import Topics from './pages/Topics/Topics'
import TopicYears from './pages/Topics/TopicYears';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/closed-years" element={<ClosedYears />} />
        <Route path="/closed-years/:yearId" element={<YearTopics />} />

        <Route path="/current-year/:yearId" element={<YearTopics />} />

        <Route path="/topics" element={<Topics />} />
        <Route path="/topics/:topicId" element={<TopicYears />} />

        <Route path="/practices/new" element={<div>Formulario</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;