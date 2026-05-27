import { usePlaylistStore } from '../store/usePlaylistStore'

function Modal() {
  const { clearCart, closeModal, isOpen } = usePlaylistStore()

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-white/25 px-4 backdrop-blur-sm">
      <section
        className="w-full max-w-[185px] rounded-md bg-white px-4 py-6 text-center shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h2 id="modal-title" className="text-sm font-extrabold text-slate-950">
          정말 삭제하시겠습니까?
        </h2>
        <div className="mt-5 flex justify-center gap-3">
          <button
            className="rounded bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
            type="button"
            onClick={closeModal}
          >
            아니요
          </button>
          <button
            className="rounded bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
            type="button"
            onClick={clearCart}
          >
            네
          </button>
        </div>
      </section>
    </div>
  )
}

export default Modal
