import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store";
import useMobile from "../hooks/useMobile"; // [NEW]

const roles = ["SOFTWARE DEVELOPER", "FREELANCER", "FULL STACK ENGINEER"];

// Generate random stars for parallax background
function generateStars(count) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      depth: Math.random(),
      opacity: Math.random() * 0.5 + 0.3
    });
  }
  return stars;
}

function AnimatedLetter({ letter, index }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{
        duration: 0.05,
        delay: index * 0.035,
        ease: "easeOut",
      }}
      style={{ display: 'inline-block' }}
    >
      {letter === " " ? "\u00A0" : letter}
    </motion.span>
  );
}

function AnimatedRole({ text }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={text}
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {text.split("").map((letter, index) => (
          <AnimatedLetter key={`${letter}-${index}`} letter={letter} index={index} />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

export default function HomeContent() {
  const mode = useStore(state => state.mode);
  const setMode = useStore(state => state.setMode);
  const activePlanet = useStore(state => state.activePlanet);
  const isReturningFromSpace = useStore(state => state.isReturningFromSpace);
  const setReturningFromSpace = useStore(state => state.setReturningFromSpace);
  
  const [roleIndex, setRoleIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const accumulatedScrollRef = useRef(0);
  const isMobile = useMobile(); // [NEW] Use hook instead of local state

  // Animate smooth reverse when returning from space
  useEffect(() => {
    if (isReturningFromSpace) {
      // Start from progress = 1 (end state)
      setScrollProgress(1);
      accumulatedScrollRef.current = 1000;
      setReturningFromSpace(false);
      
      // Smoothly animate back to 0 over 1.2 seconds
      const duration = 1200;
      const startTime = Date.now();
      const startProgress = 1;
      const targetProgress = 0;
      
      const animateReverse = () => {
        const elapsed = Date.now() - startTime;
        const t = Math.min(1, elapsed / duration);
        // Ease out cubic for smooth deceleration
        const eased = 1 - Math.pow(1 - t, 3);
        const newProgress = startProgress + (targetProgress - startProgress) * eased;
        
        setScrollProgress(newProgress);
        accumulatedScrollRef.current = newProgress * 1000;
        
        if (t < 1) {
          requestAnimationFrame(animateReverse);
        }
      };
      
      // Small delay before starting reverse animation
      setTimeout(() => requestAnimationFrame(animateReverse), 100);
    }
  }, [isReturningFromSpace, setReturningFromSpace]);
  
  // [OPTIMIZATION] Reduce star count on mobile
  const stars = useMemo(() => generateStars(isMobile ? 40 : 120), [isMobile]);

  // Visibility based on store mode - ONLY show in HOME mode
  const isHome = mode === 'HOME';
  const isVisible = isHome;

  // Role cycling
  useEffect(() => {
    if (!isHome) return;
    
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2700);

    return () => clearInterval(interval);
  }, [isHome]);

  // Scroll-based animation tracking
  useEffect(() => {
    if (!isHome) {
      accumulatedScrollRef.current = 0;
      setScrollProgress(0);
      return;
    }

    // [TUNING] Adjusted for balanced speed (Not too slow, not too fast)
    const maxScroll = 800; // Was 1000, then 600. 800 is balanced.

    const handleWheel = (e) => {
      accumulatedScrollRef.current = Math.max(0, Math.min(maxScroll, 
        // [TUNING] Balanced sensitivity
        accumulatedScrollRef.current + e.deltaY * 0.55
      ));
      
      const progress = accumulatedScrollRef.current / maxScroll;
      setScrollProgress(progress);
      
      if (progress >= 1) {
        setTimeout(() => {
          setMode('SPACE');
          accumulatedScrollRef.current = 0;
          setScrollProgress(0);
        }, 500);
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e) => {
      const deltaY = touchStartY - e.touches[0].clientY;
      accumulatedScrollRef.current = Math.max(0, Math.min(maxScroll, 
        // [TUNING] Increased sensitivity for mobile (was 0.55)
        accumulatedScrollRef.current + deltaY * 2.5
      ));
      touchStartY = e.touches[0].clientY;
      
      const progress = accumulatedScrollRef.current / maxScroll;
      setScrollProgress(progress);
      
      if (progress >= 1) {
        setTimeout(() => {
          setMode('SPACE');
          accumulatedScrollRef.current = 0;
          setScrollProgress(0);
        }, 500);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isHome, setMode]);

  // Handle orb click - trigger animation
  const handleOrbClick = () => {
    // Animate to 50% progress over 1 second
    const startProgress = scrollProgress;
    const targetProgress = 0.5;
    const duration = 1000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = t * (2 - t); // easeOut
      const newProgress = startProgress + (targetProgress - startProgress) * eased;
      
      setScrollProgress(newProgress);
      accumulatedScrollRef.current = newProgress * 1000;
      
      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  // ============================================================
  // SCROLL-DRIVEN ANIMATION CALCULATIONS
  // ============================================================
  // Phase 1 (0-0.4): Text on right, Orb on left, orb curves to center
  // Phase 2 (0.4-0.6): Orb in center, introduction appears
  // Phase 3 (0.6-1.0): Everything moves up, entering space
  
  // Orb position: starts left, curves to center
  const orbX = scrollProgress < 0.4
    ? 35 - (scrollProgress / 0.4) * 35  // 35% → 0% (right to center)
    : 0;
  
  // Orb Y position: stays centered, then moves up
  const orbY = scrollProgress < 0.6
    ? 0
    : -((scrollProgress - 0.6) / 0.4) * 150; // 0 → -150% (moves up)
  
  // Orb scale: grows to medium then stays
  const orbScale = scrollProgress < 0.4
    ? 0.8 + (scrollProgress / 0.4) * 0.4  // 0.8 → 1.2
    : scrollProgress < 0.6
      ? 1.2
      : 1.2 - ((scrollProgress - 0.6) / 0.4) * 0.5; // Shrinks as it moves up
  
  // Initial text (HI THERE, I'M SAGAR) - fades out as orb moves
  const initialTextOpacity = Math.max(0, 1 - scrollProgress * 2.5);
  
  // Introduction - appears in phase 2
  const introOpacity = scrollProgress < 0.35
    ? 0
    : scrollProgress < 0.5
      ? (scrollProgress - 0.35) / 0.15  // Fade in
      : scrollProgress < 0.7
        ? 1
        : Math.max(0, 1 - ((scrollProgress - 0.7) / 0.3)); // Fade out
  
  // Introduction Y position
  const introY = scrollProgress < 0.35
    ? 30
    : scrollProgress < 0.5
      ? 30 - ((scrollProgress - 0.35) / 0.15) * 30
      : scrollProgress < 0.6
        ? 0
        : -((scrollProgress - 0.6) / 0.4) * 150;
  
  // Stars parallax
  const starOffset = scrollProgress * 80;
  
  // Whole container moves up at the end
  const containerY = scrollProgress > 0.6 
    ? -((scrollProgress - 0.6) / 0.4) * 100  // -100vh
    : 0;
  
  // Scroll indicator
  const scrollIndicatorOpacity = Math.max(0, 1 - scrollProgress * 4);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50,
            backgroundColor: '#050510',
            pointerEvents: 'auto',
            overflow: 'hidden',
            transform: `translateY(${containerY}vh)`,
            transition: 'transform 0.4s cubic-bezier(0.33, 1, 0.68, 1)'
          }}
        >
          {/* STAR FIELD */}
          <div style={{
            position: 'absolute',
            inset: 0,
            transform: `translateY(${-starOffset}px)`
          }}>
            {stars.map(star => (
              <div
                key={star.id}
                style={{
                  position: 'absolute',
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  borderRadius: '50%',
                  backgroundColor: `rgba(200, 220, 255, ${star.opacity})`,
                  transform: `translateY(${starOffset * star.depth * 0.3}px)`,
                  boxShadow: star.size > 1.5 ? `0 0 ${star.size * 2}px rgba(200, 220, 255, 0.3)` : 'none'
                }}
              />
            ))}
          </div>

          {/* MAIN CONTENT GRID */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gridTemplateRows: isMobile ? '1fr 1fr' : '1fr',
            alignItems: 'center',
            padding: isMobile ? '2rem 1rem' : '0 5%'
          }}>
            {/* LEFT SIDE - INITIAL TEXT (HI THERE, I'M SAGAR) */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: isMobile ? 'center' : 'flex-start',
              textAlign: isMobile ? 'center' : 'left',
              gap: '0.75rem',
              paddingLeft: isMobile ? '0' : '4rem',
              opacity: initialTextOpacity,
              transition: 'opacity 0.4s ease-out',
              order: isMobile ? 2 : 1
            }}>
              {/* Oblique line */}
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 80 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                style={{
                  height: '1px',
                  width: '80px',
                  background: 'linear-gradient(to right, rgba(136, 204, 255, 0.5), transparent)',
                  marginBottom: '1rem',
                  transform: 'rotate(-12deg)',
                  transformOrigin: 'left',
                  display: isMobile ? 'none' : 'block'
                }}
              />

              {/* HI THERE */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{
                  color: '#88ccff',
                  fontSize: '1.125rem',
                  fontFamily: "'SF Mono', 'Fira Code', monospace",
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  margin: 0
                }}
              >
                HI THERE,
              </motion.p>

              {/* I'M SAGAR */}
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                style={{
                  fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                  fontFamily: "'SF Mono', 'Fira Code', monospace",
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'flex-start',
                  gap: '1.5rem'
                }}
              >
                <span style={{ color: '#f0f0f0' }}>I'M</span>
                <span style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(136,204,255,0.6) 30%, rgba(255,255,255,0.4) 60%, rgba(136,204,255,0.8) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 0 30px rgba(136, 204, 255, 0.3)',
                  fontWeight: 700,
                  filter: 'drop-shadow(0 0 15px rgba(136, 204, 255, 0.25))'
                }}>
                  SAGAR
                </span>
              </motion.h1>

              {/* Role */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                style={{
                  color: 'rgba(136, 204, 255, 0.6)',
                  fontSize: 'clamp(1rem, 2vw, 1.4rem)',
                  fontFamily: "'SF Mono', 'Fira Code', monospace",
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginTop: '0.5rem'
                }}
              >
                <AnimatedRole text={roles[roleIndex]} />
              </motion.div>
            </div>

            {/* RIGHT SIDE - ORB (moves to center on scroll) */}
            <div 
              onClick={handleOrbClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: scrollProgress < 0.3 ? 'auto' : 'none',
                cursor: scrollProgress < 0.3 ? 'pointer' : 'default',
                transform: `translateX(${orbX}vw) translateY(${orbY}vh) scale(${orbScale})`,
                transition: 'transform 0.4s cubic-bezier(0.33, 1, 0.68, 1)',
                order: isMobile ? 1 : 2
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                style={{
                  position: 'relative',
                  width: '280px',
                  height: '280px'
                }}
              >
                {/* Planet glow */}
                <div style={{
                  position: 'absolute',
                  inset: '-40%',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(136, 204, 255, 0.12) 0%, transparent 60%)',
                  filter: 'blur(25px)'
                }} />
                
                  {/* Planet body */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  // [OPTIMIZATION] Enhanced Mobile Orb (Depth without Blur)
                  background: isMobile 
                    // Richer mobile gradient: Deep dark blue center -> Lighter blue rim
                    ? 'radial-gradient(circle at 35% 35%, rgba(136, 204, 255, 0.15) 0%, rgba(30, 60, 100, 0.4) 40%, rgba(10, 15, 30, 0.8) 100%)'
                    : 'radial-gradient(circle at 30% 30%, rgba(136, 204, 255, 0.25) 0%, rgba(80, 120, 180, 0.15) 40%, rgba(40, 60, 100, 0.1) 70%, rgba(20, 30, 60, 0.08) 100%)',
                  border: '1px solid rgba(136, 204, 255, 0.15)',
                  boxShadow: isMobile
                    // Fake depth using multiple shadows instead of blur
                    ? 'inset -10px -10px 30px rgba(0,0,0,0.5), inset 5px 5px 15px rgba(136,204,255,0.1), 0 0 25px rgba(136, 204, 255, 0.15)' 
                    : 'inset -15px -15px 50px rgba(0, 0, 0, 0.3), inset 8px 8px 30px rgba(136, 204, 255, 0.08), 0 0 60px rgba(136, 204, 255, 0.1)'
                }} />
                
                {/* Planet rings */}
                <div style={{
                  position: 'absolute',
                  inset: '12%',
                  borderRadius: '50%',
                  border: '1px solid rgba(136, 204, 255, 0.08)'
                }} />
                <div style={{
                  position: 'absolute',
                  inset: '25%',
                  borderRadius: '50%',
                  border: '1px solid rgba(136, 204, 255, 0.05)'
                }} />
                
                {/* Planet highlight */}
                <div style={{
                  position: 'absolute',
                  top: '12%',
                  left: '18%',
                  width: '25%',
                  height: '25%',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, transparent 70%)',
                  filter: 'blur(6px)'
                }} />
                
                {/* INTRO LABEL & ARROW */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: scrollProgress < 0.1 ? 1 : 0, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '-100px',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  {/* Arrow */}
                  <div style={{
                    width: '40px',
                    height: '1px',
                    background: 'rgba(136, 204, 255, 0.6)',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: '0',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '0',
                      height: '0',
                      borderTop: '4px solid transparent',
                      borderBottom: '4px solid transparent',
                      borderRight: '6px solid rgba(136, 204, 255, 0.6)'
                    }} />
                  </div>
                  
                  {/* Text */}
                  <span style={{
                    fontFamily: "'SF Mono', monospace",
                    fontSize: '0.8rem',
                    color: 'rgba(136, 204, 255, 0.8)',
                    letterSpacing: '0.1em',
                    fontWeight: 500
                  }}>
                    INTRO
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* INTRODUCTION SECTION (appears when orb is centered) */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, calc(-50% + ${introY}px))`,
            textAlign: 'center',
            opacity: introOpacity,
            transition: 'opacity 0.4s ease-out, transform 0.4s cubic-bezier(0.33, 1, 0.68, 1)',
            zIndex: 10,
            maxWidth: '600px',
            padding: '0 2rem'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.2rem',
              textAlign: 'center'
            }}>
              <h2 style={{
                color: '#88ccff',
                fontSize: '1rem',
                fontFamily: "'SF Mono', monospace",
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                marginBottom: '0.5rem',
                fontWeight: 600
              }}>
                Let me introduce myself
              </h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 'clamp(0.85rem, 1.4vw, 1rem)',
                fontFamily: "'SF Pro Text', -apple-system, sans-serif",
                lineHeight: 1.6,
                letterSpacing: '0.02em',
                margin: 0
              }}>
                I’m a Software Engineer focused on building reliable, scalable products and meaningful user experiences. Over time, I’ve worked across diverse technologies and developed a strong interest in writing clean, efficient code and designing high-performance systems.
              </p>
              <p style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 'clamp(0.85rem, 1.4vw, 1rem)',
                fontFamily: "'SF Pro Text', -apple-system, sans-serif",
                lineHeight: 1.6,
                letterSpacing: '0.02em',
                margin: 0
              }}>
                I work comfortably across both frontend and backend development, with hands-on experience in JavaScript, C++, Node.js, React, MongoDB, and Java. I enjoy solving real-world problems—whether it’s designing APIs, managing data flow, or building smooth, responsive interfaces.
              </p>
              <p style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 'clamp(0.85rem, 1.4vw, 1rem)',
                fontFamily: "'SF Pro Text', -apple-system, sans-serif",
                lineHeight: 1.6,
                letterSpacing: '0.02em',
                margin: 0
              }}>
                My core interests lie in web application development, scalable backend architectures, and creating systems that are both technically sound and intuitive for users.
              </p>
              <p style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 'clamp(0.85rem, 1.4vw, 1rem)',
                fontFamily: "'SF Pro Text', -apple-system, sans-serif",
                lineHeight: 1.6,
                letterSpacing: '0.02em',
                margin: 0
              }}>
                Whenever possible, I enjoy building modern, production-ready applications using Node.js, React.js, and Next.js, while continuously improving my problem-solving skills through DSA and system-level thinking.
              </p>
            </div>
            <div style={{
              marginTop: '2rem',
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center'
            }}>
              <span style={{
                color: 'rgba(136, 204, 255, 0.8)',
                fontSize: '0.8rem',
                fontFamily: "'SF Mono', monospace",
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                padding: '0.5rem 1rem',
                border: '1px solid rgba(136, 204, 255, 0.3)',
                borderRadius: '20px'
              }}>
                React
              </span>
              <span style={{
                color: 'rgba(136, 204, 255, 0.8)',
                fontSize: '0.8rem',
                fontFamily: "'SF Mono', monospace",
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                padding: '0.5rem 1rem',
                border: '1px solid rgba(136, 204, 255, 0.3)',
                borderRadius: '20px'
              }}>
                Three.js
              </span>
              <span style={{
                color: 'rgba(136, 204, 255, 0.8)',
                fontSize: '0.8rem',
                fontFamily: "'SF Mono', monospace",
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                padding: '0.5rem 1rem',
                border: '1px solid rgba(136, 204, 255, 0.3)',
                borderRadius: '20px'
              }}>
                Node.js
              </span>
            </div>
          </div>

          {/* SCROLL INDICATOR */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: scrollIndicatorOpacity }}
            transition={{ duration: 0.6, delay: 1.5 }}
            style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
              zIndex: 20
            }}
          >
            <div style={{
              width: '1px',
              height: '50px',
              background: 'linear-gradient(180deg, transparent 0%, rgba(136, 204, 255, 0.5) 50%, transparent 100%)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <motion.div
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{
                  width: '100%',
                  height: '25px',
                  background: 'rgba(136, 204, 255, 0.8)'
                }}
              />
            </div>
            <span style={{
              color: 'rgba(255, 255, 255, 0.35)',
              fontSize: '0.65rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              fontWeight: 300
            }}>
              scroll to explore
            </span>
          </motion.div>

          {/* Progress bar */}
          {scrollProgress > 0 && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: `${scrollProgress * 100}%`,
              height: '2px',
              background: 'linear-gradient(90deg, rgba(136, 204, 255, 0.8), rgba(136, 204, 255, 0.2))',
              zIndex: 100
            }} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
