"use client"

import { useState, useEffect, useRef } from "react"

export const HeartbeatEffect = ({ heat = 5 }: { heat: number }) => {
  const [numBars, setNumBars] = useState(10)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        // Calculate numBars based on width, assuming each bar takes about 20px
        setNumBars(Math.max(1, Math.floor(width / 10)))
      }
    }

    if (containerRef.current) {
      const observer = new ResizeObserver(handleResize)
      observer.observe(containerRef.current)

      // Initial call to set numBars based on current size
      handleResize()

      return () => {
        observer.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    // Start effect
    const render = () => {
      const t = Date.now() / 1000 * (heat + 3)
      const amp = Math.sqrt(heat) * 5 + 3
      const l = Math.sqrt(heat) / 6

      const elements = document.querySelectorAll<HTMLElement>("[data-heartbeat-idx]")
      elements.forEach((element) => {
        const idx = element.getAttribute("data-heartbeat-idx")
        if (idx) {
          const i = parseInt(idx)
          let v = (Math.sin(l / 2 * (t + i))) * (amp + 8)
          v += (Math.sin(l * 0.71361 * (t * 1.5 + i))) * (amp + 2)
          v += (Math.sin(l * 0.51361 * (t * 2.5 + i * 4.0))) * (amp / 2)
          v += (Math.sin(l * 2.46141 * (-t * 2.5 + i * 2.0))) * (amp / 3)
          v = Math.abs(v) * (amp * 0.05 + 1.1)
          element.style.height = `${v}px`
        }
      })

      requestAnimationFrame(render)
    }

    render()
  }, [numBars, heat])

  return (
    <div className="relative flex flex-1">
      <div ref={containerRef} className="absolute flex h-full w-full items-center justify-between">
        {Array.from({ length: numBars }).map((_, i) => {
          const s1 = Math.ceil((Math.random()) * 3)
          const s2 = Math.ceil((Math.random()) * 3)
          const lineW = Math.round(Math.random() * 1) + 1
          return (
            <div key={i}>
              <div
                data-heartbeat-idx={i}
                className={`h-4 bg-primary flex flex-col items-center justify-between`}
                style={{ width: `${lineW}px` }}
              >
                <div className={`bg-foreground rounded-full`} style={{ height: `${s1}px`, width: `${s1}px` }}/>
                <div className={`bg-foreground rounded-full`} style={{ height: `${s2}px`, width: `${s2}px` }}/>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}