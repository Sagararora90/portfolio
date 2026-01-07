import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'

// --- PROJECTS DATA ---
const PROJECTS = [
  {
    id: 1,
    title: 'ChatX',
    description: 'Real-time chat application with instant messaging, live notifications, and seamless user experience.',
    stack: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
    links: {
      github: 'https://github.com/Sagararora90/ChatX',
      live: null
    }
  },
  {
    id: 2,
    title: 'Hospital Management System',
    description: 'Comprehensive healthcare management solution for patient records, appointments, and medical staff coordination.',
    stack: ['React', 'Node.js', 'MongoDB', 'Express'],
    links: {
      github: 'https://github.com/Sagararora90/HospitalManagementSystem',
      live: null
    }
  },
  {
    id: 3,
    title: 'AI Developer',
    description: 'Intelligent coding assistant powered by Gemini and Groq APIs for code generation, debugging, and development assistance.',
    stack: ['React', 'Gemini API', 'Groq API', 'Node.js'],
    links: {
      github: 'https://github.com/Sagararora90/Ai_agent',
      live: null
    }
  }
]

// Glass Card Component
function ProjectCard({ project, isExpanded, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        width: '100%',
        boxSizing: 'border-box', // Prevents padding from causing overflow
        maxWidth: 'min(500px, 100%)',
        padding: isExpanded ? 'clamp(1.5rem, 4vw, 2rem)' : 'clamp(1rem, 3vw, 1.5rem)',
        background: isExpanded 
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.05) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: isExpanded 
          ? '1px solid rgba(255, 255, 255, 0.25)' 
          : '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '16px',
        cursor: 'pointer',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isExpanded ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isExpanded 
          ? '0 25px 80px rgba(0, 0, 0, 0.4), 0 0 60px rgba(255, 100, 68, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
          : '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: isExpanded ? '1.5rem' : '0'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: 'clamp(1rem, 3vw, 1.2rem)',
          fontFamily: 'monospace',
          fontWeight: 600,
          color: '#ffffff',
          letterSpacing: '0.05em'
        }}>
          {project.title}
        </h3>
        
        {/* Expand indicator */}
        <span style={{
          fontSize: '0.8rem',
          color: 'rgba(255, 255, 255, 0.4)',
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease'
        }}>
          ▼
        </span>
      </div>

      {/* Expandable Content */}
      <div style={{
        maxHeight: isExpanded ? '300px' : '0',
        opacity: isExpanded ? 1 : 0,
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Description */}
        <p style={{
          margin: '0 0 1.5rem 0',
          fontSize: '0.9rem',
          fontFamily: 'system-ui, sans-serif',
          color: 'rgba(255, 255, 255, 0.7)',
          lineHeight: 1.6
        }}>
          {project.description}
        </p>

        {/* Tech Stack */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{
            fontSize: '0.65rem',
            fontFamily: 'monospace',
            color: 'rgba(255, 255, 255, 0.4)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '0.5rem'
          }}>
            STACK
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {project.stack.map((tech, i) => (
              <span
                key={i}
                style={{
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  color: 'rgba(255, 100, 68, 0.9)',
                  background: 'rgba(255, 100, 68, 0.1)',
                  border: '1px solid rgba(255, 100, 68, 0.2)',
                  borderRadius: '4px'
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                color: 'rgba(255, 255, 255, 0.8)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)'
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.05)'
              }}
            >
              → GitHub
            </a>
          )}
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                color: '#ffffff',
                background: 'rgba(255, 100, 68, 0.2)',
                border: '1px solid rgba(255, 100, 68, 0.4)',
                borderRadius: '6px',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 100, 68, 0.3)'
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 100, 68, 0.2)'
              }}
            >
              → Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProjectsContent() {
  const mode = useStore(state => state.mode)
  const activePlanet = useStore(state => state.activePlanet)
  const [expandedId, setExpandedId] = useState(null)

  const isVisible = mode === 'PLANET' && activePlanet?.name === 'PROJECTS'

  if (!isVisible) return null

  const handleToggle = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

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
        justifyContent: 'flex-start',
        padding: 'clamp(8rem, 18vh, 10rem) clamp(1rem, 5vw, 2rem) 2rem',
        boxSizing: 'border-box',
        overflowY: 'auto',
        zIndex: 5,
        pointerEvents: 'auto'
      }}
    >
      {/* Header */}
      <div style={{
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <span style={{
          fontSize: '0.65rem',
          fontFamily: 'monospace',
          color: 'rgba(255, 255, 255, 0.4)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase'
        }}>
          FEATURED WORK
        </span>
        <h2 style={{
          margin: '0.5rem 0 0 0',
          fontSize: 'clamp(1.5rem, 5vw, 1.8rem)',
          fontFamily: 'monospace',
          fontWeight: 600,
          color: '#ffffff',
          letterSpacing: '0.05em'
        }}>
          PROJECTS
        </h2>
      </div>

      {/* Project Cards */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '100%',
        maxWidth: '500px'
      }}>
        {PROJECTS.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            isExpanded={expandedId === project.id}
            onToggle={() => handleToggle(project.id)}
          />
        ))}
      </div>

      {/* Hint */}
      <div style={{
        marginTop: '2rem',
        fontSize: '0.65rem',
        fontFamily: 'monospace',
        color: 'rgba(255, 255, 255, 0.3)',
        letterSpacing: '0.2em'
      }}>
        TAP TO EXPAND
      </div>
    </div>
  )
}
