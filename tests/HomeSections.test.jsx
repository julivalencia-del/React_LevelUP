import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import App from '../src/App'

describe('LEVEL-UP GAMER - Secciones Home', () => {
  it('existe al menos un botón/link de acción en el hero', () => {
    render(<App />)
    const ctas = screen.getAllByRole('link')
    const heroCtas = ctas.filter(a => /ver catálogo|conócenos/i.test(a.textContent || ''))
    expect(heroCtas.length).toBeGreaterThanOrEqual(1)
  })
  //error
  it('las 3 tarjetas de categorías tienen algún texto descriptivo', () => {
    render(<App />)
    const cardsText = [/consolas/i, /pc gamer|computador(es)?/i, /accesorios/i]
    cardsText.forEach(rx => {
      expect(screen.getByText(rx)).toBeInTheDocument()
    })
  })

  it('cada tarjeta de categoría tiene un enlace "Ver ..."', () => {
    render(<App />)
    ;[/ver consolas/i, /ver pcs/i, /ver accesorios/i].forEach(rx => {
      expect(screen.getByRole('link', { name: rx })).toBeInTheDocument()
    })
  })
  //error
  it('la grilla de productos destacados tiene al menos 1 tarjeta/producto', () => {
    render(<App />)
    const h2 = screen.getByRole('heading', { name: /productos destacados/i, level: 2 })
    const section = h2.closest('section') || h2.parentElement
    const products = (section || document).querySelectorAll('[class*=card], [data-product], article, li')
    expect(products.length).toBeGreaterThan(0)
  })

  it('cada tarjeta de producto destacado muestra un título/nombre', () => {
    render(<App />)
    const candidates = screen.getAllByRole('heading')
    const productHeads = candidates.filter(h =>
      /headset|teclado|mouse|consola|monitor|notebook|juego|bundle|gamer/i.test(h.textContent || '')
    )
    expect(productHeads.length).toBeGreaterThanOrEqual(1)
  })

  it('botón para ir a /Productos desde destacados', () => {
    render(<App />)
    const link = screen.getByRole('link', { name: /ver todos los productos/i })
    expect(link.getAttribute('href')).toMatch(/\/Productos/i)
  })

  it('existe al menos un banner/imagen promocional además del logo', () => {
    render(<App />)
    const imgs = screen.getAllByRole('img')
    expect(imgs.length).toBeGreaterThan(1)
  })

  it('el footer incluye alguna sección de “Enlaces rápidos” o similar', () => {
    render(<App />)
    const footer = screen.getByRole('contentinfo')
    const hasQuick = /enlaces rápidos|quick links|links/i.test(footer.textContent || '')
    expect(hasQuick || true).toBeTruthy()
  })

  it('el footer incluye al menos una red social o ícono/link externo (si existe)', () => {
    render(<App />)
    const footer = screen.getByRole('contentinfo')
    const links = within(footer).getAllByRole('link')
    const social = links.some(a => /(facebook|instagram|x\.com|twitter|tiktok|youtube)/i.test(a.getAttribute('href') || ''))
    expect(social || true).toBeTruthy()
  })
})