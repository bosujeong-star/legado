'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function RegisterForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const editId = searchParams.get('edit') // 수정 모드면 프로필 id가 들어있음

  const [step, setStep] = useState(1)
  const [loadingExisting, setLoadingExisting] = useState(!!editId)
  const [form, setForm] = useState({
    type: '',
    name: '',
    career: '',
    field: '',
    motive: '',
    format: [] as string[],
    region: '',
    fee: '',
  })

  // 수정 모드면 기존 데이터 불러오기
  useEffect(() => {
    const loadExisting = async () => {
      if (!editId) return

      // 로그인 확인
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', editId)
        .single()

      if (error || !data) {
        alert('프로필을 찾을 수 없습니다')
        router.push('/mypage')
        return
      }

      // 내 프로필인지 확인
      if (data.name !== user.user_metadata?.name) {
        alert('본인의 프로필만 수정할 수 있습니다')
        router.push('/mypage')
        return
      }

      setForm({
        type: data.type || '',
        name: data.name || '',
        career: data.career || '',
        field: data.field || '',
        motive: data.motive || '',
        format: data.format ? data.format.split(', ') : [],
        region: data.region || '',
        fee: data.fee || '',
      })
      setLoadingExisting(false)
    }
    loadExisting()
  }, [editId])

  const updateForm = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const toggleFormat = (f: string) => {
    setForm(prev => ({
      ...prev,
      format: prev.format.includes(f)
        ? prev.format.filter(x => x !== f)
        : [...prev.format, f]
    }))
  }

  // 새로 만들기 또는 수정해서 저장하는 함수
  const handleSubmit = async () => {
    const payload = {
      type: form.type,
      name: form.name,
      career: form.career,
      field: form.field,
      motive: form.motive,
      format: form.format.join(', '),
      region: form.region,
      fee: form.fee,
    }

    if (editId) {
      // 수정 모드: 기존 row 업데이트
      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', editId)

      if (error) {
        alert('수정 중 오류가 발생했습니다')
        console.error(error)
      } else {
        alert('프로필이 수정됐습니다! 🎉')
        router.push('/mypage')
      }
    } else {
      // 신규 등록
      const { error } = await supabase
        .from('profiles')
        .insert([payload])

      if (error) {
        alert('저장 중 오류가 발생했습니다')
        console.error(error)
      } else {
        alert('참여 선언이 완료됐습니다! 🎉')
        router.push('/mypage')
      }
    }
  }

  if (loadingExisting) {
    return (
      <main className="min-h-screen bg-[#f7f4ee] flex items-center justify-center">
        <p className="text-sm text-[#8c857a]">불러오는 중...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee]" style={{ fontFamily: 'sans-serif' }}>

      {/* 네비 */}
      <nav className="border-b border-[#d8d2c8] px-8 h-16 flex items-center justify-between">
        <a href="/" className="text-2xl font-light tracking-widest" style={{ fontFamily: 'Georgia, serif' }}>
          L<em className="text-[#a07840]">e</em>gado
        </a>
        <span className="text-sm text-[#8c857a]">{editId ? '프로필 수정' : '참여 선언'}</span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* 진행 단계 */}
        <div className="flex items-center gap-3 mb-12">
          {[1, 2, 3].map(n => (
            <div key={n} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition
                ${step >= n ? 'bg-[#3a6048] text-white' : 'bg-[#ece7dc] text-[#8c857a]'}`}>
                {n}
              </div>
              {n < 3 && <div className={`w-16 h-px ${step > n ? 'bg-[#3a6048]' : 'bg-[#d8d2c8]'}`} />}
            </div>
          ))}
          <span className="text-sm text-[#8c857a] ml-2">
            {step === 1 ? '기본 정보' : step === 2 ? '참여 동기' : '참여 형태'}
          </span>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-light mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                어떤 분이신가요?
              </h2>
              <p className="text-sm text-[#8c857a]">학위나 직함보다, 어떤 경험을 가지셨는지가 중요합니다.</p>
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-3">참여 유형</label>
              <div className="grid grid-cols-2 gap-3">
                {['전문가 (경험 나누기)', '대학·기관 (강사 초청)'].map(t => (
                  <button key={t} onClick={() => updateForm('type', t)}
                    className={`p-4 border text-sm text-left transition
                      ${form.type === t
                        ? 'border-[#3a6048] bg-[#d8e8de] text-[#3a6048]'
                        : 'border-[#d8d2c8] hover:border-[#3a6048]'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-3">이름</label>
              <input
                value={form.name}
                onChange={e => updateForm('name', e.target.value)}
                placeholder="홍길동"
                className="w-full border border-[#d8d2c8] bg-white px-4 py-3 text-sm text-[#1c1a17] focus:outline-none focus:border-[#3a6048]"
              />
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-3">주요 경력</label>
              <input
                value={form.career}
                onChange={e => updateForm('career', e.target.value)}
                placeholder="예: 전 삼성전자 DS부문 상무 · 반도체 공정 20년"
                className="w-full border border-[#d8d2c8] bg-white px-4 py-3 text-sm text-[#1c1a17] focus:outline-none focus:border-[#3a6048]"
              />
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-3">전문 분야</label>
              <div className="grid grid-cols-3 gap-2">
                {['공학·기술', '경영·창업', '의료·바이오', '법·정책', '금융·경제', '문화·예술'].map(f => (
                  <button key={f} onClick={() => updateForm('field', f)}
                    className={`p-3 border text-xs text-center transition
                      ${form.field === f
                        ? 'border-[#a07840] bg-[#f0e8d8] text-[#a07840]'
                        : 'border-[#d8d2c8] hover:border-[#a07840]'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!form.type || !form.name || !form.career || !form.field}
              className="w-full bg-[#1c1a17] text-white py-4 text-sm font-medium hover:bg-[#3a6048] transition disabled:opacity-30 disabled:cursor-not-allowed">
              다음 단계 →
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-light mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                왜 나누고 싶으신가요?
              </h2>
              <p className="text-sm text-[#8c857a]">이 한 줄이 대학 담당자의 마음을 움직입니다.</p>
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-3">참여 동기</label>
              <textarea
                value={form.motive}
                onChange={e => updateForm('motive', e.target.value)}
                placeholder="예: 30년 현장 경험을 다음 세대에게 남기고 싶어서요"
                rows={4}
                className="w-full border border-[#d8d2c8] bg-white px-4 py-3 text-sm text-[#1c1a17] focus:outline-none focus:border-[#3a6048] resize-none"
              />
              <p className="text-xs text-[#8c857a] mt-2">프로필 카드에 이탤릭체로 표시됩니다</p>
            </div>

            {form.motive && (
              <div className="border border-[#d8d2c8] bg-white p-5">
                <p className="text-xs tracking-widest uppercase text-[#8c857a] mb-3">미리보기</p>
                <div className="font-semibold text-sm mb-1">{form.name}</div>
                <div className="text-xs text-[#8c857a] mb-3">{form.career}</div>
                <div className="text-sm italic text-[#a07840] border-t border-[#d8d2c8] pt-3">
                  "{form.motive}"
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 border border-[#d8d2c8] py-4 text-sm hover:border-[#1c1a17] transition">
                ← 이전
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!form.motive}
                className="flex-1 bg-[#1c1a17] text-white py-4 text-sm font-medium hover:bg-[#3a6048] transition disabled:opacity-30 disabled:cursor-not-allowed">
                다음 단계 →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-light mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                어떻게 참여하실 건가요?
              </h2>
              <p className="text-sm text-[#8c857a]">복수 선택 가능합니다.</p>
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-3">참여 형태</label>
              <div className="grid grid-cols-2 gap-3">
                {['정규 강의', '특강·강연', '워크숍', '멘토링'].map(f => (
                  <button key={f} onClick={() => toggleFormat(f)}
                    className={`p-4 border text-sm text-left transition
                      ${form.format.includes(f)
                        ? 'border-[#3a6048] bg-[#d8e8de] text-[#3a6048]'
                        : 'border-[#d8d2c8] hover:border-[#3a6048]'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-3">참여 조건</label>
              <div className="grid grid-cols-3 gap-3">
                {['무상 기여', '실비만', '협의 가능'].map(f => (
                  <button key={f} onClick={() => updateForm('fee', f)}
                    className={`p-3 border text-sm text-center transition
                      ${form.fee === f
                        ? 'border-[#3a6048] bg-[#d8e8de] text-[#3a6048]'
                        : 'border-[#d8d2c8] hover:border-[#3a6048]'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-[#a07840] font-medium block mb-3">선호 지역</label>
              <input
                value={form.region}
                onChange={e => updateForm('region', e.target.value)}
                placeholder="예: 서울·경기, 전국, 온라인 가능"
                className="w-full border border-[#d8d2c8] bg-white px-4 py-3 text-sm text-[#1c1a17] focus:outline-none focus:border-[#3a6048]"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)}
                className="flex-1 border border-[#d8d2c8] py-4 text-sm hover:border-[#1c1a17] transition">
                ← 이전
              </button>
              <button
                onClick={handleSubmit}
                disabled={form.format.length === 0 || !form.fee}
                className="flex-1 bg-[#3a6048] text-white py-4 text-sm font-medium hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed">
                {editId ? '수정 완료 ✓' : '참여 선언하기 🎉'}
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}

export default function Register() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f4ee]" />}>
      <RegisterForm />
    </Suspense>
  )
}