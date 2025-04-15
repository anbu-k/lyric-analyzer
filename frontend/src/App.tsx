import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SampleDetector from './pages/SampleDetector';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/samples" element={<SampleDetector />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;