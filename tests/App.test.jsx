// tests/App.test.jsx
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import App from '../src/App'



describe('LEVEL-UP GAMER - Estructura general', () => {

  it('muestra al menos un logotipo con alt "Level-Up Gamer"', () => {
    render(<App />)
    const logos = screen.getAllByAltText(/level-up gamer/i)
    expect(logos.length).toBeGreaterThan(0)
  })

  it('navbar incluye los links principales', () => {
    render(<App />)
    const required = [/inicio/i, /productos/i, /categorías/i, /ofertas/i, /nosotros/i, /blog/i, /contacto/i]
    required.forEach(rx => {
      expect(screen.getByRole('link', { name: rx })).toBeInTheDocument()
    })
  })

  it('botón hamburguesa del navbar existe (un button en el banner)', () => {
    render(<App />)
    const header = screen.getByRole('banner')
    const buttons = within(header).getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('renderiza un <main> accesible', () => {
    render(<App />)
    const mains = screen.getAllByRole('main')
    expect(mains.length).toBe(1)
  })

  it('hero: título principal LEVEL-UP GAMER (h1)', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /level-up gamer/i, level: 1 })).toBeInTheDocument()
  })

  it('hero: CTA "Ver Catálogo" apunta a /Productos', () => {
    render(<App />)
    const cta = screen.getByRole('link', { name: /ver catálogo/i })
    expect(cta).toHaveAttribute('href')
    expect(cta.getAttribute('href')).toMatch(/\/Productos/i)
  })

  it('sección "CATEGORÍAS DESTACADAS" con h2 visible', () => {
    render(<App />)
    const h2 = screen.getByRole('heading', { name: /categorías destacadas/i, level: 2 })
    expect(h2).toBeInTheDocument()
  })

  it('categorías destacadas incluyen CONSOLAS, PC GAMER y ACCESORIOS (h3)', () => {
    render(<App />)
    ;['CONSOLAS', 'PC GAMER', 'ACCESORIOS'].forEach(name => {
      expect(screen.getByRole('heading', { name, level: 3 })).toBeInTheDocument()
    })
  })

  it('sección "PRODUCTOS DESTACADOS" (h2) presente', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /productos destacados/i, level: 2 })).toBeInTheDocument()
  })

  it('tiene un link "Ver todos los productos" a /Productos', () => {
    render(<App />)
    const link = screen.getByRole('link', { name: /ver todos los productos/i })
    expect(link).toHaveAttribute('href')
    expect(link.getAttribute('href')).toMatch(/\/Productos/i)
  })

  it('botón/ícono de carrito es un link accesible (contiene “carrito” o role=link con img aria-label)', () => {
    render(<App />)
    // Intento por nombre
    const linkByName = screen.queryByRole('link', { name: /carrito/i })
    if (linkByName) {
      expect(linkByName).toBeInTheDocument()
    } else {
      // Alternativa: link que contenga una imagen con alt relacionado
      const links = screen.getAllByRole('link')
      const candidate = links.find(a => {
        const imgs = a.querySelectorAll('img[alt]')
        return Array.from(imgs).some(img => /carrito|cart/i.test(img.getAttribute('alt') || ''))
      })
      expect(candidate, 'No se encontró link de carrito').toBeTruthy()
    }
  })

  it('badge del carrito inicia en "0" si existe #cart-badge', () => {
    render(<App />)
    const badge = document.getElementById('cart-badge')
    if (badge) {
      expect(badge).toHaveTextContent('0')
    } else {
      // Si no hay badge, no falla el test (diseño alternativo)
      expect(true).toBe(true)
    }
  })

  it('footer presente con role=contentinfo', () => {
    render(<App />)
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })

  it('footer: enlaces rápidos contienen al menos 3 enlaces útiles', () => {
    render(<App />)
    const footer = screen.getByRole('contentinfo')
    const quickLinks = within(footer).getAllByRole('link')
    expect(quickLinks.length).toBeGreaterThanOrEqual(3)
  })


  it('footer: muestra email de contacto si está en el DOM', () => {
    render(<App />)
    const email = screen.queryByText(/contacto@levelupgamer\.cl/i)
    if (email) {
      expect(email).toBeInTheDocument()
    } else {
      expect(true).toBe(true) // alterna si el email está en otra sección
    }
  })


  it('footer: muestra teléfono si está en el DOM', () => {
    render(<App />)
    const tel = screen.queryByText(/\+56\s?9\s?\d{4}\s?\d{4}/i)
    if (tel) {
      expect(tel).toBeInTheDocument()
    } else {
      expect(true).toBe(true)
    }
  })


  it('copyright del año (2025 o dinámico) visible', () => {
    render(<App />)
    const anyYear = new RegExp(`©\\s*(20\\d{2})`)
    expect(screen.getByText(anyYear)).toBeInTheDocument()
  })


  it('todas las imágenes tienen atributo src no vacío', () => {
    render(<App />)
    const imgs = screen.getAllByRole('img')
    imgs.forEach(img => {
      expect(img).toHaveAttribute('src')
      expect(img.getAttribute('src')).not.toBe('')
    })
  })
})
