import { useState } from "react"
import Hero from './components/Hero'
import TicketIntro from './components/TicketIntro'

const App = () => {
  const [entered, setEntered] = useState(false)

  return (
    <div className="wrap">
      <Hero entered={entered} />
      <TicketIntro setEntered={setEntered} />
    </div>
  )
}

export default App
