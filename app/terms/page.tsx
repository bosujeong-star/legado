import Link from 'next/link'

export default function Terms() {
  return (
    <main className="min-h-screen bg-[#f7f4ee]" style={{ fontFamily: 'sans-serif' }}>

      {/* 네비 */}
      <nav className="border-b border-[#d8d2c8] px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-light tracking-widest" style={{ fontFamily: 'Georgia, serif' }}>
          L<em className="text-[#a07840]">e</em>gado
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-light mb-2" style={{ fontFamily: 'Georgia, serif' }}>이용약관</h1>
        <p className="text-xs text-[#8c857a] mb-12">최종 수정일: 2026년 1월 1일</p>

        <div className="space-y-10 text-sm text-[#1c1a17] leading-relaxed">

          <section>
            <h2 className="font-semibold text-base mb-3">제1조 (목적)</h2>
            <p className="text-[#8c857a]">
              이 약관은 Legado(이하 "서비스")가 제공하는 경험 기반 지식 연결 플랫폼 서비스의 이용 조건 및 절차, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3">제2조 (서비스 정의)</h2>
            <p className="text-[#8c857a]">
              Legado는 현장 경험을 가진 전문가와 대학·기관을 연결하는 플랫폼입니다. 서비스는 전문가 프로필 등록, 강의 공고 등록, 연결 요청 및 지원 기능을 제공합니다.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3">제3조 (회원 가입)</h2>
            <ul className="mt-3 space-y-1 text-[#8c857a] list-disc list-inside">
              <li>회원 가입은 개인 및 대학·기관 두 가지 유형으로 구분됩니다.</li>
              <li>만 14세 이상이면 누구나 가입할 수 있습니다.</li>
              <li>허위 정보로 가입한 경우 서비스 이용이 제한될 수 있습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3">제4조 (서비스 이용)</h2>
            <ul className="mt-3 space-y-1 text-[#8c857a] list-disc list-inside">
              <li>전문가 회원은 프로필을 등록하고 공고에 지원할 수 있습니다.</li>
              <li>기관 회원은 강의 공고를 등록하고 전문가에게 연결 요청을 보낼 수 있습니다.</li>
              <li>연결 요청 및 지원은 로그인한 회원만 이용할 수 있습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3">제5조 (금지 행위)</h2>
            <ul className="mt-3 space-y-1 text-[#8c857a] list-disc list-inside">
              <li>허위 정보 등록 및 사기 행위</li>
              <li>타인의 개인정보 무단 수집 및 이용</li>
              <li>서비스의 정상적인 운영을 방해하는 행위</li>
              <li>스팸성 연결 요청 및 지원</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3">제6조 (서비스 요금)</h2>
            <p className="text-[#8c857a]">
              현재 Legado는 베타 운영 중으로 모든 서비스를 무료로 제공합니다. 향후 유료 서비스 전환 시 사전에 공지합니다.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3">제7조 (면책 조항)</h2>
            <p className="text-[#8c857a]">
              Legado는 전문가와 대학·기관 간의 연결을 돕는 플랫폼으로, 실제 강의 계약 및 그에 따른 분쟁에 대해 직접적인 책임을 지지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3">제8조 (문의)</h2>
            <p className="text-[#8c857a]">
              서비스 관련 문의사항은 아래로 연락해주세요.<br />
              이메일: bosujeong@gmail.com
            </p>
          </section>

        </div>
      </div>

      {/* 푸터 */}
      <footer className="border-t border-[#d8d2c8] px-8 py-8 flex justify-between items-center mt-16">
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