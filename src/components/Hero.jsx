import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './Hero.css'

const Hero = ({ entered }) => {
  const heroRef = useRef(null)
  const eyebrowRef = useRef(null)
  const titleRef = useRef(null)
  const descRef = useRef(null)
  const hintRef = useRef(null)
  const mascotRef = useRef(null)

  useEffect(() => {
    if (!entered) return

    const tl = gsap.timeline()

    tl
      .fromTo(
        heroRef.current,
        {
          autoAlpha: 0,
          scale: 1.08,
        },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power2.out',
        }
      )
      .fromTo(
        eyebrowRef.current,
        {
          autoAlpha: 0,
          y: 18,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
        },
        '-=0.55'
      )
      .fromTo(
        titleRef.current,
        {
          autoAlpha: 0,
          y: 30,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          ease: 'power3.out',
        },
        '-=0.2'
      )
      .fromTo(
        descRef.current,
        {
          autoAlpha: 0,
          y: 18,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
        },
        '-=0.35'
      )
      .fromTo(
        hintRef.current,
        {
          autoAlpha: 0,
          y: 14,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
        },
        '-=0.2'
      )
      .fromTo(
        mascotRef.current,
        {
          autoAlpha: 0,
          y: 30,
          scale: 0.94,
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: 'back.out(1.6)',
        },
        '-=0.3'
      )

    return () => tl.kill()
  }, [entered])

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-bg-glow hero-bg-glow--left" />
      <div className="hero-bg-glow hero-bg-glow--right" />

      <div className="hero-inner">
        <div className="hero-copy">
          <p className="hero-eyebrow" ref={eyebrowRef}>
            ADMIT ONE / DIGITAL EXHIBITION
          </p>

          <h2 className="hero-title" ref={titleRef}>
            WELCOME TO
            <br />
            MY EXHIBITION.
          </h2>

          <p className="hero-desc" ref={descRef}>
            Explore the works, discover the process,
            <br />
            and step into my digital gallery.
          </p>

          <p className="hero-hint" ref={hintRef}>
            SCROLL TO EXPLORE
          </p>
        </div>

        <div className="hero-mascot" ref={mascotRef}>
          <div className="mascot-card">
            <div className="mascot-face">
              <span className="eye" />
              <span className="eye" />
            </div>
            <p className="mascot-label">MASCOT</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
