'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleReset = async () => {
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      alert('오류가 발생했습니다. 다시 시도해주세요')
    } else {
      setDone(true)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] flex items-center justify-center px-6"
      style={{ fontFamily: 'sans-serif' }}>

      <div className="w-full max-w-md">

        {/* 로고 */}
        <div className="text-center mb-10">
          <Link href="/" className="text-3xl font-light tracking-widest"
            style={{ fontFamily: 'Georgia, serif' }}>
            L<em className="text-[#a07840]">e</em>gado
          </Link>
          <p className="text-sm text-[#8c857a] mt-2">경험을 남기다</p>
        </div>

        {!done ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-light mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                새 비밀번호 설정
              </h2>
              <p className="text-sm text-[#8c857a] mb-6">새로 사용할 비밀번호를 입력해주세요</p>
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-2">
                새 비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="8자 이상"
                className="w-full border border-[#d8d2c8] bg-white px-4 py-3 text-sm text-[#1c1a17] focus:outline-none focus:border-[#3a6048]"
              />
            </div>

            <button
              onClick={handleReset}
              disabled={loading || password.length < 8}
              className="w-full bg-[#3a6048] text-white py-4 text-sm font-medium hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed">
              {loading ? '처리 중...' : '비밀번호 변경'}
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-3xl mb-4">🎉</p>
            <p className="text-lg mb-2" style={{ fontFamily: 'Georgia, serif' }}>비밀번호가 변경됐어요</p>
            <p className="text-sm text-[#8c857a] mb-6">새 비밀번호로 로그인해주세요</p>
            <Link href="/auth"
              className="inline-block bg-[#3a6048] text-white px-8 py-3 text-sm hover:opacity-90 transition">
              로그인하기
            </Link>
          </div>
        )}

      </div>
    </main>
  )
}