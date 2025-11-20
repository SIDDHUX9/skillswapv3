'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { 
  Accessibility, 
  Volume2, 
  Eye, 
  Type, 
  Globe, 
  Monitor,
  Keyboard,
  Zap,
  Moon,
  Sun
} from 'lucide-react'
import { useAccessibility } from '@/contexts/accessibility-context'

export function AccessibilitySettings() {
  const { settings, updateSettings, t, speak } = useAccessibility()
  const [isOpen, setIsOpen] = useState(false)

  const handleSpeak = (text: string) => {
    if (settings.voiceNavigation) {
      speak(text)
    }
  }

  const fontSizeOptions = [
    { value: 'small', label: 'Small', class: 'text-sm' },
    { value: 'medium', label: 'Medium', class: 'text-base' },
    { value: 'large', label: 'Large', class: 'text-lg' },
    { value: 'extra-large', label: 'Extra Large', class: 'text-xl' },
  ]

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'zh', label: '中文' },
    { value: 'ja', label: '日本語' },
    { value: 'ar', label: 'العربية' },
    { value: 'hi', label: 'हिन्दी' },
  ]

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
        onMouseEnter={() => handleSpeak(t('accessibility.title'))}
      >
        <Accessibility className="h-4 w-4" />
        <span className="hidden sm:inline">{t('accessibility.title')}</span>
        {settings.highContrast && <Badge variant="secondary">HC</Badge>}
        {settings.voiceNavigation && <Badge variant="secondary">Voice</Badge>}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-full mt-2 w-96 z-50 max-h-96 overflow-y-auto">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Accessibility className="h-5 w-5" />
              {t('accessibility.title')}
            </CardTitle>
            <CardDescription>
              Customize your accessibility preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.highContrast ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <div>
                  <Label htmlFor="high-contrast">{t('accessibility.highContrast')}</Label>
                  <p className="text-xs text-muted-foreground">Increase color contrast</p>
                </div>
              </div>
              <Switch
                id="high-contrast"
                checked={settings.highContrast}
                onCheckedChange={(checked) => {
                  updateSettings({ highContrast: checked })
                  handleSpeak(checked ? 'High contrast enabled' : 'High contrast disabled')
                }}
              />
            </div>

            {/* Font Size */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                <Label>{t('accessibility.fontSize')}</Label>
              </div>
              <Select
                value={settings.fontSize}
                onValueChange={(value: any) => {
                  updateSettings({ fontSize: value })
                  handleSpeak(`Font size set to ${value}`)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontSizeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className={option.class}>{option.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Voice Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <div>
                  <Label htmlFor="voice-navigation">{t('accessibility.voiceNavigation')}</Label>
                  <p className="text-xs text-muted-foreground">Spoken feedback for actions</p>
                </div>
              </div>
              <Switch
                id="voice-navigation"
                checked={settings.voiceNavigation}
                onCheckedChange={(checked) => {
                  updateSettings({ voiceNavigation: checked })
                  if (checked) {
                    speak('Voice navigation enabled')
                  }
                }}
              />
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <div>
                  <Label htmlFor="reduced-motion">Reduced Motion</Label>
                  <p className="text-xs text-muted-foreground">Minimize animations</p>
                </div>
              </div>
              <Switch
                id="reduced-motion"
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => {
                  updateSettings({ reducedMotion: checked })
                  handleSpeak(checked ? 'Reduced motion enabled' : 'Reduced motion disabled')
                }}
              />
            </div>

            {/* Screen Reader */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                <div>
                  <Label htmlFor="screen-reader">Screen Reader Mode</Label>
                  <p className="text-xs text-muted-foreground">Optimize for screen readers</p>
                </div>
              </div>
              <Switch
                id="screen-reader"
                checked={settings.screenReader}
                onCheckedChange={(checked) => {
                  updateSettings({ screenReader: checked })
                  handleSpeak(checked ? 'Screen reader mode enabled' : 'Screen reader mode disabled')
                }}
              />
            </div>

            {/* Keyboard Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Keyboard className="h-4 w-4" />
                <div>
                  <Label htmlFor="keyboard-nav">Keyboard Navigation</Label>
                  <p className="text-xs text-muted-foreground">Enhanced keyboard support</p>
                </div>
              </div>
              <Switch
                id="keyboard-nav"
                checked={settings.keyboardNavigation}
                onCheckedChange={(checked) => {
                  updateSettings({ keyboardNavigation: checked })
                  handleSpeak(checked ? 'Keyboard navigation enabled' : 'Keyboard navigation disabled')
                }}
              />
            </div>

            {/* Language */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <Label>{t('accessibility.language')}</Label>
              </div>
              <Select
                value={settings.language}
                onValueChange={(value: any) => {
                  updateSettings({ language: value })
                  handleSpeak(`Language changed to ${languageOptions.find(opt => opt.value === value)?.label}`)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updateSettings({
                      highContrast: false,
                      fontSize: 'medium',
                      reducedMotion: false,
                      voiceNavigation: false,
                      screenReader: false,
                      language: 'en',
                      keyboardNavigation: true,
                      focusVisible: true,
                    })
                    handleSpeak('Accessibility settings reset to default')
                  }}
                >
                  Reset to Default
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updateSettings({
                      highContrast: true,
                      fontSize: 'large',
                      reducedMotion: true,
                      voiceNavigation: true,
                      screenReader: true,
                      keyboardNavigation: true,
                      focusVisible: true,
                    })
                    handleSpeak('Maximum accessibility enabled')
                  }}
                >
                  Max Accessibility
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}