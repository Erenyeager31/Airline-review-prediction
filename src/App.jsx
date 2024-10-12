// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import GaugePage from './components/GaugePage';
import HomePage from './components/HomePage';
import PredictionForm from './components/PredictionForm';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gauge" element={<GaugePage />} />
        {/* Add a route for predicting sentiment when you have a component ready */}
        <Route path="/predict" element={<PredictionForm/>} />
      </Routes>
    </Router>
  );
}

export default App;
