import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import './ProjectStory.css'

const ProjectStory = ({ project, onClose }) => {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  return createPortal(
    <dialog
      className="project-story"
      ref={dialogRef}
      aria-labelledby="project-story-title"
      onClose={onClose}
    >
      <div className="project-story__header">
        <span>EXHIBIT {project.exhibit} / VIEW STORY</span>
      </div>

      <div className="project-story__body">
        <p className="project-story__category">{project.category}</p>
        <h2 id="project-story-title">{project.title} · {project.name}</h2>
        <p className="project-story__summary">
          {project.summary}
        </p>
        <dl className="project-story__details">
          <div><dt>담당 역할</dt><dd>{project.role}</dd></div>
          <div><dt>제작 기간</dt><dd>{project.duration}</dd></div>
          <div><dt>기여도</dt><dd>100% · {project.workType}</dd></div>
          <div><dt>사용 도구</dt><dd>{[project.tools, project.ai].filter(Boolean).join(' · ')}</dd></div>
        </dl>
        <a
          className="project-story__link"
          href={project.link.startsWith('https://') ? project.link : import.meta.env.BASE_URL + project.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {project.viewLabel} ↗<span className="project-story__new-tab"> (새 탭)</span>
        </a>
      </div>
      <div className="project-story__footer">
        <button type="button" onClick={() => dialogRef.current.close()} autoFocus>
          CLOSE ×
        </button>
      </div>
    </dialog>,
    document.body
  )
}

export default ProjectStory
