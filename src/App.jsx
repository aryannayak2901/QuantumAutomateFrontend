import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { TestApi } from './pages/indexPages'
import { HomePage } from './pages'
import AOS from 'aos';
import 'aos/dist/aos.css';


AOS.init({
  duration: 800, // Animation duration
  offset: 200,   // Offset before triggering
  easing: 'ease-in-out',
});


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <TestApi />? */}
      <HomePage />
    </>
  )
}

export default App
