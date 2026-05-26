import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// ❌ 기존에 감싸고 있던 import { Provider } from 'react-redux' 와 { store } 전부 삭제!

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 💡 Provider 컴포넌트 없이 그냥 App을 다이렉트로 렌더링해도 Zustand 전역 상태는 완벽 작동합니다! */}
    <App />
  </React.StrictMode>,
)