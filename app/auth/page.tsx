'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setMessage('')

    if (mode === 'signup') {
      // 회원가입
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      })
      if (error) {
        setMessage(error.message)
      } else {
        setMessage('가입 완료! 로그인해주세요 🎉')
        setMode('login')
      }
    } else {
      // 로그인
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        setMessage('이메일 또는 비밀번호를 확인해주세요')
      } else {
        window.location.href = '/'
      }
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] flex items-center justify-center px-6"
      style={{ fontFamily: 'sans-serif' }}>

      <div className="w-full max-w-md">

        {/* 로고 */}
        <div className="text-center mb-10">
          <a href="/" className="text-3xl font-light tracking-widest"
            style={{ fontFamily: 'Georgia, serif' }}>
            L<em className="text-[#a07840]">e</em>gado
          </a>
          <p className="text-sm text-[#8c857a] mt-2">경험을 남기다</p>
        </div>

        {/* 탭 */}
        <div className="flex border border-[#d8d2c8] mb-8">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-sm font-medium transition
              ${mode === 'login'
                ? 'bg-[#1c1a17] text-white'
                : 'bg-white text-[#8c857a] hover:text-[#1c1a17]'}`}>
            로그인
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-3 text-sm font-medium transition
              ${mode === 'signup'
                ? 'bg-[#1c1a17] text-white'
                : 'bg-white text-[#8c857a] hover:text-[#1c1a17]'}`}>
            회원가입
          </button>
        </div>

        {/* 폼 */}
        <div className="space-y-4">

          {mode === 'signup' && (
            <div>
              <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-2">
                이름
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="홍길동"
                className="w-full border border-[#d8d2c8] bg-white px-4 py-3 text-sm text-[#1c1a17] focus:outline-none focus:border-[#3a6048]"
              />
            </div>
          )}

          <div>
            <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-2">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full border border-[#d8d2c8] bg-white px-4 py-3 text-sm text-[#1c1a17] focus:outline-none focus:border-[#3a6048]"
            />
          </div>

          <div>
            <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-2">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="8자 이상"
              className="w-full border border-[#d8d2c8] bg-white px-4 py-3 text-sm text-[#1c1a17] focus:outline-none focus:border-[#3a6048]"
            />
          </div>

          {/* 메시지 */}
          {message && (
            <p className={`text-sm py-3 px-4 ${
              message.includes('완료') || message.includes('🎉')
                ? 'bg-[#d8e8de] text-[#3a6048]'
                : 'bg-[#f0dcd0] text-[#c8602a]'
            }`}>
              {message}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !email || !password}
            className="w-full bg-[#3a6048] text-white py-4 text-sm font-medium hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed">
            {loading ? '처리 중...' : mode === 'login' ? '로그인' : '가입하기'}
          </button>

        </div>

        {/* 하단 링크 */}
        <p className="text-center text-xs text-[#8c857a] mt-8">
          {mode === 'login' ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?'}
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-[#3a6048] font-medium ml-1 hover:underline">
            {mode === 'login' ? '회원가입' : '로그인'}
          </button>
        </p>

      </div>
    </main>
  )
}