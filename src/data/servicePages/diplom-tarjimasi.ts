import type { ServiceDef } from "./types";

export const diplomTarjimasi: ServiceDef = {
  slug: "diplom-tarjimasi",
  related: ["notarial-tarjima", "apostil", "metrka-tarjimasi"],
  copy: {
    ru: {
      label: "Перевод диплома",
      metaTitle: "Перевод диплома и аттестата в Намангане и Ташкенте",
      metaDescription:
        "Нотариальный перевод дипломов, аттестатов и академических справок в Намангане и Ташкенте. Быстро и официально.",
      h1: "Перевод дипломов и аттестатов",
      intro:
        "Нотариальный перевод школьных аттестатов, дипломов колледжей и университетов. Для учёбы за рубежом и официального использования.",
      serviceName: "Перевод дипломов и аттестатов",
      benefits: [
        "Перевод аттестатов школ с QR-кодом",
        "Дипломы колледжей и университетов",
        "Нотариальное заверение",
        "Принимается посольствами и университетами",
        "Опыт с корейским, английским, немецким",
        "Онлайн-приём документов",
      ],
      sections: [
        {
          heading: "Перевод диплома для учёбы и работы за рубежом",
          paragraphs: [
            "Перевод диплома требуется при поступлении в иностранный университет, подтверждении квалификации для работы за границей или прохождении процедуры нострификации диплома в другой стране. Мы выполняем точный перевод дипломов, приложений к ним, аттестатов и академических справок с сохранением всех названий предметов, оценок и учебных часов.",
            "Особое внимание уделяется корректному переводу названий учебных заведений, специальностей и квалификаций — от точности этих формулировок часто зависит признание диплома иностранным вузом или работодателем.",
          ],
        },
        {
          heading: "Нотариальное заверение перевода диплома",
          paragraphs: [
            "После перевода документ при необходимости заверяется нотариально — это делает перевод официальным и принимаемым государственными органами, посольствами и учебными заведениями. Мы также можем помочь с последующим апостилированием диплома, если это требуется для страны назначения.",
            "Обычный срок перевода диплома — 1–2 рабочих дня. Приложения к диплому с большим количеством предметов могут занять чуть больше времени в зависимости от объёма.",
          ],
        },
      ],
      faqs: [
        { question: "Какие дипломы вы переводите?", answer: "Мы переводим школьные аттестаты (с QR-кодом и без), дипломы колледжей, дипломы бакалавров и магистров, академические справки и приложения к дипломам." },
        { question: "Нужен ли нотариальный перевод диплома для учёбы за границей?", answer: "Да, большинство университетов и визовых центров требуют нотариально заверенный перевод диплома." },
        { question: "Принимают ли ваш перевод корейские университеты?", answer: "Мы готовим переводы в соответствии со стандартными требованиями. Рекомендуем уточнить конкретные требования в университете." },
        { question: "Сколько стоит перевод диплома?", answer: "Стоимость зависит от типа документа: от 190 000 до 270 000 сум. Для партнёров действуют специальные цены." },
      ],
    },
    uz: {
      label: "Diplom tarjimasi",
      metaTitle: "Diplom va attestat tarjimasi — Namangan va Toshkent",
      metaDescription:
        "Namangan va Toshkentda diplom, attestat va akademik ma'lumotnomalarning notarial tarjimasi. Tez va rasmiy.",
      h1: "Diplom va attestatlar tarjimasi",
      intro:
        "Maktab attestatlari, kollej va universitet diplomlarining notarial tarjimasi. Chet elda o'qish va rasmiy foydalanish uchun.",
      serviceName: "Diplom va attestatlar tarjimasi",
      benefits: [
        "QR-kodli maktab attestatlari tarjimasi",
        "Kollej va universitet diplomlari",
        "Notarial tasdiqlash",
        "Elchixona va universitetlar qabul qiladi",
        "Koreys, ingliz, nemis tillarida tajriba",
        "Hujjatlarni onlayn qabul qilish",
      ],
      sections: [
        {
          heading: "Chet elda o'qish va ishlash uchun diplom tarjimasi",
          paragraphs: [
            "Diplom tarjimasi xorijiy universitetga kirishda, chet elda ishlash uchun malakani tasdiqlashda yoki boshqa davlatda diplom nostrifikatsiyasidan o'tishda talab qilinadi. Diplomlar, ilovalari, attestatlar va akademik ma'lumotnomalarni barcha fan nomlari, baholar va o'quv soatlarini saqlagan holda aniq tarjima qilamiz.",
            "O'quv yurtlari, mutaxassisliklar va malakalar nomlarining to'g'ri tarjimasiga alohida e'tibor beramiz — diplomning xorijiy oliygoh yoki ish beruvchi tomonidan tan olinishi ko'pincha shu iboralarning aniqligiga bog'liq.",
          ],
        },
        {
          heading: "Diplom tarjimasini notarial tasdiqlash",
          paragraphs: [
            "Tarjimadan keyin hujjat kerak bo'lsa notarial tasdiqlanadi — bu tarjimani rasmiy qiladi va davlat organlari, elchixonalar hamda o'quv yurtlari qabul qiladi. Agar boradigan davlat talab qilsa, diplomga apostil qo'yishda ham yordam beramiz.",
            "Diplom tarjimasining odatiy muddati — 1–2 ish kuni. Fanlari ko'p bo'lgan ilovalar hajmiga qarab bir oz ko'proq vaqt olishi mumkin.",
          ],
        },
      ],
      faqs: [
        { question: "Qanday diplomlarni tarjima qilasiz?", answer: "Maktab attestatlari (QR-kodli va kodsiz), kollej diplomlari, bakalavr va magistr diplomlari, akademik ma'lumotnomalar va diplom ilovalarini tarjima qilamiz." },
        { question: "Chet elda o'qish uchun diplomning notarial tarjimasi kerakmi?", answer: "Ha, aksariyat universitetlar va viza markazlari diplomning notarial tasdiqlangan tarjimasini talab qiladi." },
        { question: "Koreya universitetlari tarjimangizni qabul qiladimi?", answer: "Tarjimalarni standart talablarga muvofiq tayyorlaymiz. Aniq talablarni universitetdan so'rab olishni tavsiya qilamiz." },
        { question: "Diplom tarjimasi qancha turadi?", answer: "Narx hujjat turiga bog'liq: 190 000 dan 270 000 so'mgacha. Hamkorlar uchun maxsus narxlar mavjud." },
      ],
    },
    en: {
      label: "Diploma translation",
      metaTitle: "Diploma and Certificate Translation in Namangan and Tashkent",
      metaDescription:
        "Notarized translation of diplomas, school certificates and academic records in Namangan and Tashkent. Fast and official.",
      h1: "Translation of diplomas and certificates",
      intro:
        "Notarized translation of school certificates, college and university diplomas. For studying abroad and official use.",
      serviceName: "Translation of diplomas and certificates",
      benefits: [
        "Translation of school certificates with QR code",
        "College and university diplomas",
        "Notarial certification",
        "Accepted by embassies and universities",
        "Experience with Korean, English, German",
        "Online document submission",
      ],
      sections: [
        {
          heading: "Diploma translation for study and work abroad",
          paragraphs: [
            "A diploma translation is required to enrol at a foreign university, to confirm your qualification for work abroad, or to have a diploma recognised in another country. We translate diplomas, their supplements, school certificates and academic records accurately, keeping every subject name, grade and credit hour.",
            "We pay special attention to translating the names of institutions, specialisations and qualifications correctly — recognition of a diploma by a foreign university or employer often depends on the precision of these wordings.",
          ],
        },
        {
          heading: "Notarial certification of a diploma translation",
          paragraphs: [
            "After translation the document can be notarized, which makes it official and acceptable to government bodies, embassies and universities. We can also help with apostillising the diploma if the destination country requires it.",
            "The usual turnaround for a diploma translation is 1–2 working days. Supplements with many subjects may take a little longer depending on volume.",
          ],
        },
      ],
      faqs: [
        { question: "Which diplomas do you translate?", answer: "School certificates (with and without QR code), college diplomas, bachelor's and master's diplomas, academic records and diploma supplements." },
        { question: "Do I need a notarized diploma translation to study abroad?", answer: "Yes, most universities and visa centres require a notarized translation of the diploma." },
        { question: "Do Korean universities accept your translations?", answer: "We prepare translations according to standard requirements. We recommend checking the specific requirements with the university." },
        { question: "How much does a diploma translation cost?", answer: "The cost depends on the type of document: from 190,000 to 270,000 UZS. Special prices apply for partners." },
      ],
    },
  },
};
