import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

import Mascot from './Mascot'
import ProjectStory from './ProjectStory'
import { galleryProjects } from '../data/galleryProjects'
import './Hero.css'

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

const Hero = ({ entered }) => {
  const [storyOpen, setStoryOpen] = useState(false)
  const [activeProject, setActiveProject] = useState(0)
  const [transitionTarget, setTransitionTarget] = useState(null)
  const [exhibitionEnded, setExhibitionEnded] = useState(false)
  const endingTitleRef = useRef(null)
  const [galleryReady, setGalleryReady] = useState(false)
  const [autoPaused, setAutoPaused] = useState(false)
  const [artworkHovered, setArtworkHovered] = useState(false)
  const [artworkFocused, setArtworkFocused] = useState(false)
  const swipeRef = useRef(null)
  const suppressClickRef = useRef(false)
  const project = galleryProjects[activeProject]
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
    if (exhibitionEnded) endingTitleRef.current?.focus({ preventScroll: true })
  }, [exhibitionEnded])

  useEffect(() => {
    if (!entered) return
    // Prepare lightweight previews during the entrance animation.
    const previews = galleryProjects.map((item) => {
      const image = new Image()
      image.decoding = 'async'
      image.src = import.meta.env.BASE_URL + item.preview
      image.decode().catch(() => {})
      return image
    })
    return () => previews.forEach((image) => { image.src = '' })
  }, [entered])

  useEffect(() => {
    if (!entered) return

    let scrollTl
    let galleryActive = false
    let resizing = false
    let resizeTimer
    let savedProgress = 0

    const handleResize = () => {
      if (!resizing) savedProgress = scrollTl?.totalProgress() ?? 0
      resizing = true
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        ScrollTrigger.refresh()
        resizing = false
      }, 250)
    }
    window.addEventListener('resize', handleResize)

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
        onUpdate: function () {
          // Refresh temporarily rewinds the timeline while measuring the layout.
          // Only publish the settled state, otherwise React can leave the gallery inert.
          if (!ScrollTrigger.isRefreshing && !resizing) {
            galleryActive = this.time() >= 4.09
            setGalleryReady(galleryActive)
          }
        },
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=3000',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            // Restore the actual scroll position immediately after a resize,
            // without waiting for another scroll event to finish the scrub.
            self.getTween()?.progress(1)
            if (resizing && galleryActive) {
              self.scroll(self.start + (self.end - self.start) * savedProgress)
              self.animation.totalProgress(savedProgress)
            } else {
              self.animation.totalProgress(self.progress)
              galleryActive = self.animation.time() >= 4.09
              setGalleryReady(galleryActive)
            }
          },

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

        .to({}, { duration: 0.3 })

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
      window.removeEventListener('resize', handleResize)
      window.clearTimeout(resizeTimer)
      introTl.kill()
      floating.kill()
      scrollTl?.scrollTrigger?.kill()
      scrollTl?.kill()
    }
  }, [entered])

  const selectProject = (index) => {
    if (!galleryReady || transitionTarget !== null || index < 0 || index >= galleryProjects.length || index === activeProject) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActiveProject(index)
    } else {
      setTransitionTarget(index)
    }
    setArtworkHovered(false)
    setArtworkFocused(false)
  }

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

      <div className="gallery-scene" ref={galleryRef} inert={!galleryReady}
        role="region" aria-label="작품 전시 슬라이드"
        onKeyDown={(event) => {
          if (exhibitionEnded) return
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault()
            if (event.key === 'ArrowRight' && activeProject === galleryProjects.length - 1 && transitionTarget === null) {
              setExhibitionEnded(true)
              return
            }
            selectProject(activeProject + (event.key === 'ArrowRight' ? 1 : -1))
          }
        }}>

        <div className="gallery-scene__header">
          <span>HYENA'S EXHIBITION</span>
          <span>{exhibitionEnded ? 'END OF EXHIBITION' : `GALLERY ${project.number} / ${project.category}`}</span>
        </div>

        <div className="gallery-hanging" ref={frameRef}
          style={exhibitionEnded ? { display: 'none' } : undefined}
          onFocusCapture={() => setArtworkFocused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setArtworkFocused(false)
          }}
          onPointerDown={(event) => {
            suppressClickRef.current = false
            if (event.pointerType === 'touch') swipeRef.current = { x: event.clientX, y: event.clientY }
          }}
          onPointerUp={(event) => {
            const start = swipeRef.current
            swipeRef.current = null
            if (!start) return
            const dx = event.clientX - start.x
            const dy = event.clientY - start.y
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) {
              suppressClickRef.current = true
              selectProject(activeProject + (dx < 0 ? 1 : -1))
            }
          }}
          onPointerCancel={() => { swipeRef.current = null }}
          onClickCapture={(event) => {
            if (suppressClickRef.current) {
              event.preventDefault()
              event.stopPropagation()
              suppressClickRef.current = false
            }
          }}>
          {[0, 1].map((offset) => {
            if (exhibitionEnded || (offset === 1 && transitionTarget === null && activeProject === galleryProjects.length - 1)) return null
            const manual = transitionTarget !== null
            const project = galleryProjects[offset === 0 ? activeProject : (transitionTarget ?? (activeProject + 1) % galleryProjects.length)]
            const projectLink = project.link.startsWith('https://')
              ? project.link : import.meta.env.BASE_URL + project.link
            return <div className={`gallery-slide${offset ? ' gallery-slide--incoming' : ''}${manual ? ' gallery-slide--manual' : ''}${manual && transitionTarget < activeProject ? ' gallery-slide--reverse' : ''}`}
            key={`${activeProject}-${transitionTarget}-${offset}`}
            inert={offset === 1}
            aria-hidden={offset === 1 ? true : undefined}
            style={{ animationPlayState: !galleryReady || storyOpen || (!manual && (autoPaused || artworkHovered || artworkFocused)) ? 'paused' : 'running' }}
            onAnimationEnd={(event) => {
              if (offset === 0 && event.target === event.currentTarget) {
                if (transitionTarget === null && activeProject === galleryProjects.length - 1) {
                  setExhibitionEnded(true)
                } else {
                  setActiveProject((index) => transitionTarget ?? index + 1)
                }
                setTransitionTarget(null)
              }
            }}>
            <div className="gallery-lighting" aria-hidden="true">
              <div className="gallery-lighting__rail" />
              <div className="gallery-spotlight gallery-spotlight--left">
                <span className="gallery-spotlight__beam" />
                <span className="gallery-spotlight__head" />
              </div>
              <div className="gallery-spotlight gallery-spotlight--right">
                <span className="gallery-spotlight__beam" />
                <span className="gallery-spotlight__head" />
              </div>
            </div>

            <div className="gallery-wires" aria-hidden="true">
              <span className="gallery-wire" />
              <span className="gallery-wire" />
            </div>

            <a
              className="gallery-artwork"
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse') setArtworkHovered(true)
              }}
              onPointerLeave={() => setArtworkHovered(false)}
              href={projectLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.name} ${project.viewLabel} (새 탭)`}
            >
              <div className="gallery-artwork__mat">
                <div className="gallery-artwork__preview">
                  <img
                    src={`${import.meta.env.BASE_URL}${project.preview}`}
                    decoding="async"
                    alt={`${project.name} 작품 미리보기`}
                  />
                </div>
              </div>
            </a>

            <div className="gallery-caption">
              <span className="gallery-caption__number">
                EXHIBIT {project.exhibit}
              </span>

              <h2 aria-live="polite">{project.title}</h2>

              <p>{project.caption}</p>
              <button
                className="gallery-story-button"
                type="button"
                aria-haspopup="dialog"
                onClick={() => setStoryOpen(true)}
              >
                VIEW STORY ↗
              </button>
            </div>

          </div>
          })}

        </div>

        <nav className="gallery-scene__footer gallery-navigation" aria-label="작품 선택"
          style={exhibitionEnded ? { display: 'none' } : undefined}>
          <div className="gallery-navigation__row">
            <button type="button" disabled={activeProject === 0} onClick={() => selectProject(activeProject - 1)} aria-label="이전 작품">←</button>
            <span>{project.number} / {String(galleryProjects.length).padStart(2, '0')}</span>
            <button type="button" disabled={transitionTarget !== null}
              onClick={() => activeProject === galleryProjects.length - 1 ? setExhibitionEnded(true) : selectProject(activeProject + 1)}
              aria-label={activeProject === galleryProjects.length - 1 ? '전시 관람 마치기' : '다음 작품'}>→</button>
          </div>
          <div className="gallery-navigation__positions">
            {galleryProjects.map((item, index) => (
              <button key={item.number} type="button" aria-label={item.number + ' ' + item.name}
                title={item.name} aria-current={index === activeProject ? 'true' : undefined}
                onClick={() => selectProject(index)}>{item.number}</button>
            ))}
          </div>
          <span className="gallery-navigation__name">{project.name}</span>
          <button className="gallery-autoplay-button" type="button"
            aria-label={autoPaused ? '작품 자동 넘기기 재생' : '작품 자동 넘기기 일시정지'}
            aria-pressed={autoPaused} onClick={() => setAutoPaused(!autoPaused)}>
            <span aria-hidden="true">{autoPaused ? '▶' : 'Ⅱ'}</span>
            {autoPaused ? '재생' : '일시정지'}
          </button>
        </nav>

        {exhibitionEnded && (
          <div className="gallery-ending">
            <p className="gallery-ending__eyebrow">UNTIL WE MEET AGAIN</p>
            <div className="gallery-ending__mascot"><Mascot animated /></div>
            <h2 ref={endingTitleRef} tabIndex={-1}>THANK YOU<br />FOR VISITING!</h2>
            <p className="gallery-ending__message">전시를 끝까지 관람해 주셔서 감사합니다.</p>
            <section className="gallery-contact" aria-labelledby="gallery-contact-title">
              <h3 id="gallery-contact-title">LET’S CONNECT</h3>
              <p>함께 만들고 싶은 이야기가 있다면 연락해 주세요.</p>
              <div className="gallery-contact__links">
                <a href="mailto:hihyena37@gmail.com"><span>EMAIL</span>hihyena37@gmail.com</a>
                <a href="tel:+821062960440"><span>PHONE</span>010-6296-0440</a>
                <a href="https://github.com/hihyena37" target="_blank" rel="noopener noreferrer"
                  aria-label="GitHub hihyena37 (새 탭)"><span>GITHUB</span>hihyena37 ↗</a>
              </div>
            </section>
            <button type="button" onClick={() => {
              setActiveProject(0)
              setTransitionTarget(null)
              setArtworkHovered(false)
              setArtworkFocused(false)
              setExhibitionEnded(false)
              window.requestAnimationFrame(() => galleryRef.current?.querySelector('.gallery-artwork')?.focus({ preventScroll: true }))
            }}>전시 다시 보기 <span aria-hidden="true">↗</span></button>
          </div>
        )}

      </div>

      <div className="hero-scroll" ref={hintRef}>
        <span>SCROLL TO ENTER</span>
        <span className="scroll-arrow">↓</span>
      </div>

      {storyOpen && <ProjectStory project={project} onClose={() => setStoryOpen(false)} />}

    </section>
  )
}

export default Hero
