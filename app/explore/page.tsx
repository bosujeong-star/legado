'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const fields = ['전체', '공학·기술', '경영·창업', '의료·바이오', '법·정책', '금융·경제']
const types  = ['전체', '전문가 등록', '대학 초청']

export default function Explore() {
  const router = useRouter()
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeField, setActiveField] = useState('전체')
  const [activeType,  setActiveType]  = useState('전체')
  const [search, setSearch] = useState('')
  const [activeFormat, setActiveFormat] = useState('전체')

  // 연결 요청 모달 상태
  const [selected, setSelected] = useState<any>(null)
  const [reqName, setReqName] = useState('')
  const [reqEmail, setReqEmail] = useState('')
  const [reqOrg, setReqOrg] = useState('')
  const [reqMessage, setReqMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const fetchAll = async () => {
      // 전문가 프로필 불러오기
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .order('id', { ascending: false })

      // 대학 공고 불러오기
      const { data: postingsData } = await supabase
        .from('postings')
        .select('*')
        .order('id', { ascending: false })

      // 두 데이터를 같은 모양으로 통일해서 합치기
      const profileItems = (profilesData || []).map(p => ({
        ...p,
        listingType: 'profile', // 구분용
        displayName: p.name,
        displayRole: p.career,
        displayMotive: p.motive,
        displayMeta: p.region,
      }))

      const postingItems = (postingsData || []).map(p => ({
        ...p,
        listingType: 'posting',
        type: '대학·기관 (강사 초청)',
        displayName: `${p.university} ${p.department || ''}`.trim(),
        displayRole: `${p.format} · ${p.schedule || ''}`.trim(),
        displayMotive: p.description,
        displayMeta: p.fee,
        field: p.field,
      }))

      setListings([...profileItems, ...postingItems])
      setLoading(false)
    }
    fetchAll()
  }, [])

  const filtered = listings.filter(item => {
    const matchField = activeField === '전체' || item.field === activeField
    const matchType  = activeType  === '전체' ||
      (activeType === '전문가 등록' && item.type === '전문가 (경험 나누기)') ||
      (activeType === '대학 초청'   && item.type === '대학·기관 (강사 초청)')
    const matchFormat = activeFormat === '전체' || item.format?.includes(activeFormat)
    const matchSearch = search === '' ||
      item.name?.includes(search) ||
      item.motive?.includes(search) ||
      item.field?.includes(search) ||
      item.career?.includes(search) ||
      item.subject?.includes(search)
    return matchField && matchType && matchFormat && matchSearch
  })

  const openModal = async (item: any) => {
    // 로그인 확인
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('연결 요청을 보내려면 먼저 로그인해주세요')
      router.push('/auth')
      return
    }

const myAccountType = user.user_metadata?.account_type || '개인'

    // 전문가 카드 → 기관 계정만 요청 가능
    if (item.listingType === 'profile' && myAccountType !== '기관') {
      alert('전문가에게 연결 요청을 보내려면 대학·기관 계정으로 로그인해주세요')
      return
    }

    // 대학 공고 카드 → 개인(전문가) 계정만 지원 가능
    if (item.listingType === 'posting' && myAccountType !== '개인') {
      alert('공고에 지원하려면 개인 계정으로 로그인해주세요')
      return
    }

    // 자기 자신의 게시물에는 접근 불가
    const myName = user.user_metadata?.name
    if (item.listingType === 'profile' && item.name === myName) {
      alert('본인 프로필에는 연결 요청을 보낼 수 없어요')
      return
    }
    if (item.listingType === 'posting' && item.contact_email === user.email) {
      alert('본인이 등록한 공고에는 지원할 수 없어요')
      return
    }

    setSelected(item)
    setSent(false)
    setReqName(user.user_metadata?.name || '')
    setReqEmail(user.email || '')
    setReqOrg('')
    setReqMessage('')
  }

  const closeModal = () => setSelected(null)

  const handleSendRequest = async () => {
    setSending(true)

    if (selected.listingType === 'profile') {
      // 전문가에게 연결 요청
      const { error } = await supabase
        .from('connections')
        .insert([{
          profile_id: selected.id,
          requester_name: reqName,
          requester_email: reqEmail,
          requester_org: reqOrg,
          message: reqMessage,
        }])

    if (error) {
        alert('전송 중 오류가 발생했습니다')
        console.error(error)
      } else {
        // 이메일 알림 발송
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: selected.career ? reqEmail : selected.contact_email,
            subject: '[Legado] 새로운 연결 요청이 왔습니다',
            html: `
              <h2>새로운 연결 요청</h2>
              <p><strong>${reqName}</strong>님이 연결 요청을 보냈습니다.</p>
              <p>소속: ${reqOrg}</p>
              <p>메시지: ${reqMessage}</p>
              <br/>
              <p><a href="https://legado-gules.vercel.app/mypage">Legado 마이페이지에서 확인하기</a></p>
            `
          })
        })
        setSent(true)
      }
    } else {
      // 대학 공고에 지원
      const { error } = await supabase
        .from('applications')
        .insert([{
          posting_id: selected.id,
          applicant_name: reqName,
          applicant_email: reqEmail,
          applicant_career: reqOrg,
          message: reqMessage,
        }])

    if (error) {
        alert('전송 중 오류가 발생했습니다')
        console.error(error)
      } else {
        // 기관 담당자에게 이메일 알림
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: selected.contact_email,
            subject: '[Legado] 새로운 지원자가 있습니다',
            html: `
              <h2>새로운 지원</h2>
              <p><strong>${reqName}</strong>님이 공고에 지원했습니다.</p>
              <p>경력: ${reqOrg}</p>
              <p>메시지: ${reqMessage}</p>
              <p>연락처: ${reqEmail}</p>
              <br/>
              <p><a href="https://legado-gules.vercel.app/mypage">Legado 마이페이지에서 확인하기</a></p>
            `
          })
        })
        setSent(true)
      }
    }

    setSending(false)
  }
  return (
    <main className="min-h-screen bg-[#f7f4ee]" style={{ fontFamily: 'sans-serif' }}>

      {/* 네비 */}
      <nav className="border-b border-[#d8d2c8] px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-light tracking-widest" style={{ fontFamily: 'Georgia, serif' }}>
          L<em className="text-[#a07840]">e</em>gado
        </Link>
        <div className="hidden md:flex gap-8 text-sm text-[#8c857a]">
          <Link href="/explore" className="text-[#1c1a17] font-medium">찾아보기</Link>
          <a href="#" className="hover:text-[#1c1a17] transition">참여 형태</a>
          <a href="#" className="hover:text-[#1c1a17] transition">이용 방법</a>
        </div>
        <Link href="/register"
          className="text-sm border border-[#3a6048] text-[#3a6048] px-4 py-2 hover:bg-[#3a6048] hover:text-white transition">
          참여 선언하기
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-16">

        {/* 헤더 */}
        <div className="mb-10">
          <p className="text-xs tracking-widest uppercase text-[#a07840] font-medium mb-3">찾아보기</p>
          <h1 className="text-4xl font-light mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            지금 <strong className="font-bold">연결을 기다리는</strong> 분들
          </h1>
          <p className="text-sm text-[#8c857a]">전문가와 대학이 함께 모여 있습니다</p>
        </div>

        {/* 검색 */}
        <div className="mb-6">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="이름, 분야, 주제로 검색"
            className="w-full md:w-96 border border-[#d8d2c8] bg-white px-4 py-3 text-sm text-[#1c1a17] focus:outline-none focus:border-[#3a6048]"
          />
        </div>

        {/* 필터 — 유형 */}
        <div className="flex gap-2 flex-wrap mb-3">
          {types.map(t => (
            <button key={t} onClick={() => setActiveType(t)}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition
                ${activeType === t
                  ? 'bg-[#1c1a17] text-white border-[#1c1a17]'
                  : 'bg-white text-[#8c857a] border-[#d8d2c8] hover:border-[#1c1a17]'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* 필터 — 분야 */}
        <div className="flex gap-2 flex-wrap mb-10">
          {fields.map(f => (
            <button key={f} onClick={() => setActiveField(f)}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition
                ${activeField === f
                  ? 'bg-[#a07840] text-white border-[#a07840]'
                  : 'bg-white text-[#8c857a] border-[#d8d2c8] hover:border-[#a07840]'}`}>
              {f}
            </button>
          ))}
        </div>

{/* 필터 — 참여 형태 */}
        <div className="flex gap-2 flex-wrap mb-10">
          {['전체', '정규강의', '특강·강연', '워크숍', '멘토링'].map(f => (
            <button key={f} onClick={() => setActiveFormat(f)}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition
                ${activeFormat === f
                  ? 'bg-[#3a6048] text-white border-[#3a6048]'
                  : 'bg-white text-[#8c857a] border-[#d8d2c8] hover:border-[#3a6048]'}`}>
              {f}
            </button>
          ))}
        </div>

        {/* 결과 수 */}
        <p className="text-xs text-[#8c857a] mb-6">{filtered.length}건의 결과</p>

        {/* 로딩 중 */}
        {loading ? (
          <div className="text-center py-24 text-[#8c857a]">
            <p className="text-sm">불러오는 중...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-[#8c857a]">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-sm">검색 결과가 없습니다</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
             <div key={i}
                onClick={() => openModal(item)}
                className="border border-[#d8d2c8] bg-white hover:shadow-md transition overflow-hidden cursor-pointer">
                <div className="p-5 border-b border-[#d8d2c8]">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full
                      ${item.listingType === 'profile'
                        ? 'bg-[#d8e8de] text-[#3a6048]'
                        : 'bg-[#f0e8d8] text-[#a07840]'}`}>
                      {item.listingType === 'profile' ? '전문가 등록' : '대학 초청'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full
                      ${item.displayMeta === '무상 기여' ? 'bg-[#d8e8de] text-[#3a6048]' :
                        item.displayMeta === '실비만'   ? 'bg-[#f0e8d8] text-[#a07840]' :
                                                  'bg-[#e8e4de] text-[#8c857a]'}`}>
                      {item.displayMeta}
                    </span>
                  </div>
                  <div className="font-semibold text-sm text-[#1c1a17] mb-1">{item.displayName}</div>
                  <div className="text-xs text-[#8c857a]">{item.displayRole}</div>
                </div>
                <div className="p-5 bg-[#f7f4ee]">
                  <div className="text-xs italic text-[#a07840] mb-3">"{item.displayMotive}"</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 푸터 */}
      <footer className="border-t border-[#d8d2c8] px-8 py-8 flex justify-between items-center mt-16">
        <div className="text-xl font-light tracking-widest" style={{ fontFamily: 'Georgia, serif' }}>
          L<em className="text-[#a07840]">e</em>gado
        </div>
        <div className="text-xs text-[#8c857a]">© 2025 Legado. 경험을 남기다.</div>
        <div className="flex gap-6 text-xs text-[#8c857a]">
          <a href="#" className="hover:text-[#1c1a17]">소개</a>
          <a href="#" className="hover:text-[#1c1a17]">이용약관</a>
          <a href="#" className="hover:text-[#1c1a17]">문의</a>
        </div>
      </footer>

      {/* 연결 요청 / 지원 모달 */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50"
          onClick={closeModal}>
          <div className="bg-[#f7f4ee] max-w-md w-full p-8 relative"
            onClick={e => e.stopPropagation()}>
            <button onClick={closeModal}
              className="absolute top-4 right-4 text-[#8c857a] hover:text-[#1c1a17] text-xl">
              ×
            </button>

            {!sent ? (
              <>
                <p className="text-xs tracking-widest uppercase text-[#a07840] font-medium mb-2">
                  {selected.listingType === 'profile' ? '연결 요청' : '지원하기'}
                </p>
                <h2 className="text-xl font-light mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                  {selected.displayName}
                </h2>
                <p className="text-xs text-[#8c857a] mb-6">{selected.displayRole}</p>

                <div className="space-y-3">
                  <input
                    value={reqName}
                    onChange={e => setReqName(e.target.value)}
                    placeholder={selected.listingType === 'profile' ? '담당자 이름' : '이름'}
                    className="w-full border border-[#d8d2c8] bg-white px-4 py-3 text-sm text-[#1c1a17] focus:outline-none focus:border-[#3a6048]"
                  />
                  <input
                    value={reqEmail}
                    onChange={e => setReqEmail(e.target.value)}
                    placeholder="이메일"
                    className="w-full border border-[#d8d2c8] bg-white px-4 py-3 text-sm text-[#1c1a17] focus:outline-none focus:border-[#3a6048]"
                  />
                  <input
                    value={reqOrg}
                    onChange={e => setReqOrg(e.target.value)}
                    placeholder={selected.listingType === 'profile' ? '소속 (예: 인하대학교 경영학과)' : '소속·경력'}
                    className="w-full border border-[#d8d2c8] bg-white px-4 py-3 text-sm text-[#1c1a17] focus:outline-none focus:border-[#3a6048]"
                  />
                  <textarea
                    value={reqMessage}
                    onChange={e => setReqMessage(e.target.value)}
                    placeholder={selected.listingType === 'profile' ? '전달하고 싶은 메시지를 남겨주세요' : '간단한 자기소개와 지원 동기를 남겨주세요'}
                    rows={4}
                    className="w-full border border-[#d8d2c8] bg-white px-4 py-3 text-sm text-[#1c1a17] focus:outline-none focus:border-[#3a6048] resize-none"
                  />
                </div>

                <button
                  onClick={handleSendRequest}
                  disabled={sending || !reqName || !reqEmail}
                  className="w-full bg-[#3a6048] text-white py-4 text-sm font-medium mt-6 hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed">
                  {sending ? '전송 중...' : selected.listingType === 'profile' ? '연결 요청 보내기' : '지원하기'}
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-3xl mb-4">🎉</p>
                <p className="text-lg mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  {selected.listingType === 'profile' ? '요청이 전달됐어요' : '지원이 완료됐어요'}
                </p>
                <p className="text-sm text-[#8c857a] mb-6">
                  {selected.listingType === 'profile'
                    ? `${selected.displayName}님께 연결 요청을 보냈습니다`
                    : `${selected.displayName}에 지원 의사를 전달했습니다`}
                </p>
                <button onClick={closeModal}
                  className="border border-[#d8d2c8] px-6 py-2 text-sm hover:border-[#1c1a17] transition">
                  닫기
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </main>
  )
}