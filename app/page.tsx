'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
export default function Home() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // 현재 로그인 상태 확인
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
    // 로그인/로그아웃 감지
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
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
          <a href="#" className="hover:text-[#1c1a17] transition">참여 형태</a>
          <a href="#" className="hover:text-[#1c1a17] transition">이용 방법</a>
        </div>
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
      </nav>

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
          <div className="flex gap-4 flex-wrap">
            <Link href="/register" className="bg-[#1c1a17] text-[#f7f4ee] px-8 py-3 text-sm hover:bg-[#a07840] transition"
  style={{ fontFamily: 'sans-serif' }}>
  경험 나누기
</Link>
<Link href="/explore" className="border border-[#d8d2c8] text-[#1c1a17] px-8 py-3 text-sm hover:border-[#1c1a17] transition"
  style={{ fontFamily: 'sans-serif' }}>
  강연 · 강사 초청하기
</Link>
          </div>
        </div>

        {/* 오른쪽 — 전문가 카드들 */}
        <div className="flex flex-col justify-center px-8 py-20 gap-4 bg-[#ece7dc]">
          <p className="text-xs tracking-widest text-[#8c857a] uppercase mb-2" style={{ fontFamily: 'sans-serif' }}>
            지금 참여 중인 분들
          </p>

          {[
            {
              name: '김○○ · 전 서울아산병원 흉부외과 과장',
              role: '임상 35년 · 의료 AI 도입 선도',
              motive: '다음 세대 의사들이 제가 겪은 시행착오를 줄였으면 해서요',
              form: '무상 기여',
              formColor: 'bg-[#d8e8de] text-[#3a6048]',
            },
            {
              name: '박○○ · 전 삼성전자 DS부문 상무',
              role: '반도체 공정 전문 · 기술 경영 20년',
              motive: '은퇴 후에도 사회와 계속 연결되어 있고 싶어서요',
              form: '실비만',
              formColor: 'bg-[#f0e8d8] text-[#a07840]',
            },
            {
              name: '이○○ · 한국은행 전 통화정책국장',
              role: '통화·금융정책 28년',
              motive: '교과서에는 없는 정책 현장의 이야기를 남기고 싶어서요',
              form: '협의 가능',
              formColor: 'bg-[#e8e4de] text-[#8c857a]',
            },
          ].map((person, i) => (
            <div key={i} className="bg-white border border-[#d8d2c8] p-5 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-semibold text-sm text-[#1c1a17]" style={{ fontFamily: 'sans-serif' }}>
                    {person.name}
                  </div>
                  <div className="text-xs text-[#8c857a] mt-1" style={{ fontFamily: 'sans-serif' }}>
                    {person.role}
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ml-2 ${person.formColor}`}
                  style={{ fontFamily: 'sans-serif' }}>
                  {person.form}
                </span>
              </div>
              <div className="text-sm italic text-[#a07840] border-t border-[#d8d2c8] pt-3">
                "{person.motive}"
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 통계 */}
      <section className="grid grid-cols-2 md:grid-cols-4 border-t border-[#d8d2c8]">
        {[
          { num: '340+', desc: '경험을 나누는 전문가' },
          { num: '82', desc: '연결된 대학·학과' },
          { num: '61%', desc: '무상 또는 실비 기여' },
          { num: '4.9', desc: '평균 강의 만족도' },
        ].map((stat, i) => (
          <div key={i} className="px-8 py-8 border-r border-[#d8d2c8] last:border-r-0">
            <div className="text-3xl text-[#a07840] mb-1">{stat.num}</div>
            <div className="text-xs text-[#8c857a]" style={{ fontFamily: 'sans-serif' }}>{stat.desc}</div>
          </div>
        ))}
      </section>

      {/* 찾아보기 섹션 */}
      <section className="px-12 py-20">
        <p className="text-xs tracking-widest text-[#a07840] uppercase mb-3" style={{ fontFamily: 'sans-serif' }}>찾아보기</p>
        <h2 className="text-3xl font-light mb-12">지금 <strong className="font-bold">연결을 기다리는</strong> 분들</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              badge: '전문가 등록', badgeColor: 'bg-[#d8e8de] text-[#3a6048]',
              name: '정○○', role: '전 현대중공업 조선해양연구소 수석연구원 · 30년',
              subject: '조선공학 실무 & 해양플랜트 설계',
              motive: '도면 위의 배가 바다에 뜨는 과정을 직접 보여주고 싶어서요',
              meta: '정규강의·특강 · 서울·경기 · 무상 기여',
            },
            {
              badge: '대학 초청', badgeColor: 'bg-[#f0e8d8] text-[#a07840]',
              name: '인하대학교 경영학과', role: '특강 1회 · 2025년 11월',
              subject: '스타트업 투자와 VC 실무',
              motive: '교수님보다 투자를 실제로 해본 분의 이야기가 필요합니다',
              meta: '2시간 · 참여 조건 협의 가능',
            },
            {
              badge: '전문가 등록', badgeColor: 'bg-[#d8e8de] text-[#3a6048]',
              name: '최○○', role: '전 보건복지부 국장 · 현 의료정책 컨설턴트',
              subject: '한국 의료정책의 현재와 미래',
              motive: '정책이 실제로 어떻게 만들어지는지, 공무원이 아니면 모르는 이야기들이 있거든요',
              meta: '특강·워크숍 · 온오프라인 · 실비만',
            },
          ].map((item, i) => (
            <Link key={i} href="/explore" className="border border-[#d8d2c8] hover:shadow-md transition overflow-hidden block">
              <div className="p-5 border-b border-[#d8d2c8]">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${item.badgeColor} mb-3 inline-block`}
                  style={{ fontFamily: 'sans-serif' }}>
                  {item.badge}
                </span>
                <div className="font-semibold text-sm" style={{ fontFamily: 'sans-serif' }}>{item.name}</div>
                <div className="text-xs text-[#8c857a] mt-1" style={{ fontFamily: 'sans-serif' }}>{item.role}</div>
              </div>
              <div className="p-5 bg-[#f7f4ee]">
                <div className="text-sm mb-2">{item.subject}</div>
                <div className="text-sm italic text-[#a07840] mb-3">"{item.motive}"</div>
                <div className="text-xs text-[#8c857a]" style={{ fontFamily: 'sans-serif' }}>{item.meta}</div>
              </div>
            </Link>
          ))}
        </div>
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
          <Link href="/register" className="bg-[#a07840] text-white px-8 py-3 text-sm hover:opacity-90 transition"
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
        <div className="text-xs text-[#8c857a]" style={{ fontFamily: 'sans-serif' }}>© 2025 Legado. 경험을 남기다.</div>
        <div className="flex gap-6 text-xs text-[#8c857a]" style={{ fontFamily: 'sans-serif' }}>
          <a href="#" className="hover:text-[#1c1a17]">소개</a>
          <a href="#" className="hover:text-[#1c1a17]">이용약관</a>
          <a href="#" className="hover:text-[#1c1a17]">문의</a>
        </div>
      </footer>

    </main>
  )
}