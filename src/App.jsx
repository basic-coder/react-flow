
import './App.css';
import 'reactflow/dist/style.css'
import { useState } from 'react';
import {HiBars3BottomLeft} from 'react-icons/hi2'
import {AiOutlineClose} from 'react-icons/ai'
import Queryboard from './pages/Queryboard/Queryboard';
import { Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import {BsSun,BsMoon} from 'react-icons/bs'


function App() {

  const [navToggle, setNavToggle] = useState(false)
  const [theme, setTheme] = useState(false)
  const themeToggler = () =>{
    setTheme(!theme)
    document.body.classList.toggle("active");
  }

  return (
    <>
    <div className="nav"><span onClick={themeToggler}> { theme ? <BsMoon /> : <BsSun /> }</span> <HiBars3BottomLeft onClick={() => setNavToggle(true)} /> </div>
    <div className='main-container'>
      <div className={`left-container ${navToggle && 'active'}`}>
        <div className="logo">
          <span>Flow <div className='toggle' onClick={themeToggler}> { theme ? <BsMoon /> : <BsSun /> }</div> </span><span><AiOutlineClose onClick={() => setNavToggle(false)} /></span>
        </div>

        <ul className='nav-list'>
            <Link className="nav-item" to="/" onClick={() => setNavToggle(false)}>Home</Link>     
            <Link className="nav-item" to="/query" onClick={() => setNavToggle(false)}>Flow Chart</Link>     
        </ul>
      </div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/query' element={<Queryboard />} />
      </Routes>
    </div>
    </>
  )
}

export default App