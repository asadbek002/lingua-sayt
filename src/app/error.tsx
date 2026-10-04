"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-bold text-[#1a1a2e]">Что-то пошло не так</h1>
      <p className="text-gray-500">Попробуйте обновить страницу.</p>
      <button onClick={reset} className="px-5 py-2.5 bg-[#c41e3a] text-white font-semibold rounded-xl">
        Повторить
      </button>
    </div>
  );
}
