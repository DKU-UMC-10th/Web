import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  BrowserRouter,
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useOutletContext,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import './App.css'

const API_URL = import.meta.env.VITE_SERVER_API_URL ?? 'http://localhost:8000'

type UserInfo = {
  id: number
  name: string
  email: string
  bio: string | null
  avatar: string | null
}

type ApiResponse<T> = {
  status: boolean
  message: string
  data: T
}

function getAccessToken() {
  return localStorage.getItem('accessToken')
}

function ProtectedRoute() {
  const location = useLocation()

  if (!getAccessToken()) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

function Layout() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(getAccessToken()))

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setIsLoggedIn(false)
    navigate('/login')
  }

  return (
    <div className="app">
      <header className="nav">
        <Link to="/" className="brand">
          Protected Route
        </Link>
        <nav className="nav-links">
          <Link to="/my">내 정보</Link>
          {isLoggedIn ? (
            <button type="button" onClick={handleLogout}>
              로그아웃
            </button>
          ) : (
            <>
              <Link to="/login">로그인</Link>
              <Link to="/signup">회원가입</Link>
            </>
          )}
        </nav>
      </header>
      <main className="page">
        <Outlet context={{ setIsLoggedIn }} />
      </main>
    </div>
  )
}

function HomePage() {
  return (
    <section className="panel">
      <p className="eyebrow">Public Page</p>
      <h1>인증이 필요 없는 홈 페이지</h1>
      <p>
        Swagger에서 자물쇠가 없는 API나 공개 화면은 그대로 접근할 수 있고, 자물쇠가
        있는 API를 사용하는 화면만 Protected Route로 보호합니다.
      </p>
      <Link className="primary-link" to="/my">
        보호된 내 정보 페이지로 이동
      </Link>
    </section>
  )
}

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setIsLoggedIn } = useOutletContext<{
    setIsLoggedIn: (isLoggedIn: boolean) => void
  }>()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/my'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/v1/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const result: ApiResponse<{ accessToken: string; refreshToken: string }> =
        await response.json()

      if (!response.ok) {
        throw new Error(result.message)
      }

      localStorage.setItem('accessToken', result.data.accessToken)
      localStorage.setItem('refreshToken', result.data.refreshToken)
      setIsLoggedIn(true)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="panel compact">
      <p className="eyebrow">Login</p>
      <h1>로그인</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          이메일
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="email@example.com"
            required
          />
        </label>
        <label>
          비밀번호
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호"
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </section>
  )
}

function SignupPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/v1/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const result: ApiResponse<unknown> = await response.json()

      if (!response.ok) {
        throw new Error(result.message)
      }

      alert('회원가입이 완료되었습니다. 로그인해주세요.')
      navigate('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="panel compact">
      <p className="eyebrow">Signup</p>
      <h1>회원가입</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          이름
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="이름"
            required
          />
        </label>
        <label>
          이메일
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="email@example.com"
            required
          />
        </label>
        <label>
          비밀번호
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호"
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? '가입 중...' : '회원가입'}
        </button>
      </form>
    </section>
  )
}

function MyPage() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const response = await fetch(`${API_URL}/v1/users/me`, {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        })
        const result: ApiResponse<UserInfo> = await response.json()

        if (!response.ok) {
          throw new Error(result.message)
        }

        setUser(result.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '내 정보를 불러오지 못했습니다.')
      }
    }

    fetchMyInfo()
  }, [])

  return (
    <section className="panel compact">
      <p className="eyebrow">Protected Page</p>
      <h1>내 정보</h1>
      <p className="muted">Swagger에서 자물쇠가 걸린 GET /v1/users/me API를 호출합니다.</p>

      {error && <p className="error">{error}</p>}
      {!user && !error && <p>내 정보를 불러오는 중...</p>}
      {user && (
        <dl className="profile">
          <div>
            <dt>이름</dt>
            <dd>{user.name}</dd>
          </div>
          <div>
            <dt>이메일</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt>소개</dt>
            <dd>{user.bio ?? '등록된 소개가 없습니다.'}</dd>
          </div>
        </dl>
      )}
    </section>
  )
}

function NotFoundPage() {
  return (
    <section className="panel compact">
      <h1>페이지를 찾을 수 없습니다.</h1>
      <Link className="primary-link" to="/">
        홈으로 이동
      </Link>
    </section>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="my" element={<MyPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
