import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-5xl font-black text-[#c41e3a]">404</h1>
      <p className="text-gray-500">Страница не найдена</p>
      <Link href="/" className="px-5 py-2.5 bg-[#c41e3a] text-white font-semibold rounded-xl">
        На главную
      </Link>
    </div>
  );
}
