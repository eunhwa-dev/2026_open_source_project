import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:4000'
const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '17712952070-rnl29e5f5st3ck9h083r17vkb59i82rm.apps.googleusercontent.com'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const googleButtonRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    const setupGoogleLogin = async () => {
      if (!GOOGLE_CLIENT_ID) {
        setStatus('Google Client ID가 설정되지 않았습니다.')
        return
      }

      try {
        await loadGoogleIdentityScript()

        if (cancelled || !googleButtonRef.current) return

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredential
        })
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          width: 320,
          text: 'continue_with'
        })
      } catch (error) {
        setStatus(error.message)
      }
    }

    setupGoogleLogin()

    return () => {
      cancelled = true
    }
  }, [])

  const handleGoogleCredential = async (response) => {
    if (!response.credential) {
      setStatus('Google 인증 응답을 받지 못했습니다.')
      return
    }

    setStatus('Google 계정으로 로그인 중...')

    try {
      const authResponse = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: response.credential })
      })

      const data = await authResponse.json()

      if (!authResponse.ok) {
        throw new Error(data.message || 'Google 로그인에 실패했습니다.')
      }

      localStorage.setItem('listoraUser', JSON.stringify(data.user))
      localStorage.setItem('listoraUserId', data.user.userId)
      navigate('/')
    } catch (error) {
      setStatus(error.message)
    }
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh', background: '#111', color: '#fff'
    }}>
      <div style={{ fontSize: '13px', color: '#1DB954', letterSpacing: '2px', marginBottom: '12px' }}>
        LISTORA
      </div>
      <div style={{ fontSize: '28px', fontWeight: '700', marginBottom: '32px', textAlign: 'center' }}>
        PLAY YOUR SONG
      </div>

      <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px' }}>이메일</div>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="이메일 입력"
            style={{
              width: '100%', background: '#1a1a1a', border: '0.5px solid #444',
              borderRadius: '6px', padding: '12px 14px', color: '#fff',
              fontSize: '13px', outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px' }}>비밀번호</div>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            type="password"
            style={{
              width: '100%', background: '#1a1a1a', border: '0.5px solid #444',
              borderRadius: '6px', padding: '12px 14px', color: '#fff',
              fontSize: '13px', outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          onClick={() => navigate('/')}
          style={{
            width: '100%', background: '#1DB954', border: 'none',
            borderRadius: '30px', padding: '13px', color: '#000',
            fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginTop: '4px'
          }}>
          계속
        </button>

        <div style={{ textAlign: 'center', color: '#aaa', fontSize: '12px', margin: '4px 0' }}>또는</div>

        <div ref={googleButtonRef} style={{ minHeight: '44px', display: 'flex', justifyContent: 'center' }} />

        {status && (
          <div style={{ color: '#aaa', fontSize: '12px', lineHeight: 1.5, textAlign: 'center' }}>
            {status}
          </div>
        )}

        <div style={{ textAlign: 'center', fontSize: '12px', color: '#aaa', marginTop: '8px' }}>
          계정이 없으신가요?{' '}
          <span style={{ color: '#1DB954', cursor: 'pointer' }}>회원가입</span>
        </div>
      </div>
    </div>
  )
}

function loadGoogleIdentityScript() {
  if (window.google?.accounts?.id) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')

    if (existingScript) {
      existingScript.addEventListener('load', resolve, { once: true })
      existingScript.addEventListener('error', () => reject(new Error('Google 로그인 스크립트를 불러오지 못했습니다.')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = resolve
    script.onerror = () => reject(new Error('Google 로그인 스크립트를 불러오지 못했습니다.'))
    document.head.appendChild(script)
  })
}

export default Login
