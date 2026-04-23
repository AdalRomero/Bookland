import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home.tsx';
import Libros from './pages/libros.tsx';
import SignOn from './components/sign_on';
import SignUp from './components/sign_up';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/libros" element={<Libros />} />
        <Route path="/login" element={<SignOn />} />
        <Route path="/registro" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
