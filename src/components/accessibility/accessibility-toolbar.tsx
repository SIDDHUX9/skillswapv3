'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Eye, EyeOff, Type, Minus, Plus } from 'lucide-react'

export function AccessibilityToolbar() {
  const [highContrast, setHighContrast] = useState(false)
  const [largeText, setLargeText] = useState(false)
  const [showToolbar, setShowToolbar] = useState(false)

  const toggleHighContrast = () => {
    setHighContrast(!highContrast)
    if (!highContrast) {
      document.body.classList.add('high-contrast')
    } else {
      document.body.classList.remove('high-contrast')
    }
  }

  const toggleLargeText = () => {
    setLargeText(!largeText)
    if (!largeText) {
      document.body.classList.add('large-text')
    } else {
      document.body.classList.remove('large-text')
    }
  }

  const increaseTextSize = () => {
    const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
    document.documentElement.style.fontSize = `${Math.min(currentSize + 2, 24)}px`
  }

  const decreaseTextSize = () => {
    const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
    document.documentElement.style.fontSize = `${Math.max(currentSize - 2, 12)}px`
  }

  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowToolbar(!showToolbar)}
        className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 p-0"
        aria-label="Toggle accessibility options"
      >
        <Eye className="w-5 h-5" />
      </Button>

      {/* Accessibility Toolbar */}
      {showToolbar && (
        <Card className="fixed bottom-20 right-4 z-50 w-64 shadow-lg">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 text-sm">Accessibility Options</h3>
            
            <div className="space-y-3">
              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <span className="text-sm">High Contrast</span>
                <Button
                  variant={highContrast ? "default" : "outline"}
                  size="sm"
                  onClick={toggleHighContrast}
                  aria-label="Toggle high contrast mode"
                >
                  {highContrast ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>

              {/* Large Text */}
              <div className="flex items-center justify-between">
                <span className="text-sm">Large Text</span>
                <Button
                  variant={largeText ? "default" : "outline"}
                  size="sm"
                  onClick={toggleLargeText}
                  aria-label="Toggle large text mode"
                >
                  <Type className="w-4 h-4" />
                </Button>
              </div>

              {/* Text Size Controls */}
              <div className="flex items-center justify-between">
                <span className="text-sm">Text Size</span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={decreaseTextSize}
                    aria-label="Decrease text size"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={increaseTextSize}
                    aria-label="Increase text size"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t text-xs text-muted-foreground">
              Keyboard shortcuts available:
              <br />
              • Alt + H: High contrast
              <br />
              • Alt + L: Large text
              <br />
              • Alt + Plus: Increase text
              <br />
              • Alt + Minus: Decrease text
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}