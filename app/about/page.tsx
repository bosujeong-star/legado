import Link from 'next/link'

export default function About() {
  return (
    <main className="min-h-screen bg-[#f7f4ee]" style={{ fontFamily: 'sans-serif' }}>

      {/* 네비 */}
      <nav className="border-b border-[#d8d2c8] px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-light tracking-widest" style={{ fontFamily: 'Georgia, serif' }}>
          L<em className="text-[#a07840]">e</em>gado
        </Link>
        <Link href="/auth" className="text-sm border border-[#3a6048] text-[#3a6048] px-4 py-2 hover:bg-[#3a6048] hover:text-white transition">
          시작하기
        </Link>
      </nav>

      {/* 히어로 */}
      <section className="px-8 py-24 max-w-3xl mx-auto text-center">
        <p className="text-xs tracking-widest uppercase text-[#a07840] font-medium mb-6">Legado 소개</p>
        <h1 className="text-4xl md:text-5xl font-light leading-tight mb-8" style={{ fontFamily: 'Georgia, serif' }}>
          경험은 사라지지 않아야 합니다
        </h1>
        <p className="text-base text-[#8c857a] leading-relaxed max-w-2xl mx-auto">
          35년 임상 경험을 가진 의사, 반도체 공정을 손으로 익힌 엔지니어, 
          정책 현장을 누빈 공무원 — 이들의 지식은 은퇴와 함께 사라집니다. 
          Legado는 그 소멸을 막으려 합니다.
        </p>
      </section>

      <div className="border-t border-[#d8d2c8]" />

      {/* 왜 만들었나 */}
      <section className="px-8 py-20 max-w-3xl mx-auto">
        <p className="text-xs tracking-widest uppercase text-[#a07840] font-medium mb-6">왜 만들었나</p>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-light mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              교수가 아니어도<br />가르칠 자격이 있다
            </h2>
            <p className="text-sm text-[#8c857a] leading-relaxed">
              한국의 대학 강의는 대부분 논문과 학위로 자격을 증명합니다. 
              하지만 현장에서 몸으로 익힌 판단력, 수십 번의 시행착오, 
              살아있는 사례들 — 이것들은 어떤 교재보다 강력한 수업입니다.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-light mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              돈보다 의미를<br />연결의 동기로
            </h2>
            <p className="text-sm text-[#8c857a] leading-relaxed">
              Legado에서 61%의 전문가가 무상 또는 실비로 참여합니다. 
              강사료가 아니라 "내 경험이 누군가에게 닿는다"는 감각이 
              이분들을 움직입니다. 우리는 그 연결을 만듭니다.
            </p>
          </div>
        </div>
      </section>

      <div className="border-t border-[#d8d2c8]" />

      {/* 어떻게 작동하나 */}
      <section className="px-8 py-20 bg-[#ece7dc]">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-[#a07840] font-medium mb-6">어떻게 작동하나</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '一', title: '전문가 등록', desc: '경력과 참여 동기를 등록합니다. 학위나 논문은 필요 없어요.' },
              { step: '二', title: '대학과 연결', desc: '대학 담당자가 찾거나, 공고를 보고 직접 지원합니다.' },
              { step: '三', title: '경험을 남기다', desc: '강의, 특강, 멘토링으로 현장의 이야기가 교실에 닿습니다.' },
            ].map((item, i) => (
              <div key={i}>
                <div className="text-3xl text-[#d8d2c8] mb-3" style={{ fontFamily: 'Georgia, serif' }}>{item.step}</div>
                <h3 className="font-semibold text-sm mb-2">{item.title}</h3>
                <p className="text-xs text-[#8c857a] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-[#d8d2c8]" />

      {/* 만든 사람 */}
      <section className="px-8 py-20 max-w-3xl mx-auto">
        <p className="text-xs tracking-widest uppercase text-[#a07840] font-medium mb-6">만든 사람</p>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <h2 className="text-xl font-light mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              정보수
            </h2>
            <p className="text-sm text-[#8c857a] leading-relaxed mb-4">
              한국전기연구원(KERI) 선임연구원이자 B2LAB 대표. 
              펨토초 레이저 기술로 치과 임플란트 표면처리 시스템 LASERO를 개발했습니다. 
              인천대학교 나노바이오공학과에서 강의하며, 
              "경험 있는 연구자가 왜 대학과 연결되기 어려운가"라는 
              질문에서 Legado를 시작했습니다.
            </p>
            <p className="text-sm text-[#8c857a] leading-relaxed">
              Legado는 단순한 플랫폼이 아니라, 
              경험의 소멸을 막으려는 하나의 시도입니다.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-20 bg-[#1c1a17] text-center">
        <h2 className="text-3xl font-light text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          당신의 경험을 남겨주세요
        </h2>
        <p className="text-sm text-[#8c857a] mb-8">
          아직 작은 시작이지만, 그래서 더 정성껏 연결합니다
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/register"
            className="bg-[#3a6048] text-white px-8 py-3 text-sm hover:opacity-90 transition">
            경험 나누기
          </Link>
          <Link href="/explore"
            className="border border-[#444] text-[#8c857a] px-8 py-3 text-sm hover:border-white hover:text-white transition">
            찾아보기
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-[#d8d2c8] px-8 py-8 flex justify-between items-center">
        <div className="text-xl font-light tracking-widest" style={{ fontFamily: 'Georgia, serif' }}>
          L<em className="text-[#a07840]">e</em>gado
        </div>
        <div className="flex gap-6 text-xs text-[#8c857a]">
          <Link href="/privacy" className="hover:text-[#1c1a17]">개인정보처리방침</Link>
          <Link href="/terms" className="hover:text-[#1c1a17]">이용약관</Link>
        </div>
      </footer>

    </main>
  )
}