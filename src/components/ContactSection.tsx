"use client";

import { Phone, Mail, Clock, MapPin, Send } from "lucide-react";
import InstagramIcon from "@/components/icons/InstagramIcon";
import { company } from "@/data/company";
import { formatPhone } from "@/lib/utils/formatPhone";
import { useLocale } from "@/i18n/LocaleContext";

export default function ContactSection() {
  const { t } = useLocale();

  const officeLabels = [t.contacts.namangan, t.contacts.tashkent];

  return (
    <section id="contacts" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-[#c41e3a] text-sm font-semibold uppercase tracking-wider">
            {t.contacts.badge}
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-[#1a1a2e]">{t.contacts.title}</h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">{t.contacts.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          {company.offices.map((office, idx) => (
            <div
              key={office.city}
              className="p-6 sm:p-8 bg-gray-50 rounded-3xl border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#c41e3a] rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1a1a2e]">{officeLabels[idx] ?? office.label}</h3>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#c41e3a] flex-shrink-0" />
                  <a
                    href={`tel:${office.phone}`}
                    className="text-gray-700 hover:text-[#c41e3a] font-medium transition-colors"
                  >
                    <span className="tabular-nums">{formatPhone(office.phone)}</span>
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#c41e3a] flex-shrink-0" />
                  <span className="text-gray-600">{company.workingHours}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 sm:gap-3">
                <a
                  href={`tel:${office.phone}`}
                  className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 h-11 px-4 bg-[#c41e3a] text-white text-sm font-semibold rounded-lg hover:bg-[#a01830] transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {t.contacts.call}
                </a>
                <a
                  href={office.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 h-11 px-4 bg-white text-gray-700 whitespace-nowrap text-sm font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  {t.contacts.map}
                </a>
                <a
                  href={company.socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 h-11 px-4 bg-[#0088cc] text-white text-sm font-semibold rounded-lg hover:bg-[#006699] transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Telegram
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* General contacts */}
        <div className="mt-6 sm:mt-8 p-6 sm:p-8 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-3xl">
          <h3 className="text-lg font-bold text-white mb-6">{t.contacts.generalContacts}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <a
                  href={`mailto:${company.email}`}
                  className="text-sm text-white hover:text-red-300 transition-colors break-all"
                >
                  {company.email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                <Send className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Telegram</p>
                <a
                  href={company.socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white hover:text-red-300 transition-colors"
                >
                  @linguatranslate1
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                <InstagramIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Instagram</p>
                <a
                  href={company.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white hover:text-red-300 transition-colors"
                >
                  @lingua_translation1
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-400">{t.contacts.hours}</p>
                <p className="text-sm text-white">{company.workingHours}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
