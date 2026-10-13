// 페이지를 옮기는 동안 잠깐 보이는 뼈대. 실제 페이지와 같은 순서(흙바닥 띠 → 제목 → 카드)로 자리를 잡는다.
export default function Loading() {
  return (
    <div role="status" aria-label="페이지를 불러오는 중" className="pb-16">
      <div className="bg-dirt">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
          <div className="h-10 w-48 rounded-xl bg-white/25 sm:h-14 sm:w-72" />
          <div className="mt-4 h-5 w-full max-w-md rounded-lg bg-white/20" />
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4">
        <div className="skeleton mt-14 h-8 w-32 rounded-xl" />
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(key => (
            <div key={key} className="skeleton h-44 rounded-[18px]" />
          ))}
        </div>
      </div>
    </div>
  );
}
