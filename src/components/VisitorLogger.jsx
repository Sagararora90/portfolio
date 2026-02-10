import { useEffect } from 'react'
import useMobile from '../hooks/useMobile'

export default function VisitorLogger() {
  const isMobile = useMobile()

  useEffect(() => {
    const logVisit = async () => {
      // Check if we've already logged this session
      if (sessionStorage.getItem('visited_logged')) return

      try {
        // 1. Get Basic Data
        const ipRes = await fetch('https://ipapi.co/json/')
        const data = await ipRes.json()
        
        // 2. Gather Advanced Metrics
        const screenRes = `${window.screen.width}x${window.screen.height}`
        const language = navigator.language || navigator.userLanguage
        const referrer = document.referrer || 'Direct'
        const ua = navigator.userAgent
        
        // Simple User Agent Parser
        let browser = 'Unknown'
        if (ua.indexOf('Firefox') > -1) browser = 'Firefox'
        else if (ua.indexOf('SamsungBrowser') > -1) browser = 'Samsung Internet'
        else if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) browser = 'Opera'
        else if (ua.indexOf('Trident') > -1) browser = 'Internet Explorer'
        else if (ua.indexOf('Edge') > -1) browser = 'Edge'
        else if (ua.indexOf('Chrome') > -1) browser = 'Chrome'
        else if (ua.indexOf('Safari') > -1) browser = 'Safari'

        let os = 'Unknown OS'
        if (ua.indexOf('Win') > -1) os = 'Windows'
        else if (ua.indexOf('Mac') > -1) os = 'MacOS'
        else if (ua.indexOf('Linux') > -1) os = 'Linux'
        else if (ua.indexOf('Android') > -1) os = 'Android'
        else if (ua.indexOf('like Mac') > -1) os = 'iOS'

        const deviceType = isMobile ? 'Mobile' : 'Desktop/Tablet'

        // 3. Format Discord Message
        const message = {
          embeds: [{
            title: `👤 New Visitor - ${deviceType}`,
            color: isMobile ? 0xffa500 : 0x88ccff, // Orange for Mobile, Blue for Desktop
            fields: [
              { name: "🌍 Location", value: `${data.city}, ${data.region}, ${data.country_name}`, inline: true },
              { name: "📡 IP Address", value: data.ip || 'Unknown', inline: true },
              { name: "🏢 ISP", value: data.org || 'Unknown', inline: true },
              
              { name: "💻 System", value: `${os} | ${browser}`, inline: true },
              { name: "📱 Screen", value: screenRes, inline: true },
              { name: "🗣️ Language", value: language, inline: true },
              
              { name: "🔗 Referrer", value: referrer, inline: false },
              { name: "⏰ Time", value: new Date().toLocaleString(), inline: false },
            ],
            footer: {
              text: `Ghost AI Logger • ${navigator.userAgent.substring(0, 100)}...`
            },
            timestamp: new Date().toISOString()
          }]
        }

        // 4. Send to Discord
        const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK
        
        if (webhookUrl) {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
          })
          
          sessionStorage.setItem('visited_logged', 'true')
          console.log('Visitor logged successfully.')
        } else {
          console.warn('VisitorLogger: No VITE_DISCORD_WEBHOOK configured.')
          console.log('Visitor Data:', { data, os, browser, screenRes })
        }

      } catch (error) {
        console.error('VisitorLogger Error:', error)
      }
    }

    logVisit()
  }, [])

  return null
}
