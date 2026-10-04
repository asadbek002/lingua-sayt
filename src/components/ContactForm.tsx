"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema, type ApplicationFormData } from "@/lib/validations/applicationSchema";
import { Upload, X, CheckCircle2, Loader2, FileText } from "lucide-react";
import { useLocale } from "@/i18n/LocaleContext";

const ALLOWED_TYPES = ".pdf,.jpg,.jpeg,.png,.doc,.docx";
const MAX_SIZE_MB = 15;

export default function ContactForm() {
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLocale();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(t.form.fileTooLarge);
      return;
    }
    setFile(f);
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setServerError(null);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    if (file) {
      formData.append("file", file);
    }

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        setSubmitted(true);
        reset();
        setFile(null);
      } else {
        setServerError(result.message || t.form.errorServer);
      }
    } catch {
      setServerError(t.form.errorConnection);
    }
  };

  const fieldClass = (hasError: boolean) =>
    `w-full px-4 py-3 sm:py-2.5 rounded-xl border text-base sm:text-sm text-[#1a1a2e] placeholder:text-gray-500 transition-colors outline-none focus:ring-4 ${
      hasError
        ? "border-red-300 bg-red-50 focus:ring-red-100"
        : "border-gray-200 hover:border-gray-300 focus:border-[#c41e3a] focus:ring-red-50"
    }`;

  if (submitted) {
    return (
      <section id="application" className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-[#1a1a2e] mb-3">{t.form.successTitle}</h3>
            <p className="text-gray-500 mb-8">{t.form.successSubtitle}</p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-2.5 bg-[#c41e3a] text-white font-semibold rounded-xl hover:bg-[#a01830] transition-colors"
            >
              {t.form.sendAnother}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="application" className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-[#c41e3a] text-sm font-semibold uppercase tracking-wider">
            {t.form.badge}
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-[#1a1a2e]">{t.form.title}</h2>
          <p className="mt-4 text-gray-500">{t.form.subtitle}</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Section 1: Contact */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <h3 className="text-base font-bold text-[#1a1a2e] mb-5 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#c41e3a] text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
              {t.form.section1}
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t.form.name} <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("fullName")}
                  placeholder={t.form.namePlaceholder}
                  className={fieldClass(!!errors.fullName)}
                />
                {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t.form.phone} <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("phone")}
                  placeholder={t.form.phonePlaceholder}
                  type="tel"
                  className={fieldClass(!!errors.phone)}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t.form.city} <span className="text-red-500">*</span>
                </label>
                <select {...register("city")} className={`${fieldClass(!!errors.city)} bg-white`}>
                  <option value="">{t.form.cityPlaceholder}</option>
                  {t.form.cityOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t.form.messenger} <span className="text-red-500">*</span>
                </label>
                <select {...register("preferredMessenger")} className={`${fieldClass(!!errors.preferredMessenger)} bg-white`}>
                  <option value="">{t.form.messengerPlaceholder}</option>
                  {t.form.messengerOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {errors.preferredMessenger && (
                  <p className="mt-1 text-xs text-red-500">{errors.preferredMessenger.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t.form.messengerContact}
                </label>
                <input
                  {...register("messengerContact")}
                  placeholder={t.form.messengerContactPlaceholder}
                  className={fieldClass(false)}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Translation Info */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <h3 className="text-base font-bold text-[#1a1a2e] mb-5 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#c41e3a] text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>
              {t.form.section2}
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t.form.service} <span className="text-red-500">*</span>
                </label>
                <select {...register("serviceType")} className={`${fieldClass(!!errors.serviceType)} bg-white`}>
                  <option value="">{t.form.servicePlaceholder}</option>
                  {t.form.serviceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {errors.serviceType && (
                  <p className="mt-1 text-xs text-red-500">{errors.serviceType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t.form.sourceLanguage}
                </label>
                <select {...register("sourceLanguage")} className={`${fieldClass(false)} bg-white`}>
                  <option value="">{t.form.sourceLangPlaceholder}</option>
                  {t.form.languageList.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t.form.targetLanguage}
                </label>
                <select {...register("targetLanguage")} className={`${fieldClass(false)} bg-white`}>
                  <option value="">{t.form.targetLangPlaceholder}</option>
                  {t.form.languageList.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t.form.urgency} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {t.form.urgencyOptions.map((opt) => (
                    <label key={opt.value} className="cursor-pointer">
                      <input
                        type="radio"
                        value={opt.value}
                        {...register("urgency")}
                        className="sr-only peer"
                      />
                      <div className="text-center px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 peer-focus-visible:ring-4 peer-focus-visible:ring-red-100 peer-checked:border-[#c41e3a] peer-checked:bg-red-50 peer-checked:text-[#c41e3a] peer-checked:font-medium transition-all hover:border-gray-300">
                        {opt.label}
                      </div>
                    </label>
                  ))}
                </div>
                {errors.urgency && (
                  <p className="mt-1 text-xs text-red-500">{errors.urgency.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Document */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <h3 className="text-base font-bold text-[#1a1a2e] mb-5 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#c41e3a] text-white rounded-full text-xs flex items-center justify-center font-bold">3</span>
              {t.form.section3}
            </h3>

            {!file ? (
              <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-[#c41e3a] hover:bg-red-50/30 transition-all">
                <Upload className="w-8 h-8 text-gray-500 mb-2" />
                <p className="text-sm font-medium text-gray-600 mb-1">{t.form.fileTitle}</p>
                <p className="text-xs text-gray-500">{t.form.fileSubtitle}</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ALLOWED_TYPES}
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-200">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Section 4: Comment */}
          <div className="p-6 sm:p-8">
            <h3 className="text-base font-bold text-[#1a1a2e] mb-5 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#c41e3a] text-white rounded-full text-xs flex items-center justify-center font-bold">4</span>
              {t.form.section4}
            </h3>

            <textarea
              {...register("comment")}
              rows={3}
              placeholder={t.form.commentPlaceholder}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c41e3a] text-sm outline-none resize-none"
            />

            {serverError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{serverError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#c41e3a] text-white font-bold text-base rounded-xl hover:bg-[#a01830] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t.form.submitting}
                </>
              ) : (
                t.form.submit
              )}
            </button>

            <p className="mt-3 text-center text-xs text-gray-500">{t.form.privacy}</p>
          </div>
        </form>
      </div>
    </section>
  );
}
