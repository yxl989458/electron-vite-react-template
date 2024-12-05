import { useState } from 'react'
import './menu.css'

function Menu() {
  const [activeItem, setActiveItem] = useState('index')

  const menuItems = [
    { id: 'index', icon: '⌂', label: 'Index' },
    { id: 'aiapps', icon: '✈', label: 'AI Apps' },
    { id: 'plugins', icon: '⊞', label: 'AI Plugins' },
    { id: 'create', icon: '🖼', label: 'Create Image' },
  ]

  return (
    <nav className="menu">
      {menuItems.map((item) => (
        <a
          key={item.id}
          className={`menu-item ${activeItem === item.id ? 'active' : ''}`}
          onClick={() => setActiveItem(item.id)}
          href={`#${item.id}`}>
          <span className="menu-item-icon">{item.icon}</span>
          {item.label}
        </a>
      ))}
    </nav>
  )
}

export default Menu
