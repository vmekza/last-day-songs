import Home from './components/Home';
import Search from './components/Search';
import Customize from "./components/Customize";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

const App = () => {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/search' element={<Search />} />
          <Route path='/customize' element={<Customize />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
