'use client'

import { useEffect, useState } from 'react'

type Theme = 'system' | 'light' | 'dark'
const themes: Theme[] = ['system', 'light', 'dark']

function applyTheme(theme: Theme) {
  if (theme === 'system') {
    document.documentElement.removeAttribute('data-theme')
    localStorage.removeItem('theme')
    return
  }

  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system')

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    const initialTheme: Theme = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'system'
    setTheme(initialTheme)
    applyTheme(initialTheme)
  }, [])

  return (
    <div className="theme-toggle" role="radiogroup" aria-label="Color theme">
      {themes.map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={theme === option}
          className={theme === option ? 'theme-option active' : 'theme-option'}
          onClick={() => {
            setTheme(option)
            applyTheme(option)
          }}
        >
          {option[0].toUpperCase() + option.slice(1)}
        </button>
      ))}
    </div>
  )
}
