'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [accountType, setAccountType] = useState('') // 개인 / 기관
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setMessage('')

  if (mode === 'signup') {
      // 회원가입 후 자동 로그인
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, account_type: accountType } }
      })
      if (error) {
        setMessage(error.message)
      } else {
        // 자동 로그인
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (loginError) {
          setMessage('가입 완료! 로그인해주세요 🎉')
          setMode('login')
        } else {
          window.location.href = '/'
        }
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
            <>
              <div>
                <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-2">
                  가입 유형
                </label>
                <div className="grid grid-cols-2 gap-3">
            <button
                    type="button"
                    onClick={() => setAccountType('개인')}
                    className={`p-4 border text-sm text-left transition
                      ${accountType === '개인'
                        ? 'border-[#3a6048] bg-[#d8e8de] text-[#3a6048]'
                        : 'border-[#d8d2c8] text-[#1c1a17] hover:border-[#3a6048]'}`}>
                    개인 (경험 나누기)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('기관')}
                    className={`p-4 border text-sm text-left transition
                      ${accountType === '기관'
                        ? 'border-[#a07840] bg-[#f0e8d8] text-[#a07840]'
                        : 'border-[#d8d2c8] text-[#1c1a17] hover:border-[#a07840]'}`}>
                    대학·기관 (강사 초청)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-2">
                  {accountType === '기관' ? '담당자 이름' : '이름'}
                </label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full border border-[#d8d2c8] bg-white px-4 py-3 text-sm text-[#1c1a17] focus:outline-none focus:border-[#3a6048]"
                />
              </div>
            </>
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
            disabled={loading || !email || !password || (mode === 'signup' && !accountType)}
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

        {/* 비밀번호 찾기 */}
        {mode === 'login' && (
          <p className="text-center text-xs text-[#8c857a] mt-3">
            <button
              onClick={async () => {
                if (!email) {
                  alert('이메일을 먼저 입력해주세요')
                  return
                }
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                  redirectTo: 'https://legado-gules.vercel.app/reset-password',
                })
                if (error) {
                  alert('오류가 발생했습니다')
                } else {
                  alert('비밀번호 재설정 이메일을 보냈습니다 📧')
                }
              }}
              className="text-[#a07840] hover:underline">
              비밀번호를 잊으셨나요?
            </button>
          </p>
        )}

      </div>
    </main>
  )
}