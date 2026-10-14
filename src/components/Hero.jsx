import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

import Mascot from './Mascot'
import ProjectStory from './ProjectStory'
import AboutMe from './AboutMe'
import { galleryProjects } from '../data/galleryProjects'
import './Hero.css'

const CONTACT_EMAIL = 'hihyena37@gmail.com'
// Scroll timeline time when the gallery room fades in after the door opens.
const GALLERY_VISIBLE_TIME = 2.5
const GALLERY_READY_TIME = GALLERY_VISIBLE_TIME + 0.34

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

const Hero = ({ entered, onBackToStart }) => {
  const [storyOpen, setStoryOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [activeProject, setActiveProject] = useState(0)
  const [transitionTarget, setTransitionTarget] = useState(null)
  const [transitionDestination, setTransitionDestination] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [exhibitionEnded, setExhibitionEnded] = useState(false)
  const endingTitleRef = useRef(null)
  const [galleryReady, setGalleryReady] = useState(false)
  const [galleryVisible, setGalleryVisible] = useState(false)
  const [artworkHovered, setArtworkHovered] = useState(false)
  const [artworkFocused, setArtworkFocused] = useState(false)
  const [artworkHolding, setArtworkHolding] = useState(false)
  const [emailCopied, setEmailCopied] = useState(false)
  const emailCopiedTimer = useRef(null)

  useEffect(() => () => window.clearTimeout(emailCopiedTimer.current), [])

  // The mascot cursor and sparkle trail distract from the framed artworks, so use the plain cursor there
  // (the About room keeps the full cursor effects).
  const viewingArtworks = (galleryVisible || galleryReady) && !exhibitionEnded && !aboutOpen
  useEffect(() => {
    if (!viewingArtworks) return
    document.documentElement.dataset.cursor = 'plain'
    return () => { delete document.documentElement.dataset.cursor }
  }, [viewingArtworks])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL)
    } catch {
      // Fallback for browsers without the async clipboard API (e.g. non-HTTPS).
      const field = document.createElement('textarea')
      field.value = CONTACT_EMAIL
      field.setAttribute('readonly', '')
      field.style.position = 'fixed'
      field.style.opacity = '0'
      document.body.appendChild(field)
      field.select()
      document.execCommand('copy')
      field.remove()
    }
    setEmailCopied(true)
    window.clearTimeout(emailCopiedTimer.current)
    emailCopiedTimer.current = window.setTimeout(() => setEmailCopied(false), 2000)
  }
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
  const aboutButtonRef = useRef(null)

  // Jump to the settled end of the pinned scroll range without replaying the scrub.
  const settleGalleryScroll = () => {
    const galleryScroll = ScrollTrigger.getAll().find((trigger) => trigger.trigger === heroRef.current)
    if (!galleryScroll) return
    galleryScroll.scroll(galleryScroll.end)
    galleryScroll.getTween()?.progress(1)
    galleryScroll.animation.totalProgress(1)
    ScrollTrigger.update()
    return galleryScroll
  }

  useEffect(() => {
    if (!exhibitionEnded) return
    // The ending sits at the pin's end. A short upward scroll leaves it and returns
    // to the gallery, so the rest of the pinned range reverses as before.
    const galleryScroll = settleGalleryScroll()
    endingTitleRef.current?.focus({ preventScroll: true })
    if (!galleryScroll) return
    const leaveOnScrollUp = () => {
      if (window.scrollY >= galleryScroll.end - 60) return
      setTransitionTarget(null)
      setTransitionDestination(null)
      setExhibitionEnded(false)
      window.requestAnimationFrame(() => galleryRef.current?.querySelector('.gallery-artwork')?.focus({ preventScroll: true }))
    }
    window.addEventListener('scroll', leaveOnScrollUp, { passive: true })
    return () => window.removeEventListener('scroll', leaveOnScrollUp)
  }, [exhibitionEnded])

  useEffect(() => {
    if (!entered) return
    // Prepare lightweight previews during the entrance animation.
    const isMobile = window.matchMedia('(max-width: 767px)').matches
    const previews = galleryProjects.map((item) => {
      const image = new Image()
      image.decoding = 'async'
      image.src = import.meta.env.BASE_URL + ((isMobile && item.previewMobile) || item.preview)
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

    // The intro scales the hero past the viewport; hide scrollbars until the
    // scroll animation exists so they appear only once, with the mascot.
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    const restoreOverflow = () => { root.style.overflow = previousOverflow }

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
            galleryActive = this.time() >= GALLERY_READY_TIME
            setGalleryReady(galleryActive)
            setGalleryVisible(this.time() >= GALLERY_VISIBLE_TIME)
          }
        },
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: () => '+=' + Math.max(900, Math.min(1600, window.innerHeight * 1.5)),
          pin: true,
          scrub: 0.35,
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
              galleryActive = self.animation.time() >= GALLERY_READY_TIME
              setGalleryReady(galleryActive)
              setGalleryVisible(self.animation.time() >= GALLERY_VISIBLE_TIME)
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
            aboutButtonRef.current,
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
            force3D: false,
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
            rotationY: -100,
            force3D: false,
            duration: 0.55,
            ease: 'power2.inOut',
          },
          1.95
        )
        .to(
          doorRightRef.current,
          {
            rotationY: 100,
            force3D: false,
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
          GALLERY_VISIBLE_TIME
        )

      ScrollTrigger.refresh()
    }

    const introTl = gsap.timeline({
      onComplete: () => {
        floating.play()
        restoreOverflow()
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
      restoreOverflow()
      introTl.kill()
      floating.kill()
      scrollTl?.scrollTrigger?.kill()
      scrollTl?.kill()
    }
  }, [entered])

  const selectProject = (index) => {
    if (!galleryReady || index < 0 || index >= galleryProjects.length || index === activeProject) return
    setActiveProject(index)
    setTransitionTarget(null)
    setTransitionDestination(null)
    setArtworkHovered(false)
    setArtworkFocused(false)
  }

  const navigationIndex = activeProject
  const moveProject = (direction) => {
    if (direction > 0 && navigationIndex === galleryProjects.length - 1) {
      if (transitionTarget === null) setExhibitionEnded(true)
      return
    }
    selectProject(navigationIndex + direction)
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

        <button className="hero-about-button" type="button" ref={aboutButtonRef}
          aria-haspopup="dialog" onClick={() => setAboutOpen(true)}>
          ABOUT THE ARTIST <span aria-hidden="true">↗</span>
        </button>
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

      <div className={`gallery-scene${exhibitionEnded ? ' gallery-scene--ending' : ''}${artworkHovered ? ' gallery-scene--spotlit' : ''}${artworkHolding && transitionTarget === null && !exhibitionEnded ? ' gallery-scene--holding' : ''}`} ref={galleryRef} inert={!galleryReady && !exhibitionEnded}
        role="region" aria-label="작품 전시 슬라이드"
        onKeyDown={(event) => {
          if (exhibitionEnded) return
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault()
            moveProject(event.key === 'ArrowRight' ? 1 : -1)
          }
        }}>

        <div className="gallery-scene__header">
          <span>HYENA'S EXHIBITION</span>
          <nav className="gallery-header-actions" aria-label="전시 메뉴">
            <button type="button" onClick={onBackToStart} aria-label="티켓 인트로로 돌아가기">START ↺</button>
            <button type="button" className="gallery-connect-button" aria-haspopup="dialog"
              onClick={() => setAboutOpen(true)}>ABOUT ↗</button>
            <button type="button" className="gallery-connect-button" onClick={() => {
              setTransitionTarget(null)
              setTransitionDestination(null)
              setExhibitionEnded(true)
              window.requestAnimationFrame(() => {
                const contact = galleryRef.current?.querySelector('#gallery-contact-title')
                contact?.focus({ preventScroll: true })
                const ending = galleryRef.current?.querySelector('.gallery-ending')
                if (ending) ending.scrollTop = ending.scrollHeight
              })
            }}>CONNECT ↗</button>
          </nav>
        </div>

        <div className={`gallery-hanging${dragging ? ' gallery-hanging--dragging' : ''}`} ref={frameRef}
          style={exhibitionEnded ? { display: 'none' } : undefined}
          // Only keyboard focus pauses the drift; the replay button's programmatic focus must not.
          onFocusCapture={(event) => setArtworkFocused(event.target.matches(':focus-visible'))}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setArtworkFocused(false)
          }}
          onPointerDown={(event) => {
            suppressClickRef.current = false
            if (!event.isPrimary || event.button !== 0 || event.target.closest('button') || transitionTarget !== null) return
            swipeRef.current = {
              x: event.clientX,
              y: event.clientY,
              target: event.target.closest('a') ?? event.currentTarget,
            }
            // Hold the artwork under the finger until the tap or swipe finishes.
            setDragging(true)
          }}
          onPointerMove={(event) => {
            const start = swipeRef.current
            if (!start) return
            if (Math.abs(event.clientX - start.x) > 50 && Math.abs(event.clientX - start.x) > Math.abs(event.clientY - start.y) * 1.3) {
              suppressClickRef.current = true
              start.target.setPointerCapture(event.pointerId)
            }
          }}
          onPointerUp={(event) => {
            const start = swipeRef.current
            swipeRef.current = null
            setDragging(false)
            if (!start) return
            const dx = event.clientX - start.x
            const dy = event.clientY - start.y
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) {
              suppressClickRef.current = true
              selectProject(activeProject + (dx < 0 ? 1 : -1))
            }
          }}
          onPointerCancel={() => { swipeRef.current = null; setDragging(false); suppressClickRef.current = true }}
          onLostPointerCapture={() => { swipeRef.current = null; setDragging(false) }}
          onDragStart={(event) => event.preventDefault()}
          onClickCapture={(event) => {
            if (suppressClickRef.current) {
              event.preventDefault()
              event.stopPropagation()
              suppressClickRef.current = false
            }
          }}>
          {[-1, 1].map((direction) => {
            const index = activeProject + direction
            const neighbor = galleryProjects[index]
            if (!neighbor || exhibitionEnded) return null
            return <button type="button" key={`peek-${direction}`}
              className={`gallery-peek gallery-peek--${direction < 0 ? 'previous' : 'next'}`}
              aria-label={`${neighbor.name} 작품으로 이동`}
              onClick={() => selectProject(index)}>
              <picture>
                {neighbor.previewMobile && <source media="(max-width: 767px)" srcSet={`${import.meta.env.BASE_URL}${neighbor.previewMobile}`} />}
                <img src={`${import.meta.env.BASE_URL}${neighbor.preview}`} alt="" decoding="async" />
              </picture>
            </button>
          })}
          {[0].map((offset) => {
            if (exhibitionEnded || (offset === 1 && transitionTarget === null && activeProject === galleryProjects.length - 1)) return null
            const manual = transitionTarget !== null
            const project = galleryProjects[offset === 0 ? activeProject : (transitionTarget ?? (activeProject + 1) % galleryProjects.length)]
            const projectLink = project.link.startsWith('https://')
              ? project.link : import.meta.env.BASE_URL + project.link
            return <div className={`gallery-slide${offset ? ' gallery-slide--incoming' : ''}${manual ? ' gallery-slide--manual' : ''}${manual && transitionTarget < activeProject ? ' gallery-slide--reverse' : ''}`}
            key={`${activeProject}-${transitionTarget}-${offset}`}
            inert={offset === 1}
            aria-hidden={offset === 1 ? true : undefined}
            style={{
              animationPlayState: !galleryReady || storyOpen || aboutOpen || (!manual && (artworkFocused || dragging)) ? 'paused' : 'running',
              '--manual-duration': transitionDestination !== null ? '350ms' : '1.2s',
            }}
            onAnimationStart={(event) => {
              if (offset === 0 && event.target === event.currentTarget && event.animationName === 'gallery-hold') setArtworkHolding(true)
            }}
            onAnimationEnd={(event) => {
              if (event.target !== event.currentTarget || event.animationName !== 'gallery-hold') return
              setArtworkHolding(false)
              if (activeProject === galleryProjects.length - 1) setExhibitionEnded(true)
              else setActiveProject((index) => index + 1)
            }}>
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
                  <picture>
                    {project.previewMobile && (
                      <source
                        media="(max-width: 767px)"
                        srcSet={`${import.meta.env.BASE_URL}${project.previewMobile}`}
                      />
                    )}
                    <img
                      src={`${import.meta.env.BASE_URL}${project.preview}`}
                      decoding="async"
                      style={project.previewPosition ? { '--preview-position': project.previewPosition } : undefined}
                      alt={`${project.name} 작품 미리보기`}
                    />
                  </picture>
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
            <button type="button" disabled={navigationIndex === 0} onClick={() => moveProject(-1)} aria-label="이전 작품">←</button>
            <span>{project.number} / {String(galleryProjects.length).padStart(2, '0')}</span>
            <button type="button"
              onClick={() => moveProject(1)}
              aria-label={activeProject === galleryProjects.length - 1 ? '전시 관람 마치기' : '다음 작품'}>→</button>
          </div>
          <div className="gallery-navigation__positions">
            {galleryProjects.map((item, index) => (
              <button key={item.number} type="button" aria-label={item.number + ' ' + item.name}
                title={item.name} aria-current={index === activeProject ? 'true' : undefined}
                onClick={() => selectProject(index)} />
            ))}
          </div>
        </nav>

        {exhibitionEnded && (
          <div className="gallery-ending">
            <p className="gallery-ending__eyebrow">UNTIL WE MEET AGAIN</p>
            <div className="gallery-ending__mascot"><Mascot animated /></div>
            <h2 ref={endingTitleRef} tabIndex={-1}>THANK YOU<br />FOR VISITING!</h2>
            <p className="gallery-ending__message">전시를 끝까지 관람해 주셔서 감사합니다.</p>
            <section className="gallery-contact" aria-labelledby="gallery-contact-title">
              <h3 id="gallery-contact-title" tabIndex={-1}>LET’S CONNECT</h3>
              <p>함께 만들고 싶은 이야기가 있다면 연락해 주세요.</p>
              <div className="gallery-contact__links">
                <button type="button" onClick={copyEmail}
                  aria-label={emailCopied ? '이메일 주소가 복사되었습니다' : `이메일 주소 ${CONTACT_EMAIL} 복사하기`}>
                  <span>EMAIL</span>{emailCopied ? '복사되었어요!' : CONTACT_EMAIL}
                </button>
                <a href="tel:+821062960440"><span>PHONE</span>010-6296-0440</a>
                <a href="https://github.com/hihyena37" target="_blank" rel="noopener noreferrer"
                  aria-label="GitHub hihyena37 (새 탭)"><span>GITHUB</span>hihyena37 ↗</a>
              </div>
            </section>
            <button type="button" onClick={() => {
              // Restart in the settled gallery.
              settleGalleryScroll()
              setGalleryReady(true)
              setActiveProject(0)
              setTransitionTarget(null)
              setTransitionDestination(null)
              setArtworkHovered(false)
              setArtworkFocused(false)
              setArtworkHolding(false)
              setExhibitionEnded(false)
              window.requestAnimationFrame(() => galleryRef.current?.querySelector('.gallery-artwork')?.focus({ preventScroll: true }))
            }}>전시 다시 보기 <span aria-hidden="true">↗</span></button>
          </div>
        )}

      </div>

      <div className="hero-scroll" ref={hintRef}>
        <span>SCROLL TO ENTER</span>
        {/* Bootstrap Icons "mouse" (MIT) */}
        <svg className="scroll-mouse" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 3a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 3m4 8a4 4 0 0 1-8 0V5a4 4 0 1 1 8 0zM8 0a5 5 0 0 0-5 5v6a5 5 0 0 0 10 0V5a5 5 0 0 0-5-5" />
        </svg>
      </div>

      {storyOpen && <ProjectStory project={project} onClose={() => setStoryOpen(false)} />}
      {aboutOpen && <AboutMe onClose={() => setAboutOpen(false)} />}

    </section>
  )
}

export default Hero
