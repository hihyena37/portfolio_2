import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './TicketIntro.css'

const TicketIntro = ({ onEnter }) => {
  const ticketRef = useRef(null)
  const bodyRef = useRef(null)
  const stubRef = useRef(null)
  const shadowRef = useRef(null)
  const labelRef = useRef(null)
  const floatTlRef = useRef(null)

  const [hidden, setHidden] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const floatTl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: { ease: 'sine.inOut' },
    })

    floatTl
      .to(ticketRef.current, {
        y: -12,
        rotation: -6,
        duration: 2.2,
      })
      .to(ticketRef.current, {
        y: 8,
        rotation: 6,
        duration: 2.2,
      })

    gsap.to(shadowRef.current, {
      scale: 0.88,
      opacity: 0.14,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })

    floatTlRef.current = floatTl

    return () => {
      floatTl.kill()
    }
  }, [])

  const handleMouseEnter = () => {
    if (!isAnimating) {
      floatTlRef.current?.pause()
    }
  }

  const handleMouseLeave = () => {
    if (!isAnimating) {
      floatTlRef.current?.resume()
    }
  }

  const handleEnter = () => {
    if (isAnimating) return

    setIsAnimating(true)
    floatTlRef.current?.pause()

    const tl = gsap.timeline({
      onStart: () => {
        onEnter?.()
      },
      onComplete: () => {
        setHidden(true)
      },
    })

    tl
      .to(ticketRef.current, {
        rotation: 0,
        y: 0,
        duration: 0.25,
        ease: 'power2.out',
      })
      .to(ticketRef.current, {
        y: 120,
        duration: 0.28,
        ease: 'power2.in',
      })
      .to(
        bodyRef.current,
        {
          x: '-120vw',
          rotation: -18,
          duration: 1.05,
          ease: 'power3.inOut',
        },
        '+=0.02'
      )
      .to(
        stubRef.current,
        {
          x: '120vw',
          rotation: 18,
          duration: 1.05,
          ease: 'power3.inOut',
        },
        '<'
      )
      .to(
        shadowRef.current,
        {
          opacity: 0,
          duration: 0.25,
        },
        '<'
      )
      .to(
        labelRef.current,
        {
          opacity: 0,
          y: 16,
          duration: 0.3,
        },
        '<'
      )
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleEnter()
    }
  }

  if (hidden) return null

  return (
    <section className="ticket-intro">
      <div className="ticket-intro__inner">
        <div className="ticket-shadow" ref={shadowRef} />

        <div
          className="ticket-wrap"
          ref={ticketRef}
          role="button"
          tabIndex={0}
          aria-label="전시 입장하기"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleEnter}
          onKeyDown={handleKeyDown}
        >
          <div className="ticket-part ticket-body" ref={bodyRef}>
            <div className="ticket-cut ticket-cut--top" />
            <div className="ticket-cut ticket-cut--bottom" />

            <div className="ticket-badge">
              <span className="ticket-star">★</span>
            </div>

            <div className="ticket-body__content">
              <p className="ticket-kicker">SEONG HYENA</p>
              <h1 className="ticket-title">PORTFOLIO EXHIBITION</h1>
              <p className="ticket-sub">
                Web Publisher & Design 2026
              </p>

              <div className="ticket-lines">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>

          <div className="ticket-part ticket-stub" ref={stubRef}>
            <div className="ticket-stub__inner">
              <p className="stub-small">EXH / 001</p>
              <div className="stub-bars">
                {Array.from({ length: 10 }).map((_, idx) => (
                  <span key={idx} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          className="enter-label"
          ref={labelRef}
          onClick={handleEnter}
          type="button"
        >
          ENTER EXHIBITION
        </button>
      </div>
    </section>
  )
}

export default TicketIntro
