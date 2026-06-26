'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
export default function Home() {
  const [user, setUser] = useState<any>(null)
const [menuOpen, setMenuOpen] = useState(false)
const [recentListings, setRecentListings] = useState<any[]>([])
const [heroProfiles, setHeroProfiles] = useState<any[]>([])

 useEffect(() => {
    // 현재 로그인 상태 확인
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
    // 로그인/로그아웃 감지
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    // 최근 등록된 전문가/공고 불러오기
    const fetchRecent = async () => {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .order('id', { ascending: false })
        .limit(2)

      const { data: postingsData } = await supabase
        .from('postings')
        .select('*')
        .order('id', { ascending: false })
        .limit(1)

      const profileItems = (profilesData || []).map((p: any) => ({
        ...p,
        listingType: 'profile',
        displayName: p.name,
        displayRole: p.career,
        displayMotive: p.motive,
        displayMeta: p.region,
      }))

      const postingItems = (postingsData || []).map((p: any) => ({
        ...p,
        listingType: 'posting',
        displayName: `${p.university} ${p.department || ''}`.trim(),
        displayRole: `${p.format} · ${p.schedule || ''}`.trim(),
        displayMotive: p.description,
        displayMeta: p.fee,
      }))
setHeroProfiles(profilesData?.slice(0, 3) || [])
      setRecentListings([...profileItems, ...postingItems])
    }
    fetchRecent()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }
  return (
    <main className="min-h-screen bg-[#f7f4ee]" style={{ fontFamily: 'Georgia, serif' }}>
{/* 네비게이션 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f7f4ee]/95 backdrop-blur border-b border-[#d8d2c8] px-8 h-16 flex items-center justify-between">
        <div className="text-2xl font-light tracking-widest">
          L<em className="text-[#a07840]">e</em>gado
        </div>
        <div className="hidden md:flex gap-8 text-sm text-[#8c857a]" style={{ fontFamily: 'sans-serif' }}>
          <Link href="/explore" className="hover:text-[#1c1a17] transition">찾아보기</Link>
<a href="/#formats" className="hover:text-[#1c1a17] transition">참여 형태</a>
<a href="/faq" className="hover:text-[#1c1a17] transition">이용 방법</a>
        </div>

        {/* 데스크탑 전용 로그인 영역 */}
        <div className="hidden md:block">
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/mypage" className="text-sm text-[#8c857a] hover:text-[#1c1a17] transition">
                {user.user_metadata?.name || user.email}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm border border-[#d8d2c8] text-[#8c857a] px-4 py-2 hover:border-[#1c1a17] hover:text-[#1c1a17] transition">
                로그아웃
              </button>
            </div>
          ) : (
            <Link href="/auth" className="text-sm border border-[#3a6048] text-[#3a6048] px-4 py-2 hover:bg-[#3a6048] hover:text-white transition">
              로그인
            </Link>
          )}
        </div>

        {/* 모바일 햄버거 버튼 */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl text-[#1c1a17]">
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

     {/* 모바일 드롭다운 메뉴 */}
      {menuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-50 border-b border-[#d8d2c8] bg-[#f7f4ee] px-8 py-4 flex flex-col gap-4 text-sm">
          <Link href="/explore" onClick={() => setMenuOpen(false)} className="text-[#1c1a17]">찾아보기</Link>
       <Link href="/about" onClick={() => setMenuOpen(false)} className="text-[#1c1a17]">소개</Link>
<a href="/#formats" onClick={() => setMenuOpen(false)} className="text-[#1c1a17]">참여 형태</a>
<a href="/faq" onClick={() => setMenuOpen(false)} className="text-[#1c1a17]">이용 방법</a>

          <div className="border-t border-[#d8d2c8] pt-4 mt-2">
            {user ? (
              <>
                <Link href="/mypage" onClick={() => setMenuOpen(false)} className="block text-[#1c1a17] mb-3">
                  {user.user_metadata?.name || user.email} 님
                </Link>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="text-sm border border-[#d8d2c8] text-[#8c857a] px-4 py-2 hover:border-[#1c1a17] transition">
                  로그아웃
                </button>
              </>
            ) : (
              <Link href="/auth" onClick={() => setMenuOpen(false)}
                className="inline-block text-sm border border-[#3a6048] text-[#3a6048] px-4 py-2">
                로그인
              </Link>
            )}
          </div>
        </div>
      )}

      {/* 히어로 */}
      <section className="pt-16 min-h-screen grid md:grid-cols-2">
        
        {/* 왼쪽 */}
        <div className="flex flex-col justify-center px-12 py-20 border-r border-[#d8d2c8]">
          <p className="text-[#a07840] text-sm tracking-widest mb-8" style={{ fontFamily: 'sans-serif' }}>
            Legado — 경험을 남기다
          </p>
          <h1 className="text-4xl md:text-5xl font-light leading-tight mb-8 text-[#1c1a17]">
            당신의 35년은<br />
            어떤 교재보다<br />
            <strong className="font-bold">생생한 수업</strong>입니다
          </h1>
          <p className="text-[#8c857a] text-base leading-relaxed mb-10 pl-4 border-l-2 border-[#f0e8d8]"
            style={{ fontFamily: 'sans-serif' }}>
            교수가 되지 않아도 가르칠 수 있습니다.<br />
            Legado는 현장의 경험을 대학과 연결합니다 —<br />
            급여가 아니라, 의미를 위해.
          </p>

          <div>
            <div className="flex gap-4 flex-wrap mb-3">
           <button
  onClick={() => user ? window.location.href = '/register' : window.location.href = '/auth'}
  className="bg-[#1c1a17] text-[#f7f4ee] px-8 py-3 text-sm hover:bg-[#a07840] transition"
  style={{ fontFamily: 'sans-serif' }}>
  경험 나누기
</button>
              <Link href="/explore" className="border border-[#d8d2c8] text-[#1c1a17] px-8 py-3 text-sm hover:border-[#1c1a17] transition"
                style={{ fontFamily: 'sans-serif' }}>
                강연 · 강사 초청하기
              </Link>
            </div>
            <p className="text-xs text-[#8c857a]" style={{ fontFamily: 'sans-serif' }}>
              3분이면 등록 완료 · 맞는 대학이 나타나면 직접 연락드려요
            </p>
          </div>
        </div>

       {/* 오른쪽 — 전문가 카드들 */}
        <div className="flex flex-col justify-center px-8 py-20 gap-4 bg-[#ece7dc]">
          <p className="text-xs tracking-widest text-[#8c857a] uppercase mb-2" style={{ fontFamily: 'sans-serif' }}>
            지금 참여 중인 분들
          </p>

          {heroProfiles.length === 0 ? (
            <div className="bg-white border border-[#d8d2c8] p-8 text-center">
              <p className="text-sm text-[#8c857a] mb-3">아직 등록된 전문가가 없어요</p>
              <Link href="/register" className="text-xs text-[#3a6048] hover:underline">
                첫 번째로 참여 선언하기 →
              </Link>
            </div>
          ) : (
            heroProfiles.map((person, i) => (
              <div key={i} className="bg-white border border-[#d8d2c8] p-5 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold text-sm text-[#1c1a17]" style={{ fontFamily: 'sans-serif' }}>
                      {person.name}
                    </div>
                    <div className="text-xs text-[#8c857a] mt-1" style={{ fontFamily: 'sans-serif' }}>
                      {person.career}
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ml-2
                    ${person.fee === '무상 기여' ? 'bg-[#d8e8de] text-[#3a6048]' :
                      person.fee === '실비만' ? 'bg-[#f0e8d8] text-[#a07840]' :
                      'bg-[#e8e4de] text-[#8c857a]'}`}
                    style={{ fontFamily: 'sans-serif' }}>
                    {person.fee}
                  </span>
                </div>
                <div className="text-sm italic text-[#a07840] border-t border-[#d8d2c8] pt-3">
                  "{person.motive}"
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 운영 상태 안내 */}
      <section className="border-t border-[#d8d2c8] px-8 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-widest uppercase text-[#a07840] font-medium mb-4">
            현재 베타 운영 중
          </p>
          <p className="text-lg md:text-xl font-light leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
            아직 작은 시작이지만, 그래서 더 정성껏 연결합니다.<br />
            <span className="text-[#8c857a] text-base">합류하시는 한 분 한 분을 직접 살피고, 맞는 대학에 직접 소개해드립니다.</span>
          </p>
        </div>
      </section>
      
{/* 대학을 위한 가치 */}
<section id="formats" className="px-12 py-20 bg-[#ece7dc] border-t border-b border-[#d8d2c8]">        <p className="text-xs tracking-widest text-[#a07840] uppercase mb-3" style={{ fontFamily: 'sans-serif' }}>대학·기관 담당자께</p>
        <h2 className="text-3xl font-light mb-4">왜 교수 대신 <strong className="font-bold">현업 전문가</strong>인가</h2>
        <p className="text-sm text-[#8c857a] mb-12 max-w-2xl" style={{ fontFamily: 'sans-serif' }}>
          이론은 충분합니다. 학생들에게 지금 필요한 건 현장의 시행착오와 살아있는 판단력입니다.
        </p>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: '🎯', title: '현장성 강화', desc: '교과서에 없는 실무 사례와 최신 산업 동향을 직접 전달합니다' },
            { icon: '🤝', title: '산학협력 실적', desc: '정규 산학협력 프로그램으로 활용 가능, 협약 실적으로 인정됩니다' },
            { icon: '💼', title: '취업·진로 연결', desc: '학생들이 실제 업계 인물과 네트워킹할 기회를 얻습니다' },
            { icon: '🚀', title: '창업교육 강화', desc: '실제 창업·경영 경험자의 생생한 케이스로 수업 깊이가 달라집니다' },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-[#d8d2c8] p-6">
              <div className="text-2xl mb-3">{item.icon}</div>
              <div className="font-semibold text-sm mb-2" style={{ fontFamily: 'sans-serif' }}>{item.title}</div>
              <div className="text-xs text-[#8c857a] leading-relaxed" style={{ fontFamily: 'sans-serif' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

     {/* 찾아보기 섹션 */}
      <section className="px-12 py-20">
        <p className="text-xs tracking-widest text-[#a07840] uppercase mb-3" style={{ fontFamily: 'sans-serif' }}>찾아보기</p>
        <h2 className="text-3xl font-light mb-12">지금 <strong className="font-bold">연결을 기다리는</strong> 분들</h2>

        {recentListings.length === 0 ? (
          <div className="text-center py-16 text-[#8c857a]">
            <p className="text-sm">아직 등록된 전문가가 없어요</p>
            <Link href="/register" className="inline-block mt-4 text-sm text-[#3a6048] hover:underline">
              첫 번째로 참여 선언하기 →
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {recentListings.map((item, i) => (
              <Link key={i} href="/explore" className="border border-[#d8d2c8] hover:shadow-md transition overflow-hidden block">
                <div className="p-5 border-b border-[#d8d2c8]">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full mb-3 inline-block
                    ${item.listingType === 'profile' ? 'bg-[#d8e8de] text-[#3a6048]' : 'bg-[#f0e8d8] text-[#a07840]'}`}
                    style={{ fontFamily: 'sans-serif' }}>
                    {item.listingType === 'profile' ? '전문가 등록' : '대학 초청'}
                  </span>
                  <div className="font-semibold text-sm" style={{ fontFamily: 'sans-serif' }}>{item.displayName}</div>
                  <div className="text-xs text-[#8c857a] mt-1" style={{ fontFamily: 'sans-serif' }}>{item.displayRole}</div>
                </div>
                <div className="p-5 bg-[#f7f4ee]">
                  <div className="text-sm italic text-[#a07840] mb-3">"{item.displayMotive}"</div>
                  <div className="text-xs text-[#8c857a]" style={{ fontFamily: 'sans-serif' }}>{item.displayMeta}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="mx-8 mb-16 border border-[#d8d2c8] grid md:grid-cols-2 overflow-hidden">
        <div className="p-12 bg-[#ece7dc] border-r border-[#d8d2c8]">
          <p className="text-xs tracking-widest text-[#a07840] uppercase mb-3" style={{ fontFamily: 'sans-serif' }}>전문가로 참여하기</p>
          <h3 className="text-2xl font-light mb-4">경험을 <strong className="font-bold">남기고 싶으신가요?</strong></h3>
          <p className="text-sm text-[#8c857a] leading-relaxed mb-6" style={{ fontFamily: 'sans-serif' }}>
            학위도, 논문도 필요 없습니다.<br />현장에서 몸으로 익힌 것들, 그것으로 충분합니다.
          </p>
          <Link href="/register" className="bg-[#3a6048] text-white px-8 py-3 text-sm hover:opacity-90 transition"
  style={{ fontFamily: 'sans-serif' }}>
  참여 선언하기 →
</Link>
        </div>
        <div className="p-12">
          <p className="text-xs tracking-widest text-[#a07840] uppercase mb-3" style={{ fontFamily: 'sans-serif' }}>대학으로 참여하기</p>
          <h3 className="text-2xl font-light mb-4">현장의 목소리를 <strong className="font-bold">초청하세요</strong></h3>
          <p className="text-sm text-[#8c857a] leading-relaxed mb-6" style={{ fontFamily: 'sans-serif' }}>
            채용 공고가 아니라 초청으로 시작하세요.<br />맞는 분이 어딘가에 있습니다.
          </p>
          <Link href="/post" className="bg-[#a07840] text-white px-8 py-3 text-sm hover:opacity-90 transition"
  style={{ fontFamily: 'sans-serif' }}>
  초청 공고 올리기 →
</Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-[#d8d2c8] px-12 py-8 flex justify-between items-center">
        <div className="text-xl font-light tracking-widest">
          L<em className="text-[#a07840]">e</em>gado
        </div>
        <div className="text-xs text-[#8c857a]" style={{ fontFamily: 'sans-serif' }}>© 2026 Legado. 경험을 남기다.</div>
 <div className="flex gap-6 text-xs text-[#8c857a]" style={{ fontFamily: 'sans-serif' }}>
<Link href="/about" className="hover:text-[#1c1a17]">소개</Link>
          <Link href="/faq" className="hover:text-[#1c1a17]">FAQ</Link>
          <Link href="/terms" className="hover:text-[#1c1a17]">이용약관</Link>
          <Link href="/privacy" className="hover:text-[#1c1a17]">개인정보처리방침</Link>
          <a href="mailto:bosujeong@gmail.com" className="hover:text-[#1c1a17]">문의</a>
        </div>
      </footer>

    </main>
  )
}