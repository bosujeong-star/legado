'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function MyPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [connections, setConnections] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [receivedApplications, setReceivedApplications] = useState<any[]>([])
  const [myPostings, setMyPostings] = useState<any[]>([])
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

      // 내가 보낸 지원 내역 불러오기 (개인 계정일 때)
      if (user.user_metadata?.account_type === '개인') {
        const { data: appData } = await supabase
          .from('applications')
          .select('*, postings(*)')
          .eq('applicant_email', user.email)
          .order('id', { ascending: false })

        setApplications(appData || [])
      }

// 받은 지원 내역 불러오기 (기관 계정일 때)
      if (user.user_metadata?.account_type === '기관') {
        const { data: recvAppData } = await supabase
          .from('applications')
          .select('*, postings(*)')
          .eq('postings.contact_email', user.email)
          .order('id', { ascending: false })

        setReceivedApplications(recvAppData || [])
      }

// 내가 올린 공고 불러오기 (기관 계정일 때)
      if (user.user_metadata?.account_type === '기관') {
        const { data: postingsData } = await supabase
          .from('postings')
          .select('*')
          .eq('contact_email', user.email)
          .order('id', { ascending: false })

        setMyPostings(postingsData || [])
      }


      setLoading(false)
    }
    fetchData()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

const updateConnectionStatus = async (connId: number, newStatus: string) => {
    const { error } = await supabase
      .from('connections')
      .update({ status: newStatus })
      .eq('id', connId)

    if (error) {
      alert('처리 중 오류가 발생했습니다')
      console.error(error)
    } else {
      // 화면에서도 바로 업데이트
      setConnections(prev =>
        prev.map(c => c.id === connId ? { ...c, status: newStatus } : c)
      )
    }
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
                <div key={i} className="flex flex-col sm:flex-row sm:justify-between text-sm border-b border-[#f0ece4] pb-2 last:border-0 gap-1">
                  <span className="text-[#8c857a]">{item.label}</span>
                  <span className="text-[#1c1a17] sm:text-right">{item.value}</span>
                </div>
              ))}
            </div>
 <div className="mt-6 flex gap-3">
              <Link href={`/register?edit=${profile.id}`}
                className="flex-1 text-center border border-[#d8d2c8] text-[#1c1a17] py-3 text-sm hover:border-[#1c1a17] transition">
                프로필 수정
              </Link>
              <Link href="/explore"
                className="flex-1 text-center bg-[#3a6048] text-white py-3 text-sm hover:opacity-90 transition">
                찾아보기 →
              </Link>
              <button
                onClick={async () => {
                  if (!confirm('프로필을 삭제할까요? 복구할 수 없어요.')) return
                  const { error } = await supabase
                    .from('profiles')
                    .delete()
                    .eq('id', profile.id)
                  if (error) {
                    alert('삭제 중 오류가 발생했습니다')
                  } else {
                    alert('프로필이 삭제됐습니다')
                    window.location.reload()
                  }
                }}
                className="flex-1 text-center border border-[#d8d2c8] text-red-400 py-3 text-sm hover:border-red-400 transition">
                프로필 삭제
              </button>
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
                    <span className={`text-xs px-3 py-1 rounded-full font-medium
                      ${conn.status === '수락' ? 'bg-[#d8e8de] text-[#3a6048]' :
                        conn.status === '거절' ? 'bg-[#e8e4de] text-[#8c857a]' :
                                                  'bg-[#f0e8d8] text-[#a07840]'}`}>
                      {conn.status}
                    </span>
                  </div>
                  <p className="text-sm text-[#1c1a17] mb-2">{conn.message}</p>
                  <p className="text-xs text-[#8c857a] mb-3">{conn.requester_email}</p>

                  {/* 대기중일 때만 수락/거절 버튼 표시 */}
                  {conn.status === '대기중' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateConnectionStatus(conn.id, '수락')}
                        className="flex-1 bg-[#3a6048] text-white text-xs py-2 hover:opacity-90 transition">
                        수락
                      </button>
                      <button
                        onClick={() => updateConnectionStatus(conn.id, '거절')}
                        className="flex-1 border border-[#d8d2c8] text-[#8c857a] text-xs py-2 hover:border-[#1c1a17] transition">
                        거절
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

 {/* 내가 보낸 지원 내역 */}
        {applications.length > 0 && (
          <div className="border border-[#d8d2c8] bg-white p-6 mt-6">
            <p className="text-xs tracking-widest uppercase text-[#a07840] font-medium mb-4">
              내가 지원한 공고 ({applications.length})
            </p>
            <div className="space-y-4">
              {applications.map((app, i) => (
                <div key={i} className="border border-[#d8d2c8] p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-semibold text-[#1c1a17]">
                        {app.postings?.university} {app.postings?.department}
                      </p>
                      <p className="text-xs text-[#8c857a] mt-1">{app.postings?.subject}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium
                      ${app.status === '수락' ? 'bg-[#d8e8de] text-[#3a6048]' :
                        app.status === '거절' ? 'bg-[#e8e4de] text-[#8c857a]' :
                                                'bg-[#f0e8d8] text-[#a07840]'}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-sm text-[#1c1a17] mb-1">{app.message}</p>
                  <p className="text-xs text-[#8c857a]">
                    {new Date(app.created_at).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

{/* 내가 올린 공고 */}
        {myPostings.length > 0 && (
          <div className="border border-[#d8d2c8] bg-white p-6 mt-6">
            <p className="text-xs tracking-widest uppercase text-[#a07840] font-medium mb-4">
              내가 올린 공고 ({myPostings.length})
            </p>
            <div className="space-y-4">
              {myPostings.map((posting, i) => (
                <div key={i} className="border border-[#d8d2c8] p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-semibold text-[#1c1a17]">{posting.subject}</p>
                      <p className="text-xs text-[#8c857a] mt-1">{posting.format} · {posting.field}</p>
                      <p className="text-xs text-[#8c857a]">{posting.schedule}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#8c857a] mb-3">{posting.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.location.href = `/post/edit?id=${posting.id}`}
                      className="flex-1 border border-[#d8d2c8] text-[#8c857a] text-xs py-2 hover:border-[#1c1a17] hover:text-[#1c1a17] transition">
                      수정
                    </button>
                    <button
                    onClick={async () => {
                        if (!confirm('공고를 삭제할까요?')) return

                        // 연결된 지원 내역 먼저 삭제
                        await supabase
                          .from('applications')
                          .delete()
                          .eq('posting_id', posting.id)

                        // 공고 삭제
                        const { error } = await supabase
                          .from('postings')
                          .delete()
                          .eq('id', posting.id)

                        if (error) {
                          alert('삭제 중 오류: ' + error.message)
                        } else {
                          setMyPostings(prev => prev.filter(p => p.id !== posting.id))
                        }
                      }}
                      className="flex-1 border border-[#d8d2c8] text-[#8c857a] text-xs py-2 hover:border-red-400 hover:text-red-400 transition">
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

 {/* 받은 지원 내역 (기관 계정) */}
        {receivedApplications.length > 0 && (
          <div className="border border-[#d8d2c8] bg-white p-6 mt-6">
            <p className="text-xs tracking-widest uppercase text-[#a07840] font-medium mb-4">
              받은 지원 ({receivedApplications.length})
            </p>
            <div className="space-y-4">
              {receivedApplications.map((app, i) => (
                <div key={i} className="border border-[#d8d2c8] p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-semibold text-[#1c1a17]">{app.applicant_name}</p>
                      <p className="text-xs text-[#8c857a]">{app.applicant_career}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium
                      ${app.status === '수락' ? 'bg-[#d8e8de] text-[#3a6048]' :
                        app.status === '거절' ? 'bg-[#e8e4de] text-[#8c857a]' :
                                                'bg-[#f0e8d8] text-[#a07840]'}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#8c857a] mb-1">
                    공고: {app.postings?.subject}
                  </p>
                  <p className="text-sm text-[#1c1a17] mb-3">{app.message}</p>
                  <p className="text-xs text-[#8c857a] mb-3">{app.applicant_email}</p>

                  {/* 대기중일 때만 수락/거절 */}
                  {app.status === '대기중' && (
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          await supabase.from('applications').update({ status: '수락' }).eq('id', app.id)
                          setReceivedApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: '수락' } : a))
                        }}
                        className="flex-1 bg-[#3a6048] text-white text-xs py-2 hover:opacity-90 transition">
                        수락
                      </button>
                      <button
                        onClick={async () => {
                          await supabase.from('applications').update({ status: '거절' }).eq('id', app.id)
                          setReceivedApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: '거절' } : a))
                        }}
                        className="flex-1 border border-[#d8d2c8] text-[#8c857a] text-xs py-2 hover:border-[#1c1a17] transition">
                        거절
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}



      </div>
    </main>
  )
}