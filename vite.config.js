import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/computer_vision_tutorials/", // Replace with your exact repository name
})
