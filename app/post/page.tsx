'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PostJob() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [sending, setSending] = useState(false)
  const [checking, setChecking] = useState(true)

 const hasChecked = useRef(false)

  useEffect(() => {
    if (hasChecked.current) return
    hasChecked.current = true

    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        alert('공고를 올리려면 먼저 로그인해주세요')
        router.push('/auth')
        return
      }

     if (user.user_metadata?.account_type !== '기관') {
        alert('대학·기관 계정만 공고를 올릴 수 있어요')
        router.push('/')
        return
      }

      // 로그인 이메일 자동 설정
      setForm(prev => ({ ...prev, contactEmail: user.email || '' }))

      setChecking(false)
    }
    checkAccess()
  }, [])
  const [form, setForm] = useState({
    university: '',
    department: '',
    contactName: '',
    contactEmail: '',
    format: '',
    field: '',
    subject: '',
    description: '',
    schedule: '',
    fee: '',
  })

  const updateForm = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    setSending(true)
    const { error } = await supabase
      .from('postings')
      .insert([{
        university: form.university,
        department: form.department,
        contact_name: form.contactName,
        contact_email: form.contactEmail,
        format: form.format,
        field: form.field,
        subject: form.subject,
        description: form.description,
        schedule: form.schedule,
        fee: form.fee,
      }])

    if (error) {
      alert('등록 중 오류가 발생했습니다')
      console.error(error)
      setSending(false)
    } else {
      alert('공고가 등록됐습니다! 🎉')
      router.push('/explore')
    }
  }

   if (checking) {
    return (
      <main className="min-h-screen bg-[#f7f4ee] flex items-center justify-center">
        <p className="text-sm text-[#8c857a]">확인 중...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee]" style={{ fontFamily: 'sans-serif' }}>

      {/* 네비 */}
      <nav className="border-b border-[#d8d2c8] px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-light tracking-widest" style={{ fontFamily: 'Georgia, serif' }}>
          L<em className="text-[#a07840]">e</em>gado
        </Link>
        <span className="text-sm text-[#8c857a]">공고 등록</span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* 진행 단계 */}
        <div className="flex items-center gap-3 mb-12">
          {[1, 2].map(n => (
            <div key={n} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition
                ${step >= n ? 'bg-[#a07840] text-white' : 'bg-[#ece7dc] text-[#8c857a]'}`}>
                {n}
              </div>
              {n < 2 && <div className={`w-16 h-px ${step > n ? 'bg-[#a07840]' : 'bg-[#d8d2c8]'}`} />}
            </div>
          ))}
          <span className="text-sm text-[#8c857a] ml-2">
            {step === 1 ? '기관 정보' : '강의 내용'}
          </span>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-light mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                어느 기관이신가요?
              </h2>
              <p className="text-sm text-[#8c857a]">현장 전문가를 초청하고 싶은 학과·기관 정보를 알려주세요.</p>
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-3">대학·기관명</label>
              <input
                value={form.university}
                onChange={e => updateForm('university', e.target.value)}
                placeholder="예: 인하대학교"
                className="w-full border border-[#d8d2c8] bg-white px-4 py-3 text-sm text-[#1c1a17] focus:outline-none focus:border-[#a07840]"
              />
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-3">학과·부서</label>
              <input
                value={form.department}
                onChange={e => updateForm('department', e.target.value)}
                placeholder="예: 경영학과"
                className="w-full border border-[#d8d2c8] bg-white px-4 py-3 text-sm text-[#1c1a17] focus:outline-none focus:border-[#a07840]"
              />
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-3">담당자 이름</label>
              <input
                value={form.contactName}
                onChange={e => updateForm('contactName', e.target.value)}
                placeholder="홍길동"
                className="w-full border border-[#d8d2c8] bg-white px-4 py-3 text-sm text-[#1c1a17] focus:outline-none focus:border-[#a07840]"
              />
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-3">담당자 이메일</label>
              <div className="w-full border border-[#d8d2c8] bg-[#f7f4ee] px-4 py-3 text-sm text-[#8c857a]">
                {form.contactEmail} (로그인 계정 이메일 자동 적용)
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!form.university || !form.contactName || !form.contactEmail}
              className="w-full bg-[#1c1a17] text-white py-4 text-sm font-medium hover:bg-[#a07840] transition disabled:opacity-30 disabled:cursor-not-allowed">
              다음 단계 →
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-light mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                어떤 강의가 필요하신가요?
              </h2>
              <p className="text-sm text-[#8c857a]">구체적일수록 맞는 전문가를 빨리 찾을 수 있어요.</p>
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-3">강의 형태</label>
              <div className="grid grid-cols-2 gap-3">
                {['정규 강의', '특강·강연', '워크숍', '멘토링'].map(f => (
                  <button key={f} onClick={() => updateForm('format', f)}
                    className={`p-4 border text-sm text-left transition
                      ${form.format === f
                        ? 'border-[#a07840] bg-[#f0e8d8] text-[#a07840]'
                        : 'border-[#d8d2c8] hover:border-[#a07840]'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-3">필요 분야</label>
              <div className="grid grid-cols-3 gap-2">
                {['공학·기술', '경영·창업', '의료·바이오', '법·정책', '금융·경제', '문화·예술'].map(f => (
                  <button key={f} onClick={() => updateForm('field', f)}
                    className={`p-3 border text-xs text-center transition
                      ${form.field === f
                        ? 'border-[#3a6048] bg-[#d8e8de] text-[#3a6048]'
                        : 'border-[#d8d2c8] hover:border-[#3a6048]'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-3">강의 주제</label>
              <input
                value={form.subject}
                onChange={e => updateForm('subject', e.target.value)}
                placeholder="예: 스타트업 투자와 VC 실무"
                className="w-full border border-[#d8d2c8] bg-white px-4 py-3 text-sm text-[#1c1a17] focus:outline-none focus:border-[#a07840]"
              />
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-3">상세 설명</label>
              <textarea
                value={form.description}
                onChange={e => updateForm('description', e.target.value)}
                placeholder="예: 교수님보다 투자를 실제로 해본 분의 이야기가 필요합니다"
                rows={4}
                className="w-full border border-[#d8d2c8] bg-white px-4 py-3 text-sm text-[#1c1a17] focus:outline-none focus:border-[#a07840] resize-none"
              />
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-3">일정</label>
              <input
                value={form.schedule}
                onChange={e => updateForm('schedule', e.target.value)}
                placeholder="예: 2026년 11월 중, 2시간"
                className="w-full border border-[#d8d2c8] bg-white px-4 py-3 text-sm text-[#1c1a17] focus:outline-none focus:border-[#a07840]"
              />
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-3">강사료 조건</label>
              <input
                value={form.fee}
                onChange={e => updateForm('fee', e.target.value)}
                placeholder="예: 협의 가능, 실비 지급 등"
                className="w-full border border-[#d8d2c8] bg-white px-4 py-3 text-sm text-[#1c1a17] focus:outline-none focus:border-[#a07840]"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 border border-[#d8d2c8] py-4 text-sm hover:border-[#1c1a17] transition">
                ← 이전
              </button>
              <button
                onClick={handleSubmit}
                disabled={sending || !form.format || !form.field || !form.subject}
                className="flex-1 bg-[#a07840] text-white py-4 text-sm font-medium hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed">
                {sending ? '등록 중...' : '공고 올리기 🎉'}
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}