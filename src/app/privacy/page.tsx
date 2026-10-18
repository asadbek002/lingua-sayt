import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { company } from "@/data/company";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://linguatranslation.uz";

export const metadata: Metadata = {
  title: "Политика конфиденциальности / Maxfiylik siyosati / Privacy Policy",
  description:
    "Как Lingua Translation собирает и использует персональные данные. Maxfiylik siyosati. Privacy policy.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

const phones = company.phones.map((p) => p.phone).join(", ");

const POLICY = [
  {
    id: "ru",
    title: "Политика конфиденциальности",
    updated: "Обновлено: октябрь 2026",
    blocks: [
      {
        h: "Кто мы",
        p: `Lingua Translation — бюро переводов с офисами в Намангане и Ташкенте (сайт ${SITE_URL}). Контакты: ${company.email}, ${phones}.`,
      },
      {
        h: "Какие данные мы собираем",
        p: "Данные, которые вы сами указываете: имя, номер телефона, город, контакт в мессенджере, комментарий к заявке, файлы документов, которые вы загружаете для перевода, и сообщения в чате на сайте. Также используются технические данные посещения сайта (страницы, тип устройства) через сервисы аналитики.",
      },
      {
        h: "Как мы используем данные",
        p: "Только для обработки вашей заявки, связи с вами, выполнения перевода и улучшения работы сайта. Мы не продаём персональные данные и не передаём их третьим лицам в рекламных целях.",
      },
      {
        h: "Кому доступны данные",
        p: "Сотрудникам Lingua Translation, которым они нужны для выполнения заказа. Для работы сайта используются сервисы Telegram (уведомления сотрудникам), Google и Яндекс (аналитика, отзывы, карточка организации). Эти сервисы действуют по собственным политикам.",
      },
      {
        h: "Сроки хранения и ваши права",
        p: `Данные хранятся столько, сколько нужно для выполнения заказа и обязательств по нему. Вы можете запросить уточнение или удаление своих данных, написав на ${company.email}.`,
      },
    ],
  },
  {
    id: "uz",
    title: "Maxfiylik siyosati",
    updated: "Yangilangan: 2026-yil oktyabr",
    blocks: [
      {
        h: "Biz kimmiz",
        p: `Lingua Translation — Namangan va Toshkentda ofislari bo'lgan tarjima byurosi (sayt ${SITE_URL}). Aloqa: ${company.email}, ${phones}.`,
      },
      {
        h: "Qanday ma'lumotlarni yig'amiz",
        p: "Siz o'zingiz kiritgan ma'lumotlar: ism, telefon raqami, shahar, messenjerdagi kontakt, arizaga izoh, tarjima uchun yuklagan hujjat fayllari va saytdagi chatdagi xabarlar. Shuningdek, tahlil xizmatlari orqali saytga tashrif haqidagi texnik ma'lumotlar (sahifalar, qurilma turi) ishlatiladi.",
      },
      {
        h: "Ma'lumotlardan qanday foydalanamiz",
        p: "Faqat arizangizni qayta ishlash, siz bilan bog'lanish, tarjimani bajarish va sayt ishini yaxshilash uchun. Shaxsiy ma'lumotlarni sotmaymiz va reklama maqsadida uchinchi shaxslarga bermaymiz.",
      },
      {
        h: "Ma'lumotlarga kim kira oladi",
        p: "Buyurtmani bajarish uchun kerak bo'lgan Lingua Translation xodimlari. Sayt ishlashi uchun Telegram (xodimlarga xabarnoma), Google va Yandex (tahlil, sharhlar, tashkilot kartochkasi) xizmatlaridan foydalaniladi. Bu xizmatlar o'z siyosatlari asosida ishlaydi.",
      },
      {
        h: "Saqlash muddati va huquqlaringiz",
        p: `Ma'lumotlar buyurtmani va u bo'yicha majburiyatlarni bajarish uchun zarur muddat saqlanadi. Ma'lumotlaringizni aniqlashtirish yoki o'chirishni ${company.email} manziliga yozib so'rashingiz mumkin.`,
      },
    ],
  },
  {
    id: "en",
    title: "Privacy Policy",
    updated: "Updated: October 2026",
    blocks: [
      {
        h: "Who we are",
        p: `Lingua Translation is a translation agency with offices in Namangan and Tashkent (website ${SITE_URL}). Contact: ${company.email}, ${phones}.`,
      },
      {
        h: "What data we collect",
        p: "The data you provide yourself: name, phone number, city, messenger contact, a comment on your request, the document files you upload for translation, and messages in the website chat. We also use technical visit data (pages viewed, device type) through analytics services.",
      },
      {
        h: "How we use the data",
        p: "Only to process your request, contact you, carry out the translation and improve the website. We do not sell personal data and do not share it with third parties for advertising.",
      },
      {
        h: "Who can access the data",
        p: "Lingua Translation staff who need it to complete your order. The website uses Telegram (staff notifications), Google and Yandex (analytics, reviews, business profile). These services operate under their own policies.",
      },
      {
        h: "Retention and your rights",
        p: `Data is kept as long as needed to complete the order and related obligations. You can ask us to correct or delete your data by writing to ${company.email}.`,
      },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">
          {POLICY.map((lang) => (
            <article key={lang.id} id={lang.id} lang={lang.id}>
              <h1 className="text-3xl font-bold text-[#1a1a2e] mb-2">{lang.title}</h1>
              <p className="text-sm text-gray-500 mb-6">{lang.updated}</p>
              <div className="space-y-5">
                {lang.blocks.map((b) => (
                  <section key={b.h}>
                    <h2 className="text-lg font-semibold text-[#1a1a2e] mb-1.5">{b.h}</h2>
                    <p className="text-gray-700 leading-relaxed">{b.p}</p>
                  </section>
                ))}
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
