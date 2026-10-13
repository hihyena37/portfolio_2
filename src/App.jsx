import { useState } from "react"
import Hero from './components/Hero'
import TicketIntro from './components/TicketIntro'
import SparkleCursor from './components/SparkleCursor'

const App = () => {
  const [entered, setEntered] = useState(false)
  const [visit, setVisit] = useState(0)

  const returnToStart = () => {
    setEntered(false)
    setVisit((value) => value + 1)
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'instant' })
      document.querySelector('.ticket-wrap')?.focus({ preventScroll: true })
    })
  }

  return (
    <>
      <div className="wrap" key={visit}>
        <Hero entered={entered} onBackToStart={returnToStart} />
        <TicketIntro setEntered={setEntered} />
      </div>
      <SparkleCursor />
    </>
  )
}

export default App
