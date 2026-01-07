import React from 'react'
import { useStore } from '../store'

export default function ResumeContent() {
  const mode = useStore(state => state.mode)
  const activePlanet = useStore(state => state.activePlanet)

  const isVisible = mode === 'PLANET' && activePlanet?.name === 'RESUME'

  if (!isVisible) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(8rem, 15vh, 9rem) clamp(1rem, 5vw, 2rem) 2rem',
        boxSizing: 'border-box',
        overflowY: 'auto',
        zIndex: 5,
        pointerEvents: 'auto'
      }}
    >
      {/* Glass Card Container */}
      <div style={{
        width: '100%',
        maxWidth: 'min(750px, 94vw)',
        height: '80vh',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Card Header */}
        <div style={{
          padding: '1.25rem 2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '0.85rem',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 500,
            color: '#cc88ff',
            letterSpacing: '0.2em',
            textTransform: 'uppercase'
          }}>
            Resume
          </h1>
          
          {/* Download Button in Header */}
          <a
            href="/resume.pdf"
            download="Sagar_Arora_Resume.pdf"
            onClick={(e) => e.stopPropagation()}
            style={{
              padding: '0.5rem 1.25rem',
              fontSize: '0.7rem',
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 400,
              color: 'white',
              background: 'rgba(170, 68, 255, 0.1)',
              border: '1px solid rgba(249, 248, 250, 0.25)',
              borderRadius: '8px',
              textDecoration: 'none',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(170, 68, 255, 0.2)'
              e.target.style.borderColor = 'rgba(170, 68, 255, 0.4)'
              e.target.style.boxShadow = '0 0 20px rgba(170, 68, 255, 0.15)'
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(170, 68, 255, 0.1)'
              e.target.style.borderColor = 'rgba(170, 68, 255, 0.25)'
              e.target.style.boxShadow = 'none'
            }}
          >
            Download
          </a>
        </div>

        {/* PDF Preview */}
        <div style={{
          flex: 1,
          padding: '1rem',
          overflow: 'hidden'
        }}>
          <iframe
            src="/resume.pdf#toolbar=0&navpanes=0&scrollbar=0"
            title="Resume Preview"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.98)'
            }}
          />
        </div>
      </div>
    </div>
  )
}
