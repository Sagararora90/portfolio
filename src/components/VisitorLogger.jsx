import { useEffect } from 'react'
import useMobile from '../hooks/useMobile'

export default function VisitorLogger() {
  const isMobile = useMobile()

  useEffect(() => {
    const logVisit = async () => {
      // Check if we've already logged this session
      if (sessionStorage.getItem('visited_logged')) return

      try {
        // --- 1. GATHER DATA ---
        
        // A. Network Identity (IP, ISP, Location)
        const ipRes = await fetch('https://ipapi.co/json/')
        const data = await ipRes.json()
        
        // B. Hardware Fingerprint (The "Hacker" part)
        // 1. GPU Renderer (High Entropy)
        const getGPU = () => {
          try {
            const canvas = document.createElement('canvas')
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
            return debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown GPU'
          } catch (e) { return 'Unknown GPU' }
        }
        const gpu = getGPU()

        // 2. Connection Info
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
        const connType = connection ? connection.effectiveType : 'Unknown'
        const connSpeed = connection ? `${connection.downlink} Mbps` : 'Unknown'
        
        // 3. System Specs
        const cores = navigator.hardwareConcurrency || 'Unknown'
        const ram = navigator.deviceMemory ? `~${navigator.deviceMemory} GB` : 'Unknown'
        const screenRes = `${window.screen.width}x${window.screen.height}`
        const pixelRatio = window.devicePixelRatio || 1
        
        // 4. Battery (Async)
        let batteryInfo = 'Unknown'
        try {
          if (navigator.getBattery) {
            const battery = await navigator.getBattery()
            const level = Math.round(battery.level * 100) + '%'
            const charging = battery.charging ? '⚡ Charging' : '🔋 Battery'
            batteryInfo = `${level} (${charging})`
          }
        } catch (e) {}

        // 5. Software
        const ua = navigator.userAgent
        const language = navigator.language
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        const platform = navigator.platform

        // --- 2. FORMAT DISCORD MESSAGE (HACKER THEME) ---
        const message = {
          embeds: [{
            title: "⚠️ SYSTEM BREACH DETECTED ⚠️",
            description: `**TARGET IDENTIFIED:** \`${data.ip}\`\n**LOCATION:** ${data.city}, ${data.region}, ${data.country_name}`,
            color: 0xff0000, // CRITICAL RED
            fields: [
              { 
                name: "📡 LEVEL 1: NETWORK IDENTITY", 
                value: `**ISP:** ${data.org}\n**IP:** \`${data.ip}\`\n**Timezone:** ${timeZone}`, 
                inline: false 
              },
              { 
                name: "💻 LEVEL 2: HARDWARE FINGERPRINT", 
                value: `**GPU:** \`${gpu}\`\n**CPU:** ${cores} Cores\n**RAM:** ${ram}\n**Screen:** ${screenRes} (Px Ratio: ${pixelRatio})`, 
                inline: false 
              },
              { 
                name: "🔋 LEVEL 3: STATUS & CONNECTION", 
                value: `**Battery:** ${batteryInfo}\n**Network:** ${connType.toUpperCase()} (${connSpeed})\n**Platform:** ${platform}`, 
                inline: false 
              },
              { 
                name: "🕵️ LEVEL 4: SOFTWARE", 
                value: `**Browser:** ${ua}\n**Language:** ${language}`, 
                inline: false 
              }
            ],
            footer: {
              text: `GHOST ACCESS TERMINAL • ID: ${Math.random().toString(36).substring(7).toUpperCase()}`
            },
            timestamp: new Date().toISOString()
          }]
        }

        // --- 3. SEND WEBHOOK ---
        const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK
        
        if (webhookUrl) {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
          })
          
          sessionStorage.setItem('visited_logged', 'true')
          console.log('Target logged.')
        }

      } catch (error) {
        console.error('Logger Error:', error)
      }
    }

    logVisit()
  }, [])

  return null
}
