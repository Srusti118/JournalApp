import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})

//JSX compilation : Transforms React JSX syntax into browser-executable JavaScript.
//Fast Refresh: Enables Hot Module Replacement (HMR) to update code changes instantly in the browser.