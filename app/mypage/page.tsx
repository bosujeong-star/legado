'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function MyPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [connections, setConnections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

 useEffect(() => {
    const fetchData = async () => {
      // 로그인 확인
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/auth'
        return
      }
      setUser(user)

      // 내 프로필 불러오기
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('name', user.user_metadata?.name || '')
        .single()

      setProfile(profileData)

      // 내가 받은 연결 요청 불러오기
      if (profileData) {
        const { data: connData } = await supabase
          .from('connections')
          .select('*')
          .eq('profile_id', profileData.id)
          .order('id', { ascending: false })

        setConnections(connData || [])
      }

      setLoading(false)
    }
    fetchData()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) return (
    <div className="min-h-screen bg-[#f7f4ee] flex items-center justify-center">
      <p className="text-sm text-[#8c857a]">불러오는 중...</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-[#f7f4ee]" style={{ fontFamily: 'sans-serif' }}>

      {/* 네비 */}
      <nav className="border-b border-[#d8d2c8] px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-light tracking-widest" style={{ fontFamily: 'Georgia, serif' }}>
          L<em className="text-[#a07840]">e</em>gado
        </Link>
        <div className="flex items-center gap-4">
<span className="text-sm text-[#8c857a]">{user?.user_metadata?.name || user?.email}</span>

          <button onClick={handleLogout}
            className="text-sm border border-[#d8d2c8] text-[#8c857a] px-4 py-2 hover:border-[#1c1a17] hover:text-[#1c1a17] transition">
            로그아웃
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* 헤더 */}
        <div className="mb-10">
          <p className="text-xs tracking-widest uppercase text-[#a07840] font-medium mb-2">마이페이지</p>
          <h1 className="text-3xl font-light" style={{ fontFamily: 'Georgia, serif' }}>
            안녕하세요, <strong className="font-bold">{user?.user_metadata?.name || '회원'}</strong>님
          </h1>
        </div>

        {/* 계정 정보 */}
        <div className="border border-[#d8d2c8] bg-white p-6 mb-6">
          <p className="text-xs tracking-widest uppercase text-[#a07840] font-medium mb-4">계정 정보</p>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#8c857a]">이메일</span>
              <span className="text-[#1c1a17]">{user?.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8c857a]">가입일</span>
              <span className="text-[#1c1a17]">{new Date(user?.created_at).toLocaleDateString('ko-KR')}</span>
            </div>
          </div>
        </div>

        {/* 내 프로필 */}
        {profile ? (
          <div className="border border-[#d8d2c8] bg-white p-6 mb-6">
            <p className="text-xs tracking-widest uppercase text-[#a07840] font-medium mb-4">내 등록 프로필</p>
            <div className="space-y-3">
              {[
                { label: '참여 유형', value: profile.type },
                { label: '경력', value: profile.career },
                { label: '전문 분야', value: profile.field },
                { label: '참여 동기', value: profile.motive },
                { label: '참여 형태', value: profile.format },
                { label: '참여 조건', value: profile.fee },
                { label: '선호 지역', value: profile.region },
              ].map((item, i) => (
                <div key={i} className="flex justify-between text-sm border-b border-[#f0ece4] pb-2 last:border-0">
                  <span className="text-[#8c857a]">{item.label}</span>
                  <span className="text-[#1c1a17] text-right max-w-xs">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <Link href="/register"
                className="flex-1 text-center border border-[#d8d2c8] text-[#1c1a17] py-3 text-sm hover:border-[#1c1a17] transition">
                프로필 수정
              </Link>
              <Link href="/explore"
                className="flex-1 text-center bg-[#3a6048] text-white py-3 text-sm hover:opacity-90 transition">
                찾아보기 →
              </Link>
            </div>
          </div>
       ) : (
          <div className="border border-[#d8d2c8] bg-white p-8 text-center mb-6">
            <p className="text-[#8c857a] text-sm mb-4">아직 등록된 프로필이 없어요</p>
            <Link href="/register"
              className="inline-block bg-[#3a6048] text-white px-8 py-3 text-sm hover:opacity-90 transition">
              참여 선언하기 →
            </Link>
          </div>
        )}

        {/* 받은 연결 요청 */}
        {connections.length > 0 && (
          <div className="border border-[#d8d2c8] bg-white p-6">
            <p className="text-xs tracking-widest uppercase text-[#a07840] font-medium mb-4">
              받은 연결 요청 ({connections.length})
            </p>
            <div className="space-y-4">
              {connections.map((conn, i) => (
                <div key={i} className="border border-[#d8d2c8] p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-semibold text-[#1c1a17]">{conn.requester_name}</p>
                      <p className="text-xs text-[#8c857a]">{conn.requester_org}</p>
                    </div>
                    <span className="text-xs bg-[#f0e8d8] text-[#a07840] px-3 py-1 rounded-full">
                      {conn.status}
                    </span>
                  </div>
                  <p className="text-sm text-[#1c1a17] mb-2">{conn.message}</p>
                  <p className="text-xs text-[#8c857a]">{conn.requester_email}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  )
}