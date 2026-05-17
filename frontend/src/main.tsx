import React from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import App from './App'

// Apply the saved theme before React mounts so we avoid a light-to-dark flash.
const stored = localStorage.getItem('theme')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
if (stored === 'dark' || (stored !== 'light' && prefersDark)) {
    document.documentElement.classList.add('dark')
}

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
)
