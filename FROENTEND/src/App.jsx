import { useState } from 'react'

import './App.css'
import ChatUi from './components/ChatUi'
import JobDescriptionForm from './components/JobDescriptionForm'

function App() {

  return (
    <>
    <JobDescriptionForm/>
      <ChatUi/>
    </>
  )
}

export default App

