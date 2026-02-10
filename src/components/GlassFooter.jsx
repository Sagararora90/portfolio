import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'

// HUD Corner Element (same as AboutContent)
const Corner = ({ top, bottom, left, right }) => (
  <div style={{
    position: 'absolute',
    top: top ? 0 : undefined,
    bottom: bottom ? 0 : undefined,
    left: left ? 0 : undefined,
    right: right ? 0 : undefined,
    width: '20px',
    height: '20px',
    borderTop: top ? '2px solid rgba(136, 204, 255, 0.5)' : 'none',
    borderBottom: bottom ? '2px solid rgba(136, 204, 255, 0.5)' : 'none',
    borderLeft: left ? '2px solid rgba(136, 204, 255, 0.5)' : 'none',
    borderRight: right ? '2px solid rgba(136, 204, 255, 0.5)' : 'none',
    opacity: 0.8
  }} />
)

export default function GlassFooter() {
  const mode = useStore(state => state.mode)
  const spaceProgress = useStore(state => state.spaceProgress)

  // Footer visible only after passing RESUME planet (progress > 0.9)
  const isVisible = mode === 'SPACE' && spaceProgress > 0.9

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            pointerEvents: 'none',
            background: 'radial-gradient(circle at center, rgba(136, 204, 255, 0.03) 0%, transparent 60%)'
          }}
        >
          {/* Main Content Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: '90%',
              maxWidth: '600px',
              position: 'relative',
              textAlign: 'center',
              pointerEvents: 'none', // [FIX] Allow scroll/touch to pass through card background
              padding: '3rem 2rem',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
            }}
          >
            {/* Corners */}
            <Corner top left />
            <Corner top right />
            <Corner bottom left />
            <Corner bottom right />

            {/* 1. Main line - Primary focus */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{
                fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                fontWeight: 300,
                color: '#ffffff',
                marginBottom: '2.5rem',
                letterSpacing: '0.05em',
                fontFamily: "'Outfit', system-ui, sans-serif"
              }}
            >
              Always learning. <span style={{ color: '#99a5adff' }}>Always building.</span>
            </motion.h1>

            {/* 2. Social intro text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              style={{
                fontSize: '0.85rem',
                color: '#88ccff',
                letterSpacing: '0.2em',
                marginBottom: '1.5rem',
                fontFamily: "'SF Mono', monospace"
              }}
            >
              Find me on
            </motion.p>

            {/* 3. Social Links with Icons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '2rem',
                pointerEvents: 'auto' // [FIX] Re-enable interaction for links
              }}
            >
              {/* GitHub */}
              <motion.a
                href="https://github.com/Sagararora90"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ 
                  scale: 1.1, 
                  borderColor: 'rgba(136, 204, 255, 0.5)',
                  boxShadow: '0 0 20px rgba(136, 204, 255, 0.2)'
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1.2rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontFamily: "'SF Pro Text', system-ui, sans-serif",
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </motion.a>

              {/* LinkedIn */}
              <motion.a
                href="https://linkedin.com/in/sagararora90"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ 
                  scale: 1.1, 
                  borderColor: 'rgba(136, 204, 255, 0.5)',
                  boxShadow: '0 0 20px rgba(136, 204, 255, 0.2)'
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1.2rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontFamily: "'SF Pro Text', system-ui, sans-serif",
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </motion.a>

              {/* Email */}
              <motion.a
                href="mailto:arorasagar540@gmail.com"
                whileHover={{ 
                  scale: 1.1, 
                  borderColor: 'rgba(136, 204, 255, 0.5)',
                  boxShadow: '0 0 20px rgba(136, 204, 255, 0.2)'
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1.2rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontFamily: "'SF Pro Text', system-ui, sans-serif",
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Email
              </motion.a>
            </motion.div>

            {/* 4. Friendly line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              style={{
                fontSize: '0.9rem',
                color: '#ffffff',
                letterSpacing: '0.08em',
                marginBottom: '3rem',
                fontFamily: "'SF Pro Text', system-ui, sans-serif"
              }}
            >
              Feel free to connect with me
            </motion.p>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              style={{
                width: '60%',
                height: '1px',
                background: 'rgba(255, 255, 255, 0.1)',
                margin: '0 auto 2rem'
              }}
            />

            {/* 5. Credit line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              style={{
                fontSize: '0.8rem',
                color: '#ffffff',
                letterSpacing: '0.15em',
                marginBottom: '1.5rem',
                fontFamily: "'SF Mono', monospace"
              }}
            >
              Designed & Built by Sagar
            </motion.p>

            {/* 6. Navigation hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              style={{
                fontSize: '0.75rem',
                color: '#88ccff',
                letterSpacing: '0.1em',
                fontFamily: "'SF Mono', monospace",
                cursor: 'pointer',
                pointerEvents: 'auto' // [FIX] Re-enable interaction for button
              }}
              whileHover={{ opacity: 0.6 }}
            >
              ↑ Back to Space
            </motion.p>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
