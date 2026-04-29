import axios from 'axios'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  BrowserRouter,
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useOutletContext,
} from 'react-router-dom'
import { axiosInstance, publicAxios } from './apis/axios'
import './App.css'

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

type TokenResponse = {
  accessToken: string
  refreshToken: string
}

function getAccessToken() {
  return localStorage.getItem('accessToken')
}

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
    if (!error.response) {
      return '서버에 연결할 수 없습니다. 백엔드 서버가 http://localhost:8000 에서 실행 중인지 확인해주세요.'
    }

    return error.response.data?.message ?? fallback
  }

  return fallback
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
        로그인 후 access token이 만료되어도 Axios 응답 인터셉터가 refresh token으로
        토큰을 재발급받고 실패한 요청을 한 번 더 실행합니다.
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
  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ??
    '/my'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { data } = await publicAxios.post<ApiResponse<TokenResponse>>(
        '/v1/auth/signin',
        { email, password },
      )

      localStorage.setItem('accessToken', data.data.accessToken)
      localStorage.setItem('refreshToken', data.data.refreshToken)
      setIsLoggedIn(true)
      navigate(from, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, '로그인에 실패했습니다.'))
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
      await publicAxios.post<ApiResponse<unknown>>('/v1/auth/signup', {
        name,
        email,
        password,
      })

      alert('회원가입이 완료되었습니다. 로그인해주세요.')
      navigate('/login')
    } catch (err) {
      setError(getErrorMessage(err, '회원가입에 실패했습니다.'))
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
  const [status, setStatus] = useState('보호 API 요청 대기 중')
  const [refreshCount, setRefreshCount] = useState(0)

  const fetchMyInfo = async () => {
    setError('')
    setStatus('GET /v1/users/me 요청 중...')

    try {
      const { data } =
        await axiosInstance.get<ApiResponse<UserInfo>>('/v1/users/me')

      setUser(data.data)
      setStatus('보호 API 요청 성공')
    } catch (err) {
      setError(getErrorMessage(err, '내 정보를 불러오지 못했습니다.'))
      setStatus('보호 API 요청 실패')
    }
  }

  const makeExpiredAccessToken = () => {
    localStorage.setItem('accessToken', 'expired-access-token-for-demo')
    setStatus('Access Token을 일부러 만료된 값으로 변경했습니다.')
  }

  useEffect(() => {
    const handleRefreshSuccess = () => {
      setRefreshCount((count) => count + 1)
      setStatus('401 발생 -> refresh token으로 재발급 -> 원 요청 재시도 성공')
    }

    const handleRefreshFail = () => {
      setStatus('refresh token 재발급 실패: 다시 로그인해야 합니다.')
    }

    window.addEventListener('token-refresh-success', handleRefreshSuccess)
    window.addEventListener('token-refresh-fail', handleRefreshFail)
    fetchMyInfo()

    return () => {
      window.removeEventListener('token-refresh-success', handleRefreshSuccess)
      window.removeEventListener('token-refresh-fail', handleRefreshFail)
    }
  }, [])

  return (
    <section className="panel compact">
      <p className="eyebrow">Protected Page</p>
      <h1>내 정보</h1>
      <p className="muted">
        GET /v1/users/me 요청이 401이면 refresh token으로 access token을 갱신한 뒤
        자동으로 재시도합니다.
      </p>

      <div className="mission-box">
        <strong>미션 2 동작 확인</strong>
        <p>{status}</p>
        <p>토큰 재발급 성공 횟수: {refreshCount}</p>
        <div className="mission-actions">
          <button type="button" onClick={makeExpiredAccessToken}>
            Access Token 만료 상황 만들기
          </button>
          <button type="button" onClick={fetchMyInfo}>
            보호 API 다시 요청
          </button>
        </div>
      </div>

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
