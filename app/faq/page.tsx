'use client'

import { useState } from 'react'
import Link from 'next/link'

const faqs = [
  {
    category: '전문가 참여',
    items: [
      {
        q: '학위나 논문이 없어도 참여할 수 있나요?',
        a: '네, 전혀 문제없습니다. Legado는 학위보다 현장 경험을 중시합니다. 수십 년의 실무 경험, 현장에서 몸으로 익힌 판단력이 어떤 논문보다 강력한 수업이 될 수 있습니다.'
      },
      {
        q: '강사료는 어떻게 되나요?',
        a: '강사료는 무상 기여, 실비만, 협의 가능 세 가지 중 직접 선택하실 수 있어요. 의미 있는 연결을 원하시는 분은 무상으로, 실비 정도는 받고 싶으신 분은 실비만으로 설정하시면 됩니다.'
      },
      {
        q: '프로필 등록 후 언제 연락이 오나요?',
        a: '대학 담당자가 프로필을 보고 직접 연결 요청을 보내는 방식이에요. 베타 운영 중이라 한 분 한 분을 직접 살피고 맞는 대학에 소개해드리고 있습니다.'
      },
      {
        q: '등록한 프로필을 수정하거나 삭제할 수 있나요?',
        a: '네, 마이페이지에서 언제든지 프로필을 수정하거나 삭제할 수 있습니다.'
      },
    ]
  },
  {
    category: '대학·기관 참여',
    items: [
      {
        q: '대학 계정은 어떻게 만드나요?',
        a: '회원가입 시 "대학·기관 (강사 초청)" 을 선택하시면 됩니다. 가입 후 공고를 올리거나 전문가에게 직접 연결 요청을 보낼 수 있어요.'
      },
      {
        q: '공고를 올리면 어떻게 되나요?',
        a: '등록된 전문가들이 공고를 보고 직접 지원할 수 있어요. 지원이 오면 마이페이지에서 확인하고 수락/거절하실 수 있습니다.'
      },
      {
        q: '산학협력 실적으로 인정되나요?',
        a: '정규 산학협력 프로그램으로 활용 가능하며, 협약 실적으로 인정받을 수 있습니다. 자세한 사항은 각 학교의 산학협력단에 문의해주세요.'
      },
      {
        q: '요금은 얼마인가요?',
        a: '현재 베타 운영 중으로 모든 서비스를 무료로 제공하고 있습니다. 향후 유료 서비스 전환 시 사전에 충분히 공지해드릴게요.'
      },
    ]
  },
  {
    category: '서비스 일반',
    items: [
      {
        q: 'Legado는 어떤 서비스인가요?',
        a: '현장 경험을 가진 전문가와 대학·기관을 연결하는 플랫폼입니다. 은퇴 전문가, 현직 실무자, 연구자들이 강의·강연·워크숍 형태로 대학과 만날 수 있어요.'
      },
      {
        q: '개인정보는 어떻게 처리되나요?',
        a: '개인정보는 서비스 제공 목적으로만 사용되며, 제3자에게 제공되지 않습니다. 자세한 내용은 개인정보처리방침을 확인해주세요.'
      },
      {
        q: '문의는 어떻게 하나요?',
        a: 'bosujeong@gmail.com 으로 이메일 주시면 빠르게 답변드리겠습니다.'
      },
    ]
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>(null)

  const toggle = (key: string) => {
    setOpenIndex(prev => prev === key ? null : key)
  }

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

      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-xs tracking-widest uppercase text-[#a07840] font-medium mb-4">FAQ</p>
        <h1 className="text-3xl font-light mb-12" style={{ fontFamily: 'Georgia, serif' }}>
          자주 묻는 질문
        </h1>

        <div className="space-y-12">
          {faqs.map((section, si) => (
            <div key={si}>
              <h2 className="text-sm font-semibold text-[#1c1a17] mb-4 pb-2 border-b border-[#d8d2c8]">
                {section.category}
              </h2>
              <div className="space-y-2">
                {section.items.map((item, ii) => {
                  const key = `${si}-${ii}`
                  const isOpen = openIndex === key
                  return (
                    <div key={ii} className="border border-[#d8d2c8] bg-white">
                      <button
                        onClick={() => toggle(key)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center">
                        <span className="text-sm font-medium text-[#1c1a17]">{item.q}</span>
                        <span className="text-[#a07840] text-lg ml-4 flex-shrink-0">
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4 text-sm text-[#8c857a] leading-relaxed border-t border-[#d8d2c8] pt-4">
                          {item.a}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 추가 문의 */}
        <div className="mt-16 border border-[#d8d2c8] bg-white p-8 text-center">
          <p className="text-sm text-[#8c857a] mb-4">더 궁금한 점이 있으신가요?</p>
          <a href="mailto:bosujeong@gmail.com"
            className="inline-block bg-[#1c1a17] text-white px-8 py-3 text-sm hover:bg-[#a07840] transition">
            이메일로 문의하기
          </a>
        </div>
      </div>

      {/* 푸터 */}
      <footer className="border-t border-[#d8d2c8] px-8 py-8 flex justify-between items-center mt-16">
        <div className="text-xl font-light tracking-widest" style={{ fontFamily: 'Georgia, serif' }}>
          L<em className="text-[#a07840]">e</em>gado
        </div>
        <div className="flex gap-6 text-xs text-[#8c857a]">
          <Link href="/about" className="hover:text-[#1c1a17]">소개</Link>
          <Link href="/privacy" className="hover:text-[#1c1a17]">개인정보처리방침</Link>
          <Link href="/terms" className="hover:text-[#1c1a17]">이용약관</Link>
        </div>
      </footer>

    </main>
  )
}