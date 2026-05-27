import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from './components/Modal'
import {
  calculateTotals,
  decrease,
  increase,
  removeItem,
} from './features/cart/cartSlice'
import { openModal } from './features/modal/modalSlice'
import type { AppDispatch, RootState } from './redux/store'

function App() {
  const dispatch = useDispatch<AppDispatch>()
  const { amount, cartItems, total } = useSelector((state: RootState) => state.cart)

  useEffect(() => {
    dispatch(calculateTotals())
  }, [cartItems, dispatch])

  return (
    <main className="min-h-screen bg-white font-sans text-slate-950">
      <div className="mx-auto min-h-screen w-full max-w-[730px] bg-white">
        <nav className="flex h-[61px] items-center justify-between bg-slate-800 px-4 text-white">
          <h1 className="text-2xl font-extrabold">Ohtani Ahn</h1>
          <div className="flex items-center gap-2 text-lg font-extrabold">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            <span>{amount}</span>
          </div>
        </nav>

        <section className="px-6 py-3 sm:px-[104px]">
          {cartItems.map((item) => (
            <article
              className="grid grid-cols-[56px_minmax(0,1fr)_74px] items-center gap-4 border-b border-slate-200 py-3"
              key={item.id}
            >
              <img
                className="h-14 w-14 rounded object-cover"
                src={item.img}
                alt={`${item.title} album cover`}
              />

              <div className="min-w-0">
                <h2 className="truncate text-[15px] font-extrabold leading-tight">
                  {item.title}
                </h2>
                <p className="truncate text-xs font-medium text-slate-600">
                  {item.singer}
                </p>
                <strong className="text-sm font-extrabold text-slate-800">
                  ${item.price}
                </strong>
                <button
                  className="mt-1 block text-xs font-semibold text-sky-600 transition hover:text-sky-800"
                  type="button"
                  onClick={() => dispatch(removeItem(item.id))}
                >
                  삭제
                </button>
              </div>

              <div className="flex w-[74px] justify-self-end overflow-hidden rounded bg-slate-200 text-sm font-bold text-slate-700 shadow-sm">
                <button
                  className="h-[30px] w-6 bg-slate-300 transition hover:bg-slate-400"
                  type="button"
                  aria-label={`${item.title} decrease amount`}
                  onClick={() => dispatch(decrease(item.id))}
                >
                  -
                </button>
                <span className="flex h-[30px] w-[26px] items-center justify-center border-x border-slate-200 bg-white font-medium text-slate-900">
                  {item.amount}
                </span>
                <button
                  className="h-[30px] w-6 bg-slate-300 transition hover:bg-slate-400"
                  type="button"
                  aria-label={`${item.title} increase amount`}
                  onClick={() => dispatch(increase(item.id))}
                >
                  +
                </button>
              </div>
            </article>
          ))}

          <footer className="pt-10 pb-8">
            <div className="mb-8 flex items-center justify-between border-t border-slate-300 pt-5 text-lg font-extrabold">
              <span>총 수량: {amount}개</span>
              <span>총 금액: ${total.toLocaleString()}</span>
            </div>
            <button
              className="mx-auto block rounded-md border border-slate-900 px-5 py-4 text-base font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white"
              type="button"
              onClick={() => dispatch(openModal())}
            >
              전체 삭제
            </button>
          </footer>
        </section>
      </div>

      <Modal />
    </main>
  )
}

export default App
