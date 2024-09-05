import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatrimoineList from './patrimoineList';
import EditPossession from './editPossession';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PatrimoineList />} />
        <Route path="/editPossession/:libelle" element={<EditPossession />} />
      </Routes>
    </Router>
  );
}

export default App;