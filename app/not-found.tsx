import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f7f4ee] flex items-center justify-center px-6"
      style={{ fontFamily: 'sans-serif' }}>

      <div className="text-center">
        <div className="text-6xl font-light tracking-widest mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          L<em className="text-[#a07840]">e</em>gado
        </div>

        <p className="text-8xl font-light text-[#d8d2c8] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          404
        </p>

        <p className="text-lg font-light text-[#1c1a17] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
          페이지를 찾을 수 없어요
        </p>
        <p className="text-sm text-[#8c857a] mb-10">
          주소가 잘못됐거나 삭제된 페이지예요
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/"
            className="bg-[#1c1a17] text-white px-8 py-3 text-sm hover:bg-[#a07840] transition">
            홈으로 가기
          </Link>
          <Link href="/explore"
            className="border border-[#d8d2c8] text-[#1c1a17] px-8 py-3 text-sm hover:border-[#1c1a17] transition">
            찾아보기
          </Link>
        </div>
      </div>

    </main>
  )
}