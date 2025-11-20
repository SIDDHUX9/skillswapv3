'use client'

import { useEffect } from 'react'

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + H: Toggle high contrast
      if (event.altKey && event.key === 'h') {
        event.preventDefault()
        const body = document.body
        if (body.classList.contains('high-contrast')) {
          body.classList.remove('high-contrast')
        } else {
          body.classList.add('high-contrast')
        }
      }

      // Alt + L: Toggle large text
      if (event.altKey && event.key === 'l') {
        event.preventDefault()
        const body = document.body
        if (body.classList.contains('large-text')) {
          body.classList.remove('large-text')
        } else {
          body.classList.add('large-text')
        }
      }

      // Alt + Plus: Increase text size
      if (event.altKey && (event.key === '+' || event.key === '=')) {
        event.preventDefault()
        const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
        document.documentElement.style.fontSize = `${Math.min(currentSize + 2, 24)}px`
      }

      // Alt + Minus: Decrease text size
      if (event.altKey && event.key === '-') {
        event.preventDefault()
        const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
        document.documentElement.style.fontSize = `${Math.max(currentSize - 2, 12)}px`
      }

      // Escape: Close modals and dialogs
      if (event.key === 'Escape') {
        const modals = document.querySelectorAll('[role="dialog"]')
        modals.forEach(modal => {
          const closeButton = modal.querySelector('button[aria-label*="Close"], button[aria-label*="cancel"]')
          if (closeButton) {
            ;(closeButton as HTMLElement).click()
          }
        })
      }

      // Tab: Enhanced focus management
      if (event.key === 'Tab') {
        // Add focus styles for better keyboard navigation
        document.body.classList.add('keyboard-navigation')
      }

      // Mouse events: Remove keyboard navigation class
      const handleMouseDown = () => {
        document.body.classList.remove('keyboard-navigation')
      }

      document.addEventListener('mousedown', handleMouseDown)

      return () => {
        document.removeEventListener('mousedown', handleMouseDown)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
}