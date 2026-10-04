"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

const LINKS = [
  { href: "/admin/applications", label: "Заявки" },
  { href: "/admin/blog", label: "Блог" },
  { href: "/admin/seo", label: "SEO" },
  { href: "/admin/google-business", label: "Google Business" },
];

export default function AdminNav({
  title,
  subtitle,
  onLogout,
  children,
}: {
  title: string;
  subtitle: string;
  onLogout: () => void;
  children?: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-lg font-bold text-[#1a1a2e]">{title}</h1>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`text-sm px-3 py-1.5 rounded-lg ${
              pathname === l.href ? "text-[#c41e3a] font-semibold bg-red-50" : "text-gray-500 hover:text-[#c41e3a]"
            }`}
          >
            {l.label}
          </Link>
        ))}
        {children}
        <button
          onClick={onLogout}
          title="Выйти"
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-gray-50"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
