import Link from 'next/link'

export default function Privacy() {
  return (
    <main className="min-h-screen bg-[#f7f4ee]" style={{ fontFamily: 'sans-serif' }}>

      {/* 네비 */}
      <nav className="border-b border-[#d8d2c8] px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-light tracking-widest" style={{ fontFamily: 'Georgia, serif' }}>
          L<em className="text-[#a07840]">e</em>gado
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-light mb-2" style={{ fontFamily: 'Georgia, serif' }}>개인정보처리방침</h1>
        <p className="text-xs text-[#8c857a] mb-12">최종 수정일: 2026년 1월 1일</p>

        <div className="space-y-10 text-sm text-[#1c1a17] leading-relaxed">

          <section>
            <h2 className="font-semibold text-base mb-3">1. 수집하는 개인정보 항목</h2>
            <p className="text-[#8c857a]">Legado는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.</p>
            <ul className="mt-3 space-y-1 text-[#8c857a] list-disc list-inside">
              <li>이름, 이메일 주소, 비밀번호</li>
              <li>경력, 전문 분야, 참여 동기 (전문가 회원)</li>
              <li>기관명, 학과, 담당자 정보 (기관 회원)</li>
              <li>서비스 이용 기록</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3">2. 개인정보 수집 및 이용 목적</h2>
            <ul className="mt-3 space-y-1 text-[#8c857a] list-disc list-inside">
              <li>회원 가입 및 서비스 제공</li>
              <li>전문가와 대학·기관 간 연결 서비스</li>
              <li>연결 요청 및 공고 지원 알림 발송</li>
              <li>서비스 개선 및 통계 분석</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3">3. 개인정보 보유 및 이용 기간</h2>
            <p className="text-[#8c857a]">
              회원 탈퇴 시까지 보유합니다. 단, 관련 법령에 따라 일정 기간 보존이 필요한 경우 해당 기간 동안 보유합니다.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3">4. 개인정보 제3자 제공</h2>
            <p className="text-[#8c857a]">
              Legado는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 단, 연결 요청 및 공고 지원 시 상대방에게 필요한 정보(이름, 이메일, 소속)가 공유될 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3">5. 개인정보 처리 위탁</h2>
            <ul className="mt-3 space-y-1 text-[#8c857a] list-disc list-inside">
              <li>Supabase Inc. — 데이터베이스 및 인증 서비스</li>
              <li>Vercel Inc. — 서버 호스팅</li>
              <li>Resend Inc. — 이메일 발송</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3">6. 이용자의 권리</h2>
            <p className="text-[#8c857a]">
              이용자는 언제든지 자신의 개인정보를 조회, 수정, 삭제할 수 있습니다. 관련 요청은 아래 이메일로 문의해주세요.
            </p>
            <p className="mt-2 text-[#a07840]">bosujeong@gmail.com</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3">7. 문의</h2>
            <p className="text-[#8c857a]">
              개인정보 관련 문의사항은 아래로 연락해주세요.<br />
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