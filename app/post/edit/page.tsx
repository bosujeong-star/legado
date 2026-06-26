'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

function EditPostForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const postingId = searchParams.get('id')
  const hasChecked = useRef(false)

  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
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

  useEffect(() => {
    if (hasChecked.current) return
    hasChecked.current = true

    const fetchPosting = async () => {
      // 로그인 확인
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }

      // 공고 불러오기
      const { data, error } = await supabase
        .from('postings')
        .select('*')
        .eq('id', postingId)
        .single()

      if (error || !data) {
        alert('공고를 찾을 수 없습니다')
        router.push('/mypage')
        return
      }

      setForm({
        university: data.university || '',
        department: data.department || '',
        contactName: data.contact_name || '',
        contactEmail: data.contact_email || '',
        format: data.format || '',
        field: data.field || '',
        subject: data.subject || '',
        description: data.description || '',
        schedule: data.schedule || '',
        fee: data.fee || '',
      })
      setLoading(false)
    }
    fetchPosting()
  }, [])

  const updateForm = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    setSending(true)
    const { error } = await supabase
      .from('postings')
      .update({
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
      })
      .eq('id', postingId)

    if (error) {
      alert('수정 중 오류가 발생했습니다')
      console.error(error)
    } else {
      alert('공고가 수정됐습니다! ✅')
      router.push('/mypage')
    }
    setSending(false)
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
        <span className="text-sm text-[#8c857a]">공고 수정</span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16 space-y-8">

        <div>
          <h2 className="text-3xl font-light mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            공고 수정
          </h2>
          <p className="text-sm text-[#8c857a]">내용을 수정하고 저장해주세요.</p>
        </div>

        <div>
          <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-3">대학·기관명</label>
          <input value={form.university} onChange={e => updateForm('university', e.target.value)}
            className="w-full border border-[#d8d2c8] bg-white px-4 py-3 text-sm text-[#1c1a17] focus:outline-none focus:border-[#a07840]" />
        </div>

        <div>
          <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-3">학과·부서</label>
          <input value={form.department} onChange={e => updateForm('department', e.target.value)}
            className="w-full border border-[#d8d2c8] bg-white px-4 py-3 text-sm text-[#1c1a17] focus:outline-none focus:border-[#a07840]" />
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
          <input value={form.subject} onChange={e => updateForm('subject', e.target.value)}
            className="w-full border border-[#d8d2c8] bg-white px-4 py-3 text-sm text-[#1c1a17] focus:outline-none focus:border-[#a07840]" />
        </div>

        <div>
          <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-3">상세 설명</label>
          <textarea value={form.description} onChange={e => updateForm('description', e.target.value)}
            rows={4}
            className="w-full border border-[#d8d2c8] bg-white px-4 py-3 text-sm text-[#1c1a17] focus:outline-none focus:border-[#a07840] resize-none" />
        </div>

        <div>
          <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-3">일정</label>
          <input value={form.schedule} onChange={e => updateForm('schedule', e.target.value)}
            className="w-full border border-[#d8d2c8] bg-white px-4 py-3 text-sm text-[#1c1a17] focus:outline-none focus:border-[#a07840]" />
        </div>

        <div>
          <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-3">강사료 조건</label>
          <input value={form.fee} onChange={e => updateForm('fee', e.target.value)}
            className="w-full border border-[#d8d2c8] bg-white px-4 py-3 text-sm text-[#1c1a17] focus:outline-none focus:border-[#a07840]" />
        </div>

        <div className="flex gap-3">
          <button onClick={() => router.push('/mypage')}
            className="flex-1 border border-[#d8d2c8] py-4 text-sm hover:border-[#1c1a17] transition">
            ← 취소
          </button>
          <button onClick={handleSubmit} disabled={sending}
            className="flex-1 bg-[#a07840] text-white py-4 text-sm font-medium hover:opacity-90 transition disabled:opacity-30">
            {sending ? '저장 중...' : '수정 완료 ✅'}
          </button>
        </div>

      </div>
    </main>
  )
}

export default function EditPost() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f4ee]" />}>
      <EditPostForm />
    </Suspense>
  )
}