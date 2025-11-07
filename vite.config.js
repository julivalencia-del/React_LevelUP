import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Esto evita tener que importar 'it', 'describe', 'expect' en cada archivo.
    environment: 'jsdom', // Indica que se use JSDOM para simular el navegador.
    setupFiles: ['./src/setup.js'], // Un archivo que se ejecuta antes de todas las pruebas.
    coverage: { // Configuración opcional para reportes de cobertura
      enabled: true,
      provider: 'v8',
      reporter: ['html', 'json', 'text']
    }
  }
})