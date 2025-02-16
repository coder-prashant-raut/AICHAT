import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ChatUi from './components/ChatUi'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ChatUi/>
    </>
  )
}

export default App
bra

