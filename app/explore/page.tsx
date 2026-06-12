'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

const fields = ['전체', '공학·기술', '경영·창업', '의료·바이오', '법·정책', '금융·경제']
const types  = ['전체', '전문가 등록', '대학 초청']

export default function Explore() {
  // DB에서 불러온 데이터를 담을 상태
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeField, setActiveField] = useState('전체')
  const [activeType,  setActiveType]  = useState('전체')
  const [search, setSearch] = useState('')

  // 페이지 열릴 때 DB에서 데이터 불러오기
  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('id', { ascending: false })

      if (error) {
        console.error(error)
      } else {
        setListings(data || [])
      }
      setLoading(false)
    }
    fetchProfiles()
  }, [])

  const filtered = listings.filter(item => {
    const matchField = activeField === '전체' || item.field === activeField
    const matchType  = activeType  === '전체' ||
      (activeType === '전문가 등록' && item.type === '전문가 (경험 나누기)') ||
      (activeType === '대학 초청'   && item.type === '대학·기관 (강사 초청)')
    const matchSearch = search === '' ||
      item.name?.includes(search) ||
      item.motive?.includes(search) ||
      item.field?.includes(search)
    return matchField && matchType && matchSearch
  })

  return (
    <main className="min-h-screen bg-[#f7f4ee]" style={{ fontFamily: 'sans-serif' }}>

      {/* 네비 */}
      <nav className="border-b border-[#d8d2c8] px-8 h-16 flex items-center justify-between">
        <a href="/" className="text-2xl font-light tracking-widest" style={{ fontFamily: 'Georgia, serif' }}>
          L<em className="text-[#a07840]">e</em>gado
        </a>
        <div className="hidden md:flex gap-8 text-sm text-[#8c857a]">
          <a href="/explore" className="text-[#1c1a17] font-medium">찾아보기</a>
          <a href="#" className="hover:text-[#1c1a17] transition">참여 형태</a>
          <a href="#" className="hover:text-[#1c1a17] transition">이용 방법</a>
        </div>
        <a href="/register"
          className="text-sm border border-[#3a6048] text-[#3a6048] px-4 py-2 hover:bg-[#3a6048] hover:text-white transition">
          참여 선언하기
        </a>
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
              <div key={i} className="border border-[#d8d2c8] bg-white hover:shadow-md transition overflow-hidden cursor-pointer">
                <div className="p-5 border-b border-[#d8d2c8]">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full
                      ${item.type === '전문가 (경험 나누기)'
                        ? 'bg-[#d8e8de] text-[#3a6048]'
                        : 'bg-[#f0e8d8] text-[#a07840]'}`}>
                      {item.type === '전문가 (경험 나누기)' ? '전문가 등록' : '대학 초청'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full
                      ${item.fee === '무상 기여' ? 'bg-[#d8e8de] text-[#3a6048]' :
                        item.fee === '실비만'   ? 'bg-[#f0e8d8] text-[#a07840]' :
                                                  'bg-[#e8e4de] text-[#8c857a]'}`}>
                      {item.fee}
                    </span>
                  </div>
                  <div className="font-semibold text-sm text-[#1c1a17] mb-1">{item.name}</div>
                  <div className="text-xs text-[#8c857a]">{item.career}</div>
                </div>
                <div className="p-5 bg-[#f7f4ee]">
                  <div className="text-xs italic text-[#a07840] mb-3">"{item.motive}"</div>
                  <div className="text-xs text-[#8c857a]">{item.region}</div>
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

    </main>
  )
}