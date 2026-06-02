import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  calculateTotals,
  clearCart,
  decrease,
  increase,
  removeItem,
} from './features/cart/cartSlice'
import type { AppDispatch, RootState } from './store'

function App() {
  const dispatch = useDispatch<AppDispatch>()
  const { cartItems, amount, total } = useSelector((state: RootState) => state.cart)

  useEffect(() => {
    dispatch(calculateTotals())
  }, [cartItems, dispatch])

  const formattedTotal = total.toLocaleString('ko-KR')

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <header className="sticky top-0 z-10 bg-slate-800 px-5 py-5 text-white shadow-sm sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="text-3xl font-bold tracking-normal sm:text-4xl">Ohtani Ahn</h1>
          <div className="flex items-center gap-2 text-2xl font-bold" aria-label={`전체 수량 ${amount}개`}>
            <span className="text-3xl" aria-hidden="true">
              🛒
            </span>
            <span>{amount}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-8">
        <section className="space-y-0">
          {cartItems.length === 0 ? (
            <div className="flex min-h-80 items-center justify-center border-b border-slate-200">
              <p className="text-xl font-semibold text-slate-500">장바구니가 비어 있습니다.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <article
                key={item.id}
                className="grid grid-cols-[80px_1fr] gap-4 border-b border-slate-200 py-5 sm:grid-cols-[120px_1fr_150px] sm:items-center sm:gap-6 sm:py-7"
              >
                <img
                  src={item.img}
                  alt={`${item.title} 앨범 커버`}
                  className="h-20 w-20 rounded object-cover sm:h-24 sm:w-24"
                />

                <div className="min-w-0 text-left">
                  <h2 className="break-keep text-xl font-bold leading-tight text-black sm:text-2xl">
                    {item.title}
                  </h2>
                  <p className="mt-1 break-keep text-base font-medium text-slate-500 sm:text-lg">
                    {item.singer}
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-800 sm:text-xl">
                    ${Number(item.price).toLocaleString('ko-KR')}
                  </p>
                  <button
                    type="button"
                    onClick={() => dispatch(removeItem(item.id))}
                    className="mt-3 text-sm font-semibold text-slate-400 transition hover:text-red-500"
                  >
                    삭제
                  </button>
                </div>

                <div className="col-span-2 flex justify-end sm:col-span-1">
                  <div className="grid h-10 w-36 grid-cols-3 overflow-hidden rounded border border-slate-300 bg-slate-200 text-lg font-semibold text-slate-800 sm:w-32">
                    <button
                      type="button"
                      onClick={() => dispatch(decrease(item.id))}
                      className="bg-slate-300 transition hover:bg-slate-400"
                      aria-label={`${item.title} 수량 감소`}
                    >
                      -
                    </button>
                    <span className="flex items-center justify-center bg-white">{item.amount}</span>
                    <button
                      type="button"
                      onClick={() => dispatch(increase(item.id))}
                      className="bg-slate-300 transition hover:bg-slate-400"
                      aria-label={`${item.title} 수량 증가`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>

        <div className="mt-8 flex flex-col gap-6 border-t border-slate-300 pt-6">
          <div className="flex items-center justify-between text-xl font-bold text-slate-900">
            <span>총 수량</span>
            <span>{amount}개</span>
          </div>
          <div className="flex items-center justify-between text-2xl font-extrabold text-slate-950">
            <span>총 금액</span>
            <span>${formattedTotal}</span>
          </div>
          <div className="flex justify-center pb-10">
            <button
              type="button"
              onClick={() => dispatch(clearCart())}
              disabled={cartItems.length === 0}
              className="rounded border border-black px-7 py-4 text-base font-medium text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-300 disabled:hover:bg-white"
            >
              전체 삭제
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
