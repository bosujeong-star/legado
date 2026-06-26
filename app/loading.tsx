export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f7f4ee] flex items-center justify-center">
      <div className="text-center">
        <div className="text-3xl font-light tracking-widest mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          L<em className="text-[#a07840]">e</em>gado
        </div>
        <div className="flex gap-1 justify-center">
          <div className="w-2 h-2 bg-[#a07840] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-[#a07840] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-[#a07840] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  )
}