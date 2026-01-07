import React, { useRef } from 'react'
import BackButton from './BackButton'
import { motion } from 'framer-motion'
import { useStore } from '../store'

// --- SKILLS DATA ---
const SKILLS = [
  { category: 'LANGUAGE', items: ['C', 'C++', 'JavaScript', 'TypeScript', 'Python', 'Java'] },
  { category: 'FRAMEWORK', items: ['React.js', 'Next.js'] },
  { category: 'BACKEND', items: ['Node.js'] },
  { category: 'DATABASE', items: ['MongoDB', 'SQL'] },
  { category: 'TOOLS', items: ['Git', 'Postman'] },
  { category: 'DSA', items: ['Data Structures & Algorithms'] },
  { category: 'AI', items: ['Foundational Concepts'] }
]

export default function SkillsContent() {
  const mode = useStore(state => state.mode)
  const activePlanet = useStore(state => state.activePlanet)
  const containerRef = useRef(null)

  const isVisible = mode === 'PLANET' && activePlanet?.name === 'SKILLS'

  if (!isVisible) return null

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflowY: 'auto', 
        overflowX: 'hidden',
        zIndex: 5,
        pointerEvents: 'auto',
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '140px', // Header space clearing button
        opacity: 0,
        animation: 'fadeIn 0.6s ease-out forwards'
      }}
    >
        <style>
            {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .skill-card {
                    background: rgba(255, 255, 255, 0.03); /* Much more transparent */
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    border: 1px solid rgba(136, 204, 255, 0.12);
                    border-radius: 16px;
                    padding: 1.8rem;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .skill-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 100%);
                    opacity: 0;
                    transition: opacity 0.4s ease;
                }

                .skill-card:hover {
                    transform: translateY(-5px) scale(1.02);
                    background: rgba(136, 204, 255, 0.08);
                    border-color: rgba(136, 204, 255, 0.3);
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(136, 204, 255, 0.15);
                }

                .skill-card:hover::before {
                    opacity: 1;
                }

                /* Tech Corner Accents */
                .card-corner {
                    position: absolute;
                    width: 8px; 
                    height: 8px;
                    border-color: rgba(136, 204, 255, 0.4);
                    transition: all 0.3s ease;
                    opacity: 0.5;
                }
                
                .skill-card:hover .card-corner {
                    border-color: #88ccff;
                    opacity: 1;
                    width: 12px; height: 12px;
                }

                .corner-tl { top: 10px; left: 10px; border-top: 1px solid; border-left: 1px solid; }
                .corner-tr { top: 10px; right: 10px; border-top: 1px solid; border-right: 1px solid; }
                .corner-bl { bottom: 10px; left: 10px; border-bottom: 1px solid; border-left: 1px solid; }
                .corner-br { bottom: 10px; right: 10px; border-bottom: 1px solid; border-right: 1px solid; }

                .skill-pill {
                    font-size: 0.85rem;
                    font-family: "'Outfit', sans-serif";
                    color: rgba(255, 255, 255, 0.8);
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 0.4rem 0.8rem;
                    border-radius: 6px;
                    transition: all 0.3s ease;
                    cursor: default;
                }

                .skill-pill:hover {
                    background: rgba(136, 204, 255, 0.15);
                    border-color: rgba(136, 204, 255, 0.4);
                    color: #fff;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                }

                .category-title {
                    font-family: "'Orbitron', sans-serif";
                    font-size: 1.1rem;
                    color: #88ccff;
                    letter-spacing: 0.05em;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .category-line {
                    height: 1px;
                    background: linear-gradient(90deg, rgba(136,204,255,0.3), transparent);
                    flex: 1;
                }
            `}
        </style>

        {/* Page Header */}
        <div style={{ marginBottom: '3rem', textAlign: 'center', zIndex: 10 }}>
             <h2 style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '0.1em',
                textShadow: '0 0 30px rgba(136, 204, 255, 0.3)'
            }}>
                TECHNICAL ARSENAL
            </h2>
            <div style={{
                width: '60px',
                height: '3px',
                background: '#88ccff',
                margin: '1rem auto 0',
                borderRadius: '2px',
                boxShadow: '0 0 10px #88ccff'
            }} />
        </div>

        {/* Card Grid */}
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
            gap: '1.5rem',
            width: '92vw',
            maxWidth: '1200px',
            paddingBottom: '12rem',
            paddingLeft: '1rem',
            paddingRight: '1rem',
            boxSizing: 'border-box'
        }}>
            {SKILLS.map((skill, index) => (
                <motion.div
                    key={index}
                    className="skill-card"
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    viewport={{ once: false, margin: "-10%" }} // Re-triggers when scrolling back
                    transition={{ duration: 0.4 }}
                >
                    {/* Tech Corners */}
                    <div className="card-corner corner-tl" />
                    <div className="card-corner corner-tr" />
                    <div className="card-corner corner-bl" />
                    <div className="card-corner corner-br" />

                    {/* Header */}
                    <div className="category-title">
                        {skill.category}
                        <div className="category-line" />
                    </div>

                    {/* Pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                        {skill.items.map((item, idx) => (
                            <div key={idx} className="skill-pill">
                                {item}
                            </div>
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>
    </div>
  )
}
