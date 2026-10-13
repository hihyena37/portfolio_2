const Mascot = ({ animated = false }) => {
  return (
    <svg
      className={`mascot-svg${animated ? ' mascot-svg--celebrate' : ''}`}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="웃고 있는 주황색 별 마스코트"
    >
      <path
        d="M60 8 L75 40 L111 45 L85 72 L92 109 L60 91 L28 109 L35 72 L9 45 L45 40 Z"
        fill="#FFB65E"
        stroke="#ECA04B"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      <ellipse cx="47" cy="60" rx="4.5" ry="6" fill="#322630" />
      <ellipse cx="73" cy="60" rx="4.5" ry="6" fill="#322630" />

      <path
        d="M49 77 Q60 89 71 77"
        className={animated ? 'mascot-mouth--smile' : undefined}
        fill="none"
        stroke="#322630"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {animated && (
        <g className="mascot-mouth--open">
          <ellipse cx="60" cy="80" rx="10" ry="12" fill="#322630" />
          <ellipse cx="60" cy="86" rx="6" ry="3" fill="#FA8D85" />
        </g>
      )}

      <ellipse cx="35" cy="74" rx="8" ry="4" fill="#FA8D85" opacity="0.65" />
      <ellipse cx="85" cy="74" rx="8" ry="4" fill="#FA8D85" opacity="0.65" />
    </svg>
  )
}

export default Mascot
