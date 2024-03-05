import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Play from './pages/Play';
import Japanese from './pages/Japanese';
import English from './pages/English';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/play" element={<Play/>} />
        <Route path="/play/japanese" element={<Japanese/>}></Route>
        <Route path="/play/english" element={<English/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
