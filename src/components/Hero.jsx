import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Mascot from './Mascot'
import './Hero.css'

const Hero = ({ entered }) => {
  const heroRef = useRef(null)
  const contentRef = useRef(null)
  const mascotRef = useRef(null)
  const floatRef = useRef(null)
  const hintRef = useRef(null)

  useEffect(() => {
    if (!entered) return

    const tl = gsap.timeline()

    tl.fromTo(
      heroRef.current,
      {
        autoAlpha: 0,
        scale: 1.06,
      },
      {
        autoAlpha: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power2.out',
      }
    )

    .fromTo(
      contentRef.current,
      {
        autoAlpha: 0,
        y: 40,
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      },
      '-=0.6'
    )

    .fromTo(
      mascotRef.current,
      {
        autoAlpha: 0,
        scale: 0.5,
        rotation: -20,
      },
      {
        autoAlpha: 1,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: 'back.out(1.5)',
      },
      '-=0.4'
    )

    .fromTo(
      hintRef.current,
      {
        autoAlpha: 0,
        y: 20,
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
      },
      '-=0.3'
    )

    const floating = gsap.to(floatRef.current, {
      y: -12,
      rotation: 5,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      paused: true,
    })

    tl.eventCallback('onComplete', () => {
      floating.play()
    })

    return () => {
      tl.kill()
      floating.kill()
    }
  }, [entered])

  return (
    <section className="hero" ref={heroRef}>
      <header className="hero-header">
        <span>HYENA'S EXHIBITION</span>
        <span>2026 PORTFOLIO</span>
      </header>

      <div className="hero-content" ref={contentRef}>
        <p className="hero-eyebrow">
          WELCOME TO
        </p>

        <div className="hero-title">
          <div className="hero-title-row">
            <span>MY</span>

            <div className="hero-mascot" ref={mascotRef}>
              <div className="mascot-float" ref={floatRef}>
                <Mascot />
              </div>
            </div>

            <span>DIGITAL</span>
          </div>

          <div className="hero-title-bottom">
            EXHIBITION.
          </div>
        </div>

        <p className="hero-desc">
          Designing Ideas, Creating Experiences.
        </p>
      </div>

      <div className="hero-scroll" ref={hintRef}>
        <span>SCROLL TO ENTER</span>
        <span className="scroll-arrow">↓</span>
      </div>
    </section>
  )
}

export default Hero