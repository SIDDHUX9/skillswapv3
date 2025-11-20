'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'ar' | 'hi'

export interface AccessibilitySettings {
  highContrast: boolean
  fontSize: 'small' | 'medium' | 'large' | 'extra-large'
  reducedMotion: boolean
  voiceNavigation: boolean
  screenReader: boolean
  language: Language
  keyboardNavigation: boolean
  focusVisible: boolean
}

interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSettings: (updates: Partial<AccessibilitySettings>) => void
  t: (key: string) => string
  speak: (text: string) => void
  stopSpeaking: () => void
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  fontSize: 'medium',
  reducedMotion: false,
  voiceNavigation: false,
  screenReader: false,
  language: 'en',
  keyboardNavigation: true,
  focusVisible: true,
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.skills': 'Skills',
    'nav.profile': 'Profile',
    'nav.bookings': 'My Bookings',
    'nav.messages': 'Messages',
    
    // Common actions
    'action.book': 'Book',
    'action.cancel': 'Cancel',
    'action.save': 'Save',
    'action.edit': 'Edit',
    'action.delete': 'Delete',
    'action.search': 'Search',
    'action.filter': 'Filter',
    'action.share': 'Share',
    
    // Skill sharing
    'skill.title': 'Skill Sharing',
    'skill.description': 'Share your skills and learn from others',
    'skill.category': 'Category',
    'skill.instructor': 'Instructor',
    'skill.duration': 'Duration',
    'skill.credits': 'Credits',
    'skill.level': 'Level',
    'skill.location': 'Location',
    
    // Booking
    'booking.title': 'Book Skill Session',
    'booking.success': 'Booking successful!',
    'booking.failed': 'Booking failed',
    'booking.date': 'Date',
    'booking.time': 'Time',
    
    // Profile
    'profile.title': 'Profile',
    'profile.name': 'Name',
    'profile.email': 'Email',
    'profile.bio': 'Bio',
    'profile.skills': 'My Skills',
    'profile.credits': 'Credits',
    
    // Accessibility
    'accessibility.title': 'Accessibility',
    'accessibility.highContrast': 'High Contrast',
    'accessibility.fontSize': 'Font Size',
    'accessibility.voiceNavigation': 'Voice Navigation',
    'accessibility.language': 'Language',
    
    // Messages
    'message.title': 'Messages',
    'message.type': 'Type a message...',
    'message.send': 'Send',
    
    // Ratings
    'rating.title': 'Rating',
    'rating.review': 'Review',
    'rating.testimonial': 'Testimonial',
    
    // Location
    'location.nearby': 'Nearby Skills',
    'location.radius': 'Search Radius',
    'location.distance': 'Distance',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.skills': 'Habilidades',
    'nav.profile': 'Perfil',
    'nav.bookings': 'Mis Reservas',
    'nav.messages': 'Mensajes',
    
    // Common actions
    'action.book': 'Reservar',
    'action.cancel': 'Cancelar',
    'action.save': 'Guardar',
    'action.edit': 'Editar',
    'action.delete': 'Eliminar',
    'action.search': 'Buscar',
    'action.filter': 'Filtrar',
    'action.share': 'Compartir',
    
    // Skill sharing
    'skill.title': 'Intercambio de Habilidades',
    'skill.description': 'Comparte tus habilidades y aprende de otros',
    'skill.category': 'Categoría',
    'skill.instructor': 'Instructor',
    'skill.duration': 'Duración',
    'skill.credits': 'Créditos',
    'skill.level': 'Nivel',
    'skill.location': 'Ubicación',
    
    // Booking
    'booking.title': 'Reservar Sesión de Habilidad',
    'booking.success': '¡Reserva exitosa!',
    'booking.failed': 'Reserva fallida',
    'booking.date': 'Fecha',
    'booking.time': 'Hora',
    
    // Profile
    'profile.title': 'Perfil',
    'profile.name': 'Nombre',
    'profile.email': 'Correo',
    'profile.bio': 'Biografía',
    'profile.skills': 'Mis Habilidades',
    'profile.credits': 'Créditos',
    
    // Accessibility
    'accessibility.title': 'Accesibilidad',
    'accessibility.highContrast': 'Alto Contraste',
    'accessibility.fontSize': 'Tamaño de Fuente',
    'accessibility.voiceNavigation': 'Navegación por Voz',
    'accessibility.language': 'Idioma',
    
    // Messages
    'message.title': 'Mensajes',
    'message.type': 'Escribe un mensaje...',
    'message.send': 'Enviar',
    
    // Ratings
    'rating.title': 'Calificación',
    'rating.review': 'Reseña',
    'rating.testimonial': 'Testimonio',
    
    // Location
    'location.nearby': 'Habilidades Cercanas',
    'location.radius': 'Radio de Búsqueda',
    'location.distance': 'Distancia',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.skills': 'Compétences',
    'nav.profile': 'Profil',
    'nav.bookings': 'Mes Réservations',
    'nav.messages': 'Messages',
    'action.book': 'Réserver',
    'action.cancel': 'Annuler',
    'action.save': 'Sauvegarder',
    'skill.title': 'Partage de Compétences',
    'skill.description': 'Partagez vos compétences et apprenez des autres',
    'accessibility.title': 'Accessibilité',
    'accessibility.highContrast': 'Contraste Élevé',
    'accessibility.fontSize': 'Taille de Police',
    'accessibility.voiceNavigation': 'Navigation Vocale',
    'accessibility.language': 'Langue',
  },
  de: {
    'nav.home': 'Startseite',
    'nav.skills': 'Fähigkeiten',
    'nav.profile': 'Profil',
    'nav.bookings': 'Meine Buchungen',
    'nav.messages': 'Nachrichten',
    'action.book': 'Buchen',
    'action.cancel': 'Abbrechen',
    'action.save': 'Speichern',
    'skill.title': 'Fähigkeitenaustausch',
    'skill.description': 'Teilen Sie Ihre Fähigkeiten und lernen Sie von anderen',
    'accessibility.title': 'Barrierefreiheit',
    'accessibility.highContrast': 'Hoher Kontrast',
    'accessibility.fontSize': 'Schriftgröße',
    'accessibility.voiceNavigation': 'Sprachnavigation',
    'accessibility.language': 'Sprache',
  },
  zh: {
    'nav.home': '首页',
    'nav.skills': '技能',
    'nav.profile': '个人资料',
    'nav.bookings': '我的预订',
    'nav.messages': '消息',
    'action.book': '预订',
    'action.cancel': '取消',
    'action.save': '保存',
    'skill.title': '技能分享',
    'skill.description': '分享您的技能并向他人学习',
    'accessibility.title': '无障碍',
    'accessibility.highContrast': '高对比度',
    'accessibility.fontSize': '字体大小',
    'accessibility.voiceNavigation': '语音导航',
    'accessibility.language': '语言',
  },
  ja: {
    'nav.home': 'ホーム',
    'nav.skills': 'スキル',
    'nav.profile': 'プロフィール',
    'nav.bookings': 'マイ予約',
    'nav.messages': 'メッセージ',
    'action.book': '予約',
    'action.cancel': 'キャンセル',
    'action.save': '保存',
    'skill.title': 'スキルシェアリング',
    'skill.description': 'スキルを共有し、他の人から学びましょう',
    'accessibility.title': 'アクセシビリティ',
    'accessibility.highContrast': 'ハイコントラスト',
    'accessibility.fontSize': 'フォントサイズ',
    'accessibility.voiceNavigation': '音声ナビゲーション',
    'accessibility.language': '言語',
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.skills': 'المهارات',
    'nav.profile': 'الملف الشخصي',
    'nav.bookings': 'حجوزاتي',
    'nav.messages': 'الرسائل',
    'action.book': 'احجز',
    'action.cancel': 'إلغاء',
    'action.save': 'حفظ',
    'skill.title': 'مشاركة المهارات',
    'skill.description': 'شارك مهاراتك وتعلم من الآخرين',
    'accessibility.title': 'إمكانية الوصول',
    'accessibility.highContrast': 'تباين عالي',
    'accessibility.fontSize': 'حجم الخط',
    'accessibility.voiceNavigation': 'التنقل الصوتي',
    'accessibility.language': 'اللغة',
  },
  hi: {
    'nav.home': 'होम',
    'nav.skills': 'कौशल',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.bookings': 'मेरी बुकिंग्स',
    'nav.messages': 'संदेश',
    'action.book': 'बुक करें',
    'action.cancel': 'रद्द करें',
    'action.save': 'सेव करें',
    'skill.title': 'कौशल साझाकरण',
    'skill.description': 'अपने कौशल साझा करें और दूसरों से सीखें',
    'accessibility.title': 'पहुंच',
    'accessibility.highContrast': 'उच्च कंट्रास्ट',
    'accessibility.fontSize': 'फ़ॉन्ट आकार',
    'accessibility.voiceNavigation': 'आवाज़ नेविगेशन',
    'accessibility.language': 'भाषा',
  },
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null)

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('accessibility-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.error('Failed to load accessibility settings:', error)
      }
    }

    // Initialize speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis)
    }

    // Apply settings to document
    applySettingsToDocument(settings)
  }, [])

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings))
    
    // Apply settings to document
    applySettingsToDocument(settings)
  }, [settings])

  const applySettingsToDocument = (currentSettings: AccessibilitySettings) => {
    const root = document.documentElement
    
    // High contrast
    if (currentSettings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }
    
    // Font size
    root.classList.remove('text-small', 'text-medium', 'text-large', 'text-extra-large')
    root.classList.add(`text-${currentSettings.fontSize}`)
    
    // Reduced motion
    if (currentSettings.reducedMotion) {
      root.style.setProperty('--motion-duration', '0s')
    } else {
      root.style.removeProperty('--motion-duration')
    }
    
    // Focus visible
    if (currentSettings.focusVisible) {
      root.classList.add('focus-visible-enabled')
    } else {
      root.classList.remove('focus-visible-enabled')
    }
    
    // Set lang attribute
    root.lang = currentSettings.language
  }

  const updateSettings = (updates: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...updates }))
  }

  const t = (key: string): string => {
    return translations[settings.language][key] || translations['en'][key] || key
  }

  const speak = (text: string) => {
    if (!speechSynthesis || !settings.voiceNavigation) return
    
    // Cancel any ongoing speech
    speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = settings.language
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1
    
    speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel()
    }
  }

  return (
    <AccessibilityContext.Provider value={{
      settings,
      updateSettings,
      t,
      speak,
      stopSpeaking,
    }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}