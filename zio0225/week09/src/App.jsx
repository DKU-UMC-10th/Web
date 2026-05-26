import { useEffect } from 'react'
import { useMusicStore } from './store/useMusicStore' // Zustand 스토어 불러오기
import ConfirmModal from './components/modal/ConfirmModal'

const formatPrice = (value) =>
  new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 0 }).format(value)

function App() {
  // Zustand 스토어에서 상태와 액션을 통째로 꺼냅니다!
  const { 
    cartItems, amount, total, 
    increase, decrease, removeItem, 
    calculateTotals, openModal 
  } = useMusicStore();

  // 장바구니 변경 시 총 합계 계산 실행하는 로직은 그대로 유지하되 액션만 바뀜
  useEffect(() => {
    calculateTotals();
  }, [cartItems]);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 px-4 py-8">
      <ConfirmModal />

      <div className="mx-auto max-w-6xl">
        <header className="mb-8 rounded-[2rem] bg-white/90 p-6 shadow-xl ring-1 ring-slate-200 sm:flex sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Album Cart
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
              오늘의 음반 장바구니
            </h1>
            <p className="mt-3 text-slate-600">
              전체 수량 <span className="font-semibold text-slate-900">{amount}</span>개 · 총 금액{' '}
              <span className="font-semibold text-slate-900">₩{formatPrice(total)}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={openModal} // Redux dispatch 없이 다이렉트로 openModal() 호출
            disabled={cartItems.length === 0}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-rose-300 sm:mt-0"
          >
            전체 삭제
          </button>
        </header>

        {cartItems.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-12 text-center shadow-xl ring-1 ring-slate-200">
            <p className="text-xl font-semibold text-slate-950">장바구니가 비어있습니다.</p>
            <p className="mt-3 text-slate-600">추가된 음반이 없어요.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {cartItems.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-slate-200 sm:grid sm:grid-cols-[220px_1fr]">
                <img src={item.img} alt={item.title} className="h-64 w-full object-cover sm:h-full" />
                <div className="space-y-5 p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-950">{item.title}</h2>
                      <p className="mt-2 text-sm text-slate-600">{item.singer}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)} // dispatch 대신 직접 액션 함수 주입
                      className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                    >
                      삭제
                    </button>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-lg font-semibold text-slate-950">
                      ₩{formatPrice(Number(item.price))}
                    </p>
                    <div className="flex items-center gap-3 rounded-full bg-slate-100 p-2">
                      <button
                        type="button"
                        onClick={() => decrease(item.id)} // 직접 호출
                        className="h-10 w-10 rounded-full bg-white text-slate-700 shadow-sm transition hover:bg-slate-200"
                      >
                        -
                      </button>
                      <span className="min-w-[2rem] text-center text-base font-semibold text-slate-900">
                        {item.amount}
                      </span>
                      <button
                        type="button"
                        onClick={() => increase(item.id)} // 직접 호출
                        className="h-10 w-10 rounded-full bg-white text-slate-700 shadow-sm transition hover:bg-slate-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default App