import { useState } from 'react'

import './App.css'

import Navbarr from './components/navbar'
import Home from './components/home'
import SchemaBuilder from './components/schema'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Navbarr />
  
    <div id="home">
          <Home />
        </div>

    <div id="use-it">
          <SchemaBuilder />
        </div>
    </>
  )
}

export default App
