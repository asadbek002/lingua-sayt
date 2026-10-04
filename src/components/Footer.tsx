"use client";

import Link from "next/link";
import { Phone, Mail, Clock, Send, MapPin } from "lucide-react";
import InstagramIcon from "@/components/icons/InstagramIcon";
import { company } from "@/data/company";
import { useLocale } from "@/i18n/LocaleContext";
import { BrandLogo } from "@/components/Header";
import { formatPhone } from "@/lib/utils/formatPhone";

export default function Footer() {
  const { t } = useLocale();
  const officeLabels = [t.contacts.namangan, t.contacts.tashkent];

  return (
    <footer className="bg-[#1a1a2e] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-5" aria-label="Lingua Translation">
              <BrandLogo dark />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {t.footer.description}
            </p>
            <div className="flex gap-3">
              <a
                href={company.socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="w-10 h-10 bg-[#0088cc] rounded-lg flex items-center justify-center hover:bg-[#006699] transition-colors"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href={company.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">
              {t.footer.servicesHeading}
            </h3>
            <ul className="space-y-2.5">
              {t.footer.serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">
                  {t.nav.blog}
                </Link>
              </li>
            </ul>
          </div>

          {/* Offices */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">
              {t.footer.officesHeading}
            </h3>
            {company.offices.map((office, idx) => (
              <div key={office.city} className="mb-5">
                <p className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  {officeLabels[idx] ?? office.label}
                </p>
                <a
                  href={`tel:${office.phone}`}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="tabular-nums">{formatPhone(office.phone)}</span>
                </a>
                <a
                  href={office.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-400 underline underline-offset-2 decoration-white/20 hover:text-white transition-colors mt-1.5 inline-block"
                >
                  {t.footer.openMap}
                </a>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">
              {t.footer.contactsHeading}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-400 flex-shrink-0" />
                <a
                  href={`mailto:${company.email}`}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {company.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-sm text-gray-400">{company.workingHours}</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/#application"
                className="flex items-center justify-center h-11 px-4 bg-[#c41e3a] text-white text-sm font-semibold rounded-lg hover:bg-[#a01830] transition-colors"
              >
                {t.footer.apply}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Lingua Translation. {t.footer.rights}
          </p>
          <Link
            href="/admin"
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
