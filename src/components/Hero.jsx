import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

import Mascot from './Mascot'
import './Hero.css'

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

const Hero = ({ entered }) => {
  const heroRef = useRef(null)
  const contentRef = useRef(null)
  const mascotRef = useRef(null)
  const floatRef = useRef(null)
  const hintRef = useRef(null)
  const doorRef = useRef(null)
  const doorLeftRef = useRef(null)
  const doorRightRef = useRef(null)
  const galleryRef = useRef(null)
  const frameRef = useRef(null)


  const leftTextRef = useRef(null)
  const rightTextRef = useRef(null)
  const bottomTextRef = useRef(null)
  const eyebrowRef = useRef(null)
  const descRef = useRef(null)

  useEffect(() => {
    if (!entered) return

    let scrollTl

    const floating = gsap.to(floatRef.current, {
      y: -12,
      rotation: 5,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      paused: true,
    })

    const createScrollAnimation = () => {
      const star = mascotRef.current
      const door = doorRef.current

      const getPath = () => {
        const starRect = star.getBoundingClientRect()
        const doorRect = door.getBoundingClientRect()

        const startX = starRect.left + starRect.width / 2
        const startY = starRect.top + starRect.height / 2

        const endX = doorRect.left + doorRect.width / 2
        const endY = doorRect.top - starRect.height / 2 - 12

        const dx = endX - startX
        const dy = endY - startY

        return [
          { x: 0, y: 0 },
          {
            x: dx + Math.min(window.innerWidth * 0.22, 240),
            y: dy * 0.25,
          },
          {
            x: dx + Math.min(window.innerWidth * 0.18, 190),
            y: dy * 0.7,
          },
          { x: dx, y: dy },
        ]
      }

      scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=4500',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,

          onUpdate: (self) => {
            if (self.progress > 0.001) {
              floating.pause()
            } else {
              floating.resume()
            }
          },
        },
      })

      scrollTl
        .to(
          leftTextRef.current,
          {
            x: '-35vw',
            autoAlpha: 0,
            duration: 0.4,
            ease: 'none',
          },
          0
        )
        .to(
          rightTextRef.current,
          {
            x: '35vw',
            autoAlpha: 0,
            duration: 0.4,
            ease: 'none',
          },
          0
        )
        .to(
          [
            eyebrowRef.current,
            bottomTextRef.current,
            descRef.current,
          ],
          {
            y: 65,
            autoAlpha: 0,
            duration: 0.35,
            ease: 'none',
          },
          0
        )
        .to(
          hintRef.current,
          {
            autoAlpha: 0,
            duration: 0.2,
          },
          0
        )
        .to(
          doorRef.current,
          {
            autoAlpha: 1,
            duration: 0.3,
          },
          0.2
        )
        .to(
          mascotRef.current,
          {
            motionPath: {
              path: getPath,
              curviness: 1.5,
            },
            duration: 0.75,
            ease: 'none',
          },
          0.1
        )
        .to(
          mascotRef.current,
          {
            rotation: 360,
            duration: 0.75,
            ease: 'none',
          },
          0.1
        )
        .to(
          mascotRef.current,
          {
            scale: 0.85,
            duration: 0.15,
            ease: 'power2.out',
          },
          0.85
        )
        .to(
          mascotRef.current,
          {
            autoAlpha: 0,
            scale: 0.5,
            duration: 0.25,
            ease: 'none',
          },
          1.05
        )
        .to(
          doorRef.current,
          {
            scale: () => {
              const frame = doorRef.current.querySelector(
                '.hero-door__frame'
              )

              const rect = frame.getBoundingClientRect()

              return Math.max(
                window.innerWidth / rect.width,
                window.innerHeight / rect.height
              ) * 1.15
            },
            x: () => {
              const rect = doorRef.current.getBoundingClientRect()

              return (
                window.innerWidth / 2 -
                (rect.left + rect.width / 2)
              )
            },
            y: () => {
              const frame = doorRef.current.querySelector(
                '.hero-door__frame'
              )

              const rect = frame.getBoundingClientRect()

              return (
                window.innerHeight / 2 -
                (rect.top + rect.height / 2)
              )
            },
            duration: 0.65,
            ease: 'power2.inOut',
          },
          1.25
        )
        .to(
          doorLeftRef.current,
          {
            xPercent: -105,
            duration: 0.55,
            ease: 'power2.inOut',
          },
          1.95
        )
        .to(
          doorRightRef.current,
          {
            xPercent: 105,
            duration: 0.55,
            ease: 'power2.inOut',
          },
          1.95
        )
        // 문이 열린 후 전시실 전체 화면으로 전환
        .to(
          galleryRef.current,
          {
            autoAlpha: 1,
            duration: 0.35,
            ease: 'none',
          },
          2.55
        )

        // 액자가 천장에서 내려옴
        .fromTo(
          frameRef.current,
          {
            y: () => -window.innerHeight * 1.3,
            rotation: -5,
          },
          {
            y: 0,
            rotation: 2,
            duration: 0.75,
            ease: 'back.out(1.4)',
          },
          2.85
        )

        // 내려온 뒤 작은 좌우 흔들림
        .to(
          frameRef.current,
          {
            rotation: -2,
            duration: 0.16,
            ease: 'sine.inOut',
          },
          3.6
        )
        .to(
          frameRef.current,
          {
            rotation: 1,
            duration: 0.14,
            ease: 'sine.inOut',
          },
          3.76
        )
        .to(
          frameRef.current,
          {
            rotation: 0,
            duration: 0.2,
            ease: 'sine.out',
          },
          3.9
        )

        // 작품을 감상할 수 있도록 잠시 유지
        .to({}, { duration: 0.5 })

      ScrollTrigger.refresh()
    }

    const introTl = gsap.timeline({
      onComplete: () => {
        floating.play()
        createScrollAnimation()
      },
    })

    introTl
      .fromTo(
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

    return () => {
      introTl.kill()
      floating.kill()
      scrollTl?.scrollTrigger?.kill()
      scrollTl?.kill()
    }
  }, [entered])

  return (
    <section className="hero" ref={heroRef}>

      <header className="hero-header">
        <span>HYENA'S EXHIBITION</span>
        <span>2026 PORTFOLIO</span>
      </header>

      <div className="hero-content" ref={contentRef}>
        <p className="hero-eyebrow" ref={eyebrowRef}>
          WELCOME TO
        </p>

        <div className="hero-title">
          <div className="hero-title-row">

            <span ref={leftTextRef}>MY</span>

            <div className="hero-mascot" ref={mascotRef}>
              <div className="mascot-float" ref={floatRef}>
                <Mascot />
              </div>
            </div>

            <span ref={rightTextRef}>DIGITAL</span>

          </div>

          <div className="hero-title-bottom" ref={bottomTextRef}>
            EXHIBITION.
          </div>
        </div>

        <p className="hero-desc" ref={descRef}>
          Designing Ideas, Creating Experiences.
        </p>
      </div>

      <div className="hero-door" ref={doorRef}>
        <div className="hero-door__top">
          EXHIBITION HALL
        </div>

        <div className="hero-door__frame">

          <div className="gallery-interior">
            <div className="gallery-interior__wall">
              <div className="gallery-interior__light" />
            </div>
          </div>

          <div
            className="hero-door__left"
            ref={doorLeftRef}
          />

          <div
            className="hero-door__right"
            ref={doorRightRef}
          />

        </div>
      </div>

      <div className="gallery-scene" ref={galleryRef}>

        <div className="gallery-scene__header">
          <span>HYENA'S EXHIBITION</span>
          <span>GALLERY 01 / WEB REDESIGN</span>
        </div>

        <div className="gallery-hanging" ref={frameRef}>

          <div className="gallery-wires" aria-hidden="true">
            <span className="gallery-wire" />
            <span className="gallery-wire" />
          </div>

          <div className="gallery-artwork">
            <div className="gallery-artwork__mat">
              <div className="gallery-artwork__preview">
                <span className="gallery-artwork__category">
                  WEB REDESIGN
                </span>

                <strong>YP FOODS</strong>

                <span className="gallery-artwork__subtitle">
                  영풍 웹사이트 리디자인
                </span>

                <span className="gallery-artwork__placeholder">
                  PROJECT PREVIEW
                </span>
              </div>
            </div>
          </div>

          <div className="gallery-caption">
            <span className="gallery-caption__number">
              EXHIBIT 001
            </span>

            <h2>YP FOODS</h2>

            <p>Website Renewal · UI/UX · Publishing</p>
          </div>

        </div>

        <div className="gallery-scene__footer">
          <span>01 — 09</span>
          <span>SCROLL TO EXPLORE ↓</span>
        </div>

      </div>

      <div className="hero-scroll" ref={hintRef}>
        <span>SCROLL TO ENTER</span>
        <span className="scroll-arrow">↓</span>
      </div>

    </section>
  )
}

export default Hero
