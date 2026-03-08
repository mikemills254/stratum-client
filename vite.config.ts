import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss() as PluginOption,
    react({
      babel: { plugins: [['babel-plugin-react-compiler']] },
    }) as PluginOption,
  ],
})