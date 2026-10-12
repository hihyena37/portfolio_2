import { useState } from "react"
import Hero from './components/Hero'
import TiketIntro from './components/TicketIntro'
import './index.css'

const App = () => {
  let [entered, setEntered] = useState(false)

  return (
    <div className="wrap">
      <Hero entered={entered} />
      <TiketIntro setEntered={setEntered}/>
    </div>
  )
}

export default App
