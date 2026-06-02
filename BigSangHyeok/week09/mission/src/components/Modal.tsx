import { useCartStore } from '../store'

function Modal() {
  const { isOpen, closeModal, clearCart } = useCartStore()

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 backdrop-blur-md">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="clear-cart-title"
        className="w-full max-w-sm rounded-lg bg-white px-8 py-9 text-center shadow-2xl"
      >
        <h2 id="clear-cart-title" className="text-2xl font-bold text-slate-950">
          정말 삭제하시겠습니까?
        </h2>

        <div className="mt-7 flex justify-center gap-5">
          <button
            type="button"
            onClick={closeModal}
            className="rounded-md bg-slate-200 px-7 py-4 text-xl font-medium text-slate-700 transition hover:bg-slate-300"
          >
            아니요
          </button>
          <button
            type="button"
            onClick={clearCart}
            className="rounded-md bg-red-500 px-7 py-4 text-xl font-medium text-white transition hover:bg-red-600"
          >
            네
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
