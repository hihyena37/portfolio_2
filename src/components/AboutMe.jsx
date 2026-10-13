import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import SparkleCursor from './SparkleCursor'
import './AboutMe.css'

// 확인되지 않은 내용은 null로 두고 화면에 '내용 준비 중'으로 표시합니다.
// 실제 내용이 정해지면 아래 값만 교체하면 됩니다.
const artist = {
  name: '성혜나',
  nameEn: 'SEONG HYENA',
  role: 'Web Publisher & Design',
  photo: 'hn1.png',
  intro: null, // 한 줄 자기소개
}

// 아이콘 파일은 public 폴더에 있으며, 파일명 대소문자를 그대로 맞춰야 합니다.
const skills = [
  { name: 'Photoshop', icon: 'ps.png' },
  { name: 'Illustrator', icon: 'ai.png' },
  { name: 'Figma', icon: 'figma.png' },
  { name: 'HTML', icon: 'html.png' },
  { name: 'CSS', icon: 'css.png' },
  { name: 'JavaScript', icon: 'js.png' },
  { name: 'jQuery', icon: 'jq.png' },
  { name: 'GitHub', icon: 'GitHub.png' },
  { name: 'Git', icon: 'git.png' },
  { name: 'Codex', icon: 'codex.png' },
  { name: 'Claude', icon: 'claude.png' },
  { name: 'React', icon: 'react.png' },
]

// 각 항목은 { period, title, detail } 형태로 추가합니다.
const records = [
  {
    title: 'EDUCATION',
    label: '학력',
    items: [
      { period: '2016', title: '구미여자고등학교 졸업' },
      { period: '2024', title: '대구가톨릭대학교 디지털디자인과 졸업' },
    ],
  },
  {
    title: 'TRAINING',
    label: '관련 교육',
    items: [
      { period: '2025.07 ~ 2026.02', title: 'SBS아카데미컴퓨터아트학원', detail: '웹디자인과정 수업 이수' },
      { period: '2026.05 ~ 2026.10', title: 'SBS아카데미컴퓨터아트학원', detail: '웹퍼블리셔 과정 국비 수업 이수' },
    ],
  },
  {
    title: 'CERTIFICATES',
    label: '자격증',
    items: [
      { period: '2025.12', title: '웹디자인개발기능사 취득' },
    ],
  },
]

const Pending = ({ children = '내용 준비 중' }) => (
  <span className="about-pending">{children}</span>
)

const AboutMe = ({ onClose }) => {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    const scrollY = window.scrollY
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    dialog.scrollTop = 0
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
      // Return to the exact spot the visitor left, without replaying any scrub.
      if (window.scrollY !== scrollY) window.scrollTo({ top: scrollY, behavior: 'instant' })
      previousFocus?.focus?.({ preventScroll: true })
    }
  }, [])

  return createPortal(
    <dialog
      className="about-me"
      ref={dialogRef}
      aria-labelledby="about-me-title"
      onClose={onClose}
    >
      {/* The modal sits in the top layer above the page-level trail, so it needs its own. */}
      <SparkleCursor />
      <div className="about-me__bar">
        <span>HYENA'S EXHIBITION / ARTIST ROOM</span>
        <button type="button" onClick={() => dialogRef.current.close()} autoFocus>
          CLOSE <span aria-hidden="true">×</span>
        </button>
      </div>

      <div className="about-me__inner">
        <header className="about-me__intro">
          <p className="about-me__eyebrow">ABOUT THE ARTIST</p>
          <h2 id="about-me-title">작가 소개관</h2>
        </header>

        <section className="about-section about-profile" aria-labelledby="about-profile-title">
          <p className="about-section__number">01</p>
          <h3 id="about-profile-title" className="about-section__title">ARTIST PROFILE</h3>
          <div className="about-profile__panel">
            <figure className="about-profile__portrait">
              <img src={`${import.meta.env.BASE_URL}${artist.photo}`} alt={`${artist.name} 캐릭터`} decoding="async" />
            </figure>
            <div className="about-profile__label">
              <p className="about-profile__role">{artist.role}</p>
              <p className="about-profile__name">
                {artist.name}
                <span>{artist.nameEn}</span>
              </p>
              <p className="about-profile__line">
                {artist.intro ?? <Pending>한 줄 자기소개 준비 중</Pending>}
              </p>
            </div>
          </div>
        </section>

        <section className="about-section" aria-labelledby="about-skills-title">
          <p className="about-section__number">02</p>
          <h3 id="about-skills-title" className="about-section__title">SKILLS</h3>
          <div className="about-card">
            <ul className="about-skills">
              {skills.map((skill) => (
                <li key={skill.name} title={skill.name}>
                  <img src={`${import.meta.env.BASE_URL}${skill.icon}`} alt={skill.name}
                    loading="lazy" decoding="async" />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="about-section" aria-labelledby="about-records-title">
          <p className="about-section__number">03</p>
          <h3 id="about-records-title" className="about-section__title">EDUCATION &amp; CERTIFICATES</h3>
          <div className="about-records">
            {records.map((group) => (
              <div className="about-card" key={group.title}>
                <h4>{group.title}<span>{group.label}</span></h4>
                {group.items.length > 0 ? (
                  <ol className="about-timeline">
                    {group.items.map((item) => (
                      <li key={item.period + item.title}>
                        <span className="about-timeline__period">{item.period}</span>
                        <strong>{item.title}</strong>
                        {item.detail && <p>{item.detail}</p>}
                      </li>
                    ))}
                  </ol>
                ) : <p><Pending /></p>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </dialog>,
    document.body
  )
}

export default AboutMe
