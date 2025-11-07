import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

const CartContext = React.createContext()

function withCart(ui, value) {
  return <CartContext.Provider value={value}>{ui}</CartContext.Provider>
}

// Mocks de datos
const sampleItem = { id: 'p1', title: 'Producto 1', price: 10000 }
const anotherItem = { id: 'p2', title: 'Producto 2', price: 5000 }

function Carrito() {
  const { items, inc, dec, remove, clear } = React.useContext(CartContext)
  const subtotal = items.reduce((acc, it) => acc + it.price * it.qty, 0)
  return (
    <div>
      <h1>Carrito</h1>
      {items.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <ul aria-label="lista-carrito">
          {items.map(it => (
            <li key={it.id}>
              <span>{it.title}</span>
              <span aria-label={`qty-${it.id}`}>{it.qty}</span>
              <button aria-label={`inc-${it.id}`} onClick={() => inc(it.id)}>+</button>
              <button aria-label={`dec-${it.id}`} onClick={() => dec(it.id)}>-</button>
              <button aria-label={`rm-${it.id}`} onClick={() => remove(it.id)}>Eliminar</button>
              <span aria-label={`price-${it.id}`}>{it.price * it.qty}</span>
            </li>
          ))}
        </ul>
      )}
      <div aria-label="subtotal">{subtotal}</div>
      <button aria-label="clear" onClick={clear}>Vaciar</button>
      <button aria-label="checkout" disabled={items.length === 0}>Pagar</button>
    </div>
  )
}

// Helpers del “store” simulado
let state
let api
function setup(items = []) {
  state = { items: items.map(it => ({ ...it, qty: it.qty ?? 1 })) }
  api = {
    get items() { return state.items },
    inc: vi.fn((id) => {
      state.items = state.items.map(it => it.id === id ? { ...it, qty: it.qty + 1 } : it)
    }),
    dec: vi.fn((id) => {
      state.items = state.items.map(it => it.id === id ? { ...it, qty: Math.max(1, it.qty - 1) } : it)
    }),
    remove: vi.fn((id) => {
      state.items = state.items.filter(it => it.id !== id)
    }),
    clear: vi.fn(() => { state.items = [] }),
  }
  return { state, api }
}

function renderCart(items = []) {
  const { api } = setup(items)
  render(withCart(<Carrito />, api))
  return api
}

describe('Carrito - tests base', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('2) renderiza items y cantidades', () => {
    renderCart([{ ...sampleItem, qty: 2 }])
    expect(screen.getByLabelText('lista-carrito')).toBeInTheDocument()
    expect(screen.getByText('Producto 1')).toBeInTheDocument()
    expect(screen.getByLabelText('qty-p1').textContent).toBe('2')
  })

  it('3) incrementa cantidad', () => {
    const api = renderCart([{ ...sampleItem, qty: 1 }])
    fireEvent.click(screen.getByLabelText('inc-p1'))
    expect(api.inc).toHaveBeenCalledWith('p1')
  })

  it('4) decrementa cantidad (no baja de 1)', () => {
    const api = renderCart([{ ...sampleItem, qty: 1 }])
    fireEvent.click(screen.getByLabelText('dec-p1'))
    expect(api.dec).toHaveBeenCalledWith('p1')
    expect(screen.getByLabelText('qty-p1').textContent).toBe('1')
  })

  it('5) elimina item', () => {
    const api = renderCart([{ ...sampleItem, qty: 1 }])
    fireEvent.click(screen.getByLabelText('rm-p1'))
    expect(api.remove).toHaveBeenCalledWith('p1')
  })

  it('6) calcula subtotal correctamente', () => {
    renderCart([{ ...sampleItem, qty: 2 }, { ...anotherItem, qty: 3 }])
    expect(screen.getByLabelText('subtotal').textContent).toBe(String(2 * 10000 + 3 * 5000))
  })

  it('7) vacía el carrito', () => {
    const api = renderCart([{ ...sampleItem, qty: 2 }])
    fireEvent.click(screen.getByLabelText('clear'))
    expect(api.clear).toHaveBeenCalled()
  })
  //error 
  it('8) habilita/deshabilita botón de pagar', () => {
    renderCart([])
    expect(screen.getByLabelText('checkout')).toBeDisabled()
    renderCart([{ ...sampleItem, qty: 1 }])
    expect(screen.getByLabelText('checkout')).not.toBeDisabled()
  })
})