import type { Locale } from "./config";

export type ServiceItem = { title: string; description: string };
export type AudienceItem = { emoji: string; title: string; desc: string };
export type ProcessStep = { title: string; description: string };
export type LangItem = { name: string; flag: string; code: string };
export type FooterLink = { label: string; href: string };
export type SelectOption = { value: string; label: string };

export type TranslationSchema = {
  nav: {
    home: string; services: string; prices: string; languages: string;
    process: string; benefits: string; contacts: string; blog: string; apply: string; telegram: string;
  };
  blog: {
    badge: string; title: string; subtitle: string; empty: string;
    back: string; faq: string; ctaTitle: string; ctaText: string; ctaButton: string;
    latestBadge: string; latestTitle: string; allPosts: string; dateLocale: string;
  };
  hero: {
    badge: string; title: string; subtitle: string;
    primaryButton: string; telegramButton: string; officesButton: string;
    servicesCardTitle: string;
    statLanguages: string; statLanguagesLabel: string;
    statOffices: string; statOfficesLabel: string;
    statOnline: string; statOnlineLabel: string;
    officesLabel: string; onlineLabel: string; onlineSubLabel: string;
    serviceHighlights: string[];
  };
  services: {
    badge: string; title: string; subtitle: string; learnMore: string;
    items: ServiceItem[];
  };
  prices: {
    badge: string; title: string; subtitle: string;
    regularClients: string; partners: string;
    price: string; secondCopy: string; duration: string; tbd: string;
    note: string; exactPrice: string; askPriceBtn: string;
    categoryLabels: { tarjima: string; additional: string };
  };
  form: {
    badge: string; title: string; subtitle: string;
    section1: string; section2: string; section3: string; section4: string;
    name: string; namePlaceholder: string;
    phone: string; phonePlaceholder: string;
    city: string; cityPlaceholder: string;
    messenger: string; messengerPlaceholder: string;
    messengerContact: string; messengerContactPlaceholder: string;
    service: string; servicePlaceholder: string;
    sourceLanguage: string; sourceLangPlaceholder: string;
    targetLanguage: string; targetLangPlaceholder: string;
    urgency: string;
    fileTitle: string; fileSubtitle: string; fileTooLarge: string;
    commentPlaceholder: string;
    submit: string; submitting: string; privacy: string;
    successTitle: string; successSubtitle: string; sendAnother: string;
    errorServer: string; errorConnection: string;
    cityOptions: SelectOption[];
    messengerOptions: SelectOption[];
    serviceOptions: SelectOption[];
    urgencyOptions: SelectOption[];
    languageList: string[];
  };
  contacts: {
    badge: string; title: string; subtitle: string;
    namangan: string; tashkent: string;
    call: string; map: string; telegram: string; hours: string;
    generalContacts: string;
  };
  benefits: {
    badge: string; title: string; items: string[];
    officeTitle: string;
    nameNamangan: string; subNamangan: string;
    nameTashkent: string; subTashkent: string;
    nameOnline: string; subOnline: string;
    audienceBadge: string; audienceTitle: string;
    audience: AudienceItem[];
  };
  process: {
    badge: string; title: string; subtitle: string; startNow: string;
    steps: ProcessStep[];
  };
  languages: {
    badge: string; title: string; subtitle: string;
    items: LangItem[];
  };
  footer: {
    description: string;
    servicesHeading: string; officesHeading: string; contactsHeading: string;
    apply: string; rights: string;
    openMap: string;
    serviceLinks: FooterLink[];
  };
};

const ru: TranslationSchema = {
  nav: {
    home: "Главная", services: "Услуги", prices: "Цены", languages: "Языки",
    process: "Как мы работаем", benefits: "Почему мы", blog: "Блог", contacts: "Контакты",
    apply: "Оставить заявку", telegram: "Telegram",
  },
  blog: {
    badge: "Блог", title: "Полезные статьи о переводе",
    subtitle: "Советы, инструкции и ответы на частые вопросы о переводе документов",
    empty: "Статьи скоро появятся.",
    back: "Назад к блогу", faq: "Часто задаваемые вопросы",
    ctaTitle: "Нужна помощь с переводом?",
    ctaText: "Оставьте заявку — мы свяжемся с вами в течение нескольких минут.",
    ctaButton: "Оставить заявку",
    latestBadge: "Блог", latestTitle: "Полезные статьи", allPosts: "Все статьи", dateLocale: "ru-RU",
  },
  hero: {
    badge: "Lingua Translation",
    title: "Профессиональные переводы документов с нотариальным заверением и апостилем",
    subtitle: "Lingua Translation помогает быстро подготовить переводы дипломов, свидетельств, справок, медицинских и официальных документов. Работаем онлайн и в офисах Намангана и Ташкента.",
    primaryButton: "Оставить заявку",
    telegramButton: "Написать в Telegram",
    officesButton: "Посмотреть офисы",
    servicesCardTitle: "Наши услуги",
    statLanguages: "6+", statLanguagesLabel: "языков",
    statOffices: "2", statOfficesLabel: "офиса",
    statOnline: "Онлайн", statOnlineLabel: "приём документов",
    officesLabel: "Офисы",
    onlineLabel: "Онлайн",
    onlineSubLabel: "По всему Узбекистану",
    serviceHighlights: ["Нотариальный перевод", "Апостиль", "Перевод диплома", "Медицинские документы", "Срочный перевод"],
  },
  services: {
    badge: "Что мы предлагаем",
    title: "Наши услуги",
    subtitle: "Профессиональные переводы всех видов документов с официальным заверением",
    learnMore: "Подробнее",
    items: [
      { title: "Нотариальный перевод", description: "Перевод документов с нотариальным заверением для официального использования." },
      { title: "Апостиль", description: "Помощь с оформлением апостиля для документов, которые нужны за границей." },
      { title: "Перевод дипломов и аттестатов", description: "Перевод школьных аттестатов, колледжных и университетских дипломов." },
      { title: "Перевод свидетельств", description: "Перевод свидетельства о рождении, браке, отсутствии брака и других официальных документов." },
      { title: "Медицинский перевод", description: "Перевод медицинских справок, анализов, заключений и документов для клиник." },
      { title: "Перевод официальных документов", description: "Перевод справок, водительских прав, кадастровых документов, трудовых книжек и других бумаг." },
    ],
  },
  prices: {
    badge: "Стоимость",
    title: "Цены на услуги",
    subtitle: "Стоимость зависит от типа документа, количества экземпляров и сроков готовности.",
    regularClients: "Обычные клиенты", partners: "Партнёры",
    price: "Цена", secondCopy: "2 экземпляра", duration: "Срок готовности", tbd: "Уточняется",
    note: "Примечание: сроки готовности документов для апостиля могут изменяться в зависимости от работы министерств и государственных органов.",
    exactPrice: "Точная стоимость зависит от объёма и сложности документа",
    askPriceBtn: "Узнать точную цену",
    categoryLabels: { tarjima: "Перевод", additional: "Дополнительные услуги" },
  },
  form: {
    badge: "Оставить заявку",
    title: "Отправьте заявку онлайн",
    subtitle: "Заполните форму и мы свяжемся с вами в течение нескольких минут",
    section1: "Контактные данные", section2: "Информация о переводе",
    section3: "Документ", section4: "Комментарий",
    name: "Имя клиента", namePlaceholder: "Ваше имя",
    phone: "Номер телефона", phonePlaceholder: "+998 90 000 00 00",
    city: "Город", cityPlaceholder: "Выберите город",
    messenger: "Удобный способ связи", messengerPlaceholder: "Выберите способ",
    messengerContact: "Контакт в мессенджере", messengerContactPlaceholder: "@username или номер телефона",
    service: "Услуга", servicePlaceholder: "Выберите услугу",
    sourceLanguage: "Язык оригинала", sourceLangPlaceholder: "Выберите язык",
    targetLanguage: "Язык перевода", targetLangPlaceholder: "Выберите язык",
    urgency: "Срочность",
    fileTitle: "Загрузить фото или скан документа",
    fileSubtitle: "PDF, JPG, PNG, DOC, DOCX — до 15 МБ",
    fileTooLarge: "Файл слишком большой. Максимальный размер — 15 МБ.",
    commentPlaceholder: "Дополнительная информация о документе или пожелания...",
    submit: "Отправить заявку", submitting: "Отправляем...",
    privacy: "Нажимая кнопку, вы соглашаетесь на обработку персональных данных",
    successTitle: "Спасибо! Заявка принята.",
    successSubtitle: "Мы свяжемся с вами в ближайшее время.",
    sendAnother: "Отправить ещё одну заявку",
    errorServer: "Произошла ошибка. Попробуйте ещё раз.",
    errorConnection: "Ошибка соединения. Проверьте интернет и попробуйте ещё раз.",
    cityOptions: [
      { value: "Наманган", label: "Наманган" },
      { value: "Ташкент", label: "Ташкент" },
      { value: "Онлайн", label: "Онлайн" },
    ],
    messengerOptions: [
      { value: "Telegram", label: "Telegram" },
      { value: "WhatsApp", label: "WhatsApp" },
      { value: "KakaoTalk", label: "KakaoTalk" },
      { value: "Звонок", label: "Звонок" },
    ],
    serviceOptions: [
      { value: "Notarial tarjima", label: "Нотариальный перевод" },
      { value: "Apostil", label: "Апостиль" },
      { value: "Diplom tarjimasi", label: "Перевод дипломов и аттестатов" },
      { value: "Metrka tarjimasi", label: "Перевод свидетельств" },
      { value: "Nikoh guvohnomasi tarjimasi", label: "Перевод свидетельства о браке" },
      { value: "Tibbiy hujjatlar tarjimasi", label: "Медицинский перевод" },
      { value: "Boshqa hujjat", label: "Другой документ" },
    ],
    urgencyOptions: [
      { value: "Не срочно", label: "Не срочно" },
      { value: "Сегодня", label: "Сегодня" },
      { value: "Завтра", label: "Завтра" },
      { value: "Нужно уточнить", label: "Нужно уточнить" },
    ],
    languageList: ["Русский", "Узбекский", "Корейский", "Английский", "Немецкий", "Китайский", "Другой"],
  },
  contacts: {
    badge: "Связаться с нами", title: "Контакты",
    subtitle: "Свяжитесь с нами удобным способом или посетите один из наших офисов",
    namangan: "Офис Наманган", tashkent: "Офис Ташкент",
    call: "Позвонить", map: "Открыть на карте", telegram: "Написать в Telegram",
    hours: "График работы", generalContacts: "Общие контакты",
  },
  benefits: {
    badge: "Наши преимущества", title: "Почему выбирают нас",
    items: [
      "Аккуратное оформление документов",
      "Опыт работы с официальными документами",
      "Быстрая обработка заявок",
      "Работа с несколькими языками",
      "Онлайн-приём документов",
      "Поддержка на русском, узбекском и корейском языках",
    ],
    officeTitle: "Работаем онлайн и в офисах",
    nameNamangan: "Офис Наманган", subNamangan: "Приём документов и выдача перевода",
    nameTashkent: "Офис Ташкент", subTashkent: "Приём документов и выдача перевода",
    nameOnline: "Онлайн по всему Узбекистану", subOnline: "Отправьте фото документа — получите перевод",
    audienceBadge: "Наши клиенты", audienceTitle: "Для кого наши услуги",
    audience: [
      { emoji: "🎓", title: "Студенты", desc: "Перевод дипломов и аттестатов для учёбы за рубежом" },
      { emoji: "🌍", title: "Иностранные граждане", desc: "Легализация документов для проживания в Узбекистане" },
      { emoji: "🏢", title: "Компании", desc: "Корпоративные переводы и деловые документы" },
      { emoji: "🏥", title: "Медицинские клиники", desc: "Перевод медицинской документации и справок" },
      { emoji: "📚", title: "Образовательные центры", desc: "Перевод учебных материалов и сертификатов" },
      { emoji: "✈️", title: "Оформление визы", desc: "Переводы для виз, апостиля и документов за границей" },
    ],
  },
  process: {
    badge: "Как это работает", title: "Как мы работаем",
    subtitle: "Простой и понятный процесс от заявки до получения готового перевода",
    startNow: "Начать прямо сейчас",
    steps: [
      { title: "Вы отправляете документ", description: "Клиент отправляет фото или скан документа через сайт или мессенджер." },
      { title: "Мы оцениваем стоимость и срок", description: "Менеджер проверяет документ и сообщает точную цену и сроки." },
      { title: "Выполняем перевод", description: "Переводчик готовит документ аккуратно и грамотно с нотариальным заверением." },
      { title: "Вы получаете готовый файл", description: "Клиент получает перевод онлайн или в офисе Наманган / Ташкент." },
    ],
  },
  languages: {
    badge: "Языковые направления", title: "Языки перевода",
    subtitle: "Мы работаем с популярными языковыми направлениями для учёбы, работы, медицины, бизнеса и переезда.",
    items: [
      { name: "Русский", flag: "🇷🇺", code: "ru" },
      { name: "Узбекский", flag: "🇺🇿", code: "uz" },
      { name: "Корейский", flag: "🇰🇷", code: "ko" },
      { name: "Английский", flag: "🇬🇧", code: "en" },
      { name: "Немецкий", flag: "🇩🇪", code: "de" },
      { name: "Китайский", flag: "🇨🇳", code: "zh" },
    ],
  },
  footer: {
    description: "Профессиональное бюро переводов. Нотариальные, медицинские и официальные переводы документов.",
    servicesHeading: "Услуги", officesHeading: "Офисы", contactsHeading: "Контакты",
    apply: "Оставить заявку", rights: "Все права защищены.", openMap: "Открыть на карте",
    serviceLinks: [
      { label: "Нотариальный перевод", href: "/notarial-tarjima" },
      { label: "Апостиль", href: "/apostil" },
      { label: "Перевод диплома", href: "/diplom-tarjimasi" },
      { label: "Перевод метрики", href: "/metrka-tarjimasi" },
      { label: "Перевод свидетельства о браке", href: "/nikoh-guvohnomasi-tarjimasi" },
      { label: "Медицинский перевод", href: "/tibbiy-hujjatlar-tarjimasi" },
    ],
  },
};

const uz: TranslationSchema = {
  nav: {
    home: "Bosh sahifa", services: "Xizmatlar", prices: "Narxlar", languages: "Tillar",
    process: "Ish jarayoni", benefits: "Afzalliklar", blog: "Blog", contacts: "Aloqa",
    apply: "Ariza qoldirish", telegram: "Telegram",
  },
  blog: {
    badge: "Blog", title: "Tarjima haqida foydali maqolalar",
    subtitle: "Hujjatlar tarjimasi bo'yicha maslahatlar, ko'rsatmalar va tez-tez beriladigan savollarga javoblar",
    empty: "Maqolalar tez orada paydo bo'ladi.",
    back: "Blogga qaytish", faq: "Tez-tez so'raladigan savollar",
    ctaTitle: "Tarjima bo'yicha yordam kerakmi?",
    ctaText: "Ariza qoldiring — biz siz bilan bir necha daqiqa ichida bog'lanamiz.",
    ctaButton: "Ariza qoldirish",
    latestBadge: "Blog", latestTitle: "Foydali maqolalar", allPosts: "Barcha maqolalar", dateLocale: "uz-UZ",
  },
  hero: {
    badge: "Lingua Translation",
    title: "Hujjatlarni notarial tasdiq va apostil bilan professional tarjima qilish",
    subtitle: "Lingua Translation diplom, guvohnoma, ma'lumotnoma, tibbiy va rasmiy hujjatlarni tez va sifatli tarjima qilishga yordam beradi. Onlayn hamda Namangan va Toshkent ofislarida xizmat ko'rsatamiz.",
    primaryButton: "Ariza qoldirish",
    telegramButton: "Telegram orqali yozish",
    officesButton: "Ofislarni ko'rish",
    servicesCardTitle: "Bizning xizmatlar",
    statLanguages: "6+", statLanguagesLabel: "til",
    statOffices: "2", statOfficesLabel: "ofis",
    statOnline: "Onlayn", statOnlineLabel: "hujjat qabul qilish",
    officesLabel: "Ofislar",
    onlineLabel: "Onlayn",
    onlineSubLabel: "O'zbekiston bo'ylab",
    serviceHighlights: ["Notarial tarjima", "Apostil", "Diplom tarjimasi", "Tibbiy hujjatlar", "Tezkor xizmat"],
  },
  services: {
    badge: "Nima taklif qilamiz",
    title: "Bizning xizmatlar",
    subtitle: "Barcha turdagi hujjatlarni rasmiy tasdiq bilan professional tarjima qilish",
    learnMore: "Batafsil",
    items: [
      { title: "Notarial tarjima", description: "Rasmiy foydalanish uchun hujjatlarni notarial tasdiq bilan tarjima qilish." },
      { title: "Apostil", description: "Chet elda foydalanish uchun kerak bo'ladigan hujjatlarga apostil rasmiylashtirishda yordam." },
      { title: "Diplom va attestat tarjimasi", description: "Maktab attestati, kollej diplomi va universitet diplomlarini tarjima qilish." },
      { title: "Guvohnomalar tarjimasi", description: "Tug'ilganlik, nikoh, turmush qurmaganlik va boshqa rasmiy guvohnomalarni tarjima qilish." },
      { title: "Tibbiy tarjima", description: "Tibbiy ma'lumotnoma, tahlil, xulosa va klinikalar uchun hujjatlarni tarjima qilish." },
      { title: "Rasmiy hujjatlar tarjimasi", description: "Ma'lumotnoma, haydovchilik guvohnomasi, kadastr hujjatlari, mehnat daftarchasi va boshqa hujjatlarni tarjima qilish." },
    ],
  },
  prices: {
    badge: "Narxlar",
    title: "Xizmatlar narxi",
    subtitle: "Narx hujjat turi, nusxalar soni va tayyor bo'lish muddatiga qarab belgilanadi.",
    regularClients: "Oddiy mijozlar", partners: "Hamkorlar",
    price: "Narx", secondCopy: "2 nusxa", duration: "Tayyor bo'lish muddati", tbd: "Aniqlanadi",
    note: "Eslatma: Apostil qilinadigan hujjatlar tayyor bo'lish muddati vazirliklar ish faoliyatiga qarab o'zgarishi mumkin.",
    exactPrice: "Aniq narx hujjat hajmi va murakkabligiga qarab belgilanadi",
    askPriceBtn: "Aniq narxni bilish",
    categoryLabels: { tarjima: "Tarjima", additional: "Qo'shimcha xizmatlar" },
  },
  form: {
    badge: "Ariza qoldirish",
    title: "Onlayn ariza yuboring",
    subtitle: "Formani to'ldiring va biz bir necha daqiqa ichida siz bilan bog'lanamiz",
    section1: "Aloqa ma'lumotlari", section2: "Tarjima haqida ma'lumot",
    section3: "Hujjat", section4: "Izoh",
    name: "Mijoz ismi", namePlaceholder: "Ismingiz",
    phone: "Telefon raqami", phonePlaceholder: "+998 90 000 00 00",
    city: "Shahar", cityPlaceholder: "Shaharni tanlang",
    messenger: "Qulay aloqa usuli", messengerPlaceholder: "Usulni tanlang",
    messengerContact: "Messenger kontakti", messengerContactPlaceholder: "@username yoki telefon raqami",
    service: "Xizmat turi", servicePlaceholder: "Xizmatni tanlang",
    sourceLanguage: "Asl hujjat tili", sourceLangPlaceholder: "Tilni tanlang",
    targetLanguage: "Tarjima tili", targetLangPlaceholder: "Tilni tanlang",
    urgency: "Shoshilinchlik",
    fileTitle: "Hujjat foto yoki skanini yuklang",
    fileSubtitle: "PDF, JPG, PNG, DOC, DOCX — 15 MBgacha",
    fileTooLarge: "Fayl juda katta. Maksimal hajm — 15 MB.",
    commentPlaceholder: "Hujjat haqida qo'shimcha ma'lumot yoki istaklaringiz...",
    submit: "Ariza yuborish", submitting: "Yuborilmoqda...",
    privacy: "Tugmani bosish orqali shaxsiy ma'lumotlarni qayta ishlashga rozilik bildirasiz",
    successTitle: "Rahmat! Ariza qabul qilindi.",
    successSubtitle: "Tez orada siz bilan bog'lanamiz.",
    sendAnother: "Yana ariza yuborish",
    errorServer: "Xatolik yuz berdi. Qayta urinib ko'ring.",
    errorConnection: "Ulanish xatosi. Internetni tekshirib, qayta urinib ko'ring.",
    cityOptions: [
      { value: "Наманган", label: "Namangan" },
      { value: "Ташкент", label: "Toshkent" },
      { value: "Онлайн", label: "Onlayn" },
    ],
    messengerOptions: [
      { value: "Telegram", label: "Telegram" },
      { value: "WhatsApp", label: "WhatsApp" },
      { value: "KakaoTalk", label: "KakaoTalk" },
      { value: "Звонок", label: "Qo'ng'iroq" },
    ],
    serviceOptions: [
      { value: "Notarial tarjima", label: "Notarial tarjima" },
      { value: "Apostil", label: "Apostil" },
      { value: "Diplom tarjimasi", label: "Diplom va attestat tarjimasi" },
      { value: "Metrka tarjimasi", label: "Guvohnomalar tarjimasi" },
      { value: "Nikoh guvohnomasi tarjimasi", label: "Nikoh guvohnomasi tarjimasi" },
      { value: "Tibbiy hujjatlar tarjimasi", label: "Tibbiy hujjatlar tarjimasi" },
      { value: "Boshqa hujjat", label: "Boshqa hujjat" },
    ],
    urgencyOptions: [
      { value: "Не срочно", label: "Shoshilinch emas" },
      { value: "Сегодня", label: "Bugun" },
      { value: "Завтра", label: "Ertaga" },
      { value: "Нужно уточнить", label: "Aniqlashtirish kerak" },
    ],
    languageList: ["Rus tili", "O'zbek tili", "Koreys tili", "Ingliz tili", "Nemis tili", "Xitoy tili", "Boshqa"],
  },
  contacts: {
    badge: "Biz bilan bog'laning", title: "Aloqa",
    subtitle: "Qulay usulda biz bilan bog'laning yoki ofislarimizdan biriga tashrif buyuring",
    namangan: "Namangan ofisi", tashkent: "Toshkent ofisi",
    call: "Qo'ng'iroq qilish", map: "Xaritada ochish", telegram: "Telegram orqali yozish",
    hours: "Ish vaqti", generalContacts: "Umumiy aloqa",
  },
  benefits: {
    badge: "Afzalliklarimiz", title: "Nima uchun bizni tanlashadi",
    items: [
      "Hujjatlarni aniq va tartibli rasmiylashtirish",
      "Rasmiy hujjatlar bilan ishlash tajribasi",
      "Arizalarni tez ko'rib chiqish",
      "Ko'p tillar bilan ishlash",
      "Onlayn hujjat qabul qilish",
      "Rus, o'zbek va koreys tillarida mijozlarga qo'llab-quvvatlash",
    ],
    officeTitle: "Onlayn va ofiside ishlaymiz",
    nameNamangan: "Namangan ofisi", subNamangan: "Hujjat qabul va tarjima berish",
    nameTashkent: "Toshkent ofisi", subTashkent: "Hujjat qabul va tarjima berish",
    nameOnline: "O'zbekiston bo'ylab onlayn", subOnline: "Hujjat fotosini yuboring — tarjimani oling",
    audienceBadge: "Mijozlarimiz", audienceTitle: "Kimlar uchun xizmat",
    audience: [
      { emoji: "🎓", title: "Talabalar", desc: "Xorijda o'qish uchun diplom va attestat tarjimasi" },
      { emoji: "🌍", title: "Chet el fuqarolari", desc: "O'zbekistonda yashash uchun hujjatlarni legalizatsiya qilish" },
      { emoji: "🏢", title: "Kompaniyalar", desc: "Korporativ tarjimalar va ishbilarmonlik hujjatlari" },
      { emoji: "🏥", title: "Tibbiy klinikalar", desc: "Tibbiy hujjatlar va ma'lumotnomalar tarjimasi" },
      { emoji: "📚", title: "Ta'lim markazlari", desc: "O'quv materiallari va sertifikatlar tarjimasi" },
      { emoji: "✈️", title: "Viza rasmiylashtirish", desc: "Viza, apostil va chet el hujjatlari uchun tarjimalar" },
    ],
  },
  process: {
    badge: "Qanday ishlaydi", title: "Ish jarayoni",
    subtitle: "Arizadan tayyor tarjimani olishgacha oddiy va tushunarli jarayon",
    startNow: "Hoziroq boshlash",
    steps: [
      { title: "Hujjatni yuboring", description: "Mijoz sayt yoki messenger orqali hujjat foto yoki skanini yuboradi." },
      { title: "Narx va muddatni baholaymiz", description: "Menejer hujjatni tekshirib, aniq narx va muddatni bildiradi." },
      { title: "Tarjima qilamiz", description: "Tarjimon hujjatni notarial tasdiq bilan aniq va sifatli tayyorlaydi." },
      { title: "Tayyor faylni olasiz", description: "Mijoz tarjimani onlayn yoki Namangan / Toshkent ofisida oladi." },
    ],
  },
  languages: {
    badge: "Til yo'nalishlari", title: "Tarjima tillari",
    subtitle: "O'qish, ish, tibbiyot, biznes va ko'chish uchun mashhur til yo'nalishlari bilan ishlaymiz.",
    items: [
      { name: "Rus tili", flag: "🇷🇺", code: "ru" },
      { name: "O'zbek tili", flag: "🇺🇿", code: "uz" },
      { name: "Koreys tili", flag: "🇰🇷", code: "ko" },
      { name: "Ingliz tili", flag: "🇬🇧", code: "en" },
      { name: "Nemis tili", flag: "🇩🇪", code: "de" },
      { name: "Xitoy tili", flag: "🇨🇳", code: "zh" },
    ],
  },
  footer: {
    description: "Professional tarjima byurosi. Notarial, tibbiy va rasmiy hujjatlar tarjimasi.",
    servicesHeading: "Xizmatlar", officesHeading: "Ofislar", contactsHeading: "Aloqa",
    apply: "Ariza qoldirish", rights: "Barcha huquqlar himoyalangan.", openMap: "Xaritada ochish",
    serviceLinks: [
      { label: "Notarial tarjima", href: "/notarial-tarjima" },
      { label: "Apostil", href: "/apostil" },
      { label: "Diplom tarjimasi", href: "/diplom-tarjimasi" },
      { label: "Metrka tarjimasi", href: "/metrka-tarjimasi" },
      { label: "Nikoh guvohnomasi", href: "/nikoh-guvohnomasi-tarjimasi" },
      { label: "Tibbiy tarjima", href: "/tibbiy-hujjatlar-tarjimasi" },
    ],
  },
};

const en: TranslationSchema = {
  nav: {
    home: "Home", services: "Services", prices: "Prices", languages: "Languages",
    process: "How We Work", benefits: "Why Choose Us", blog: "Blog", contacts: "Contacts",
    apply: "Submit Request", telegram: "Telegram",
  },
  blog: {
    badge: "Blog", title: "Useful articles about translation",
    subtitle: "Tips, guides and answers to common questions about document translation",
    empty: "Articles are coming soon.",
    back: "Back to the blog", faq: "Frequently asked questions",
    ctaTitle: "Need help with a translation?",
    ctaText: "Leave a request — we will contact you within a few minutes.",
    ctaButton: "Submit request",
    latestBadge: "Blog", latestTitle: "Useful articles", allPosts: "All articles", dateLocale: "en-GB",
  },
  hero: {
    badge: "Lingua Translation",
    title: "Professional document translation with notarization and apostille",
    subtitle: "Lingua Translation helps prepare translations of diplomas, certificates, references, medical and official documents quickly and accurately. We work online and in our Namangan and Tashkent offices.",
    primaryButton: "Submit Request",
    telegramButton: "Message on Telegram",
    officesButton: "View Offices",
    servicesCardTitle: "Our Services",
    statLanguages: "6+", statLanguagesLabel: "languages",
    statOffices: "2", statOfficesLabel: "offices",
    statOnline: "Online", statOnlineLabel: "document reception",
    officesLabel: "Offices",
    onlineLabel: "Online",
    onlineSubLabel: "Across Uzbekistan",
    serviceHighlights: ["Notarized Translation", "Apostille", "Diploma Translation", "Medical Documents", "Express Service"],
  },
  services: {
    badge: "What We Offer",
    title: "Our Services",
    subtitle: "Professional translation of all types of documents with official notarization",
    learnMore: "Learn More",
    items: [
      { title: "Notarized Translation", description: "Translation of documents with notarization for official use." },
      { title: "Apostille", description: "Assistance with apostille processing for documents required abroad." },
      { title: "Diploma and Certificate Translation", description: "Translation of school certificates, college diplomas and university diplomas." },
      { title: "Certificate Translation", description: "Translation of birth, marriage, single-status and other official certificates." },
      { title: "Medical Translation", description: "Translation of medical certificates, test results, reports and clinic documents." },
      { title: "Official Document Translation", description: "Translation of references, driver's licenses, cadastral documents, employment records and other official papers." },
    ],
  },
  prices: {
    badge: "Pricing",
    title: "Service Prices",
    subtitle: "The price depends on the document type, number of copies and processing time.",
    regularClients: "Regular Clients", partners: "Partners",
    price: "Price", secondCopy: "2 copies", duration: "Processing Time", tbd: "To be clarified",
    note: "Note: The processing time for apostilled documents may vary depending on the work schedule of ministries and government authorities.",
    exactPrice: "Exact price depends on the volume and complexity of the document",
    askPriceBtn: "Get Exact Price",
    categoryLabels: { tarjima: "Translation", additional: "Additional Services" },
  },
  form: {
    badge: "Submit Request",
    title: "Submit Your Request Online",
    subtitle: "Fill out the form and we will contact you within a few minutes",
    section1: "Contact Details", section2: "Translation Information",
    section3: "Document", section4: "Comment",
    name: "Client Name", namePlaceholder: "Your name",
    phone: "Phone Number", phonePlaceholder: "+998 90 000 00 00",
    city: "City", cityPlaceholder: "Select city",
    messenger: "Preferred Contact Method", messengerPlaceholder: "Select method",
    messengerContact: "Messenger Contact", messengerContactPlaceholder: "@username or phone number",
    service: "Service Type", servicePlaceholder: "Select service",
    sourceLanguage: "Source Language", sourceLangPlaceholder: "Select language",
    targetLanguage: "Target Language", targetLangPlaceholder: "Select language",
    urgency: "Urgency",
    fileTitle: "Upload a photo or scan of the document",
    fileSubtitle: "PDF, JPG, PNG, DOC, DOCX — up to 15 MB",
    fileTooLarge: "File is too large. Maximum size is 15 MB.",
    commentPlaceholder: "Additional information about the document or special requests...",
    submit: "Submit Request", submitting: "Submitting...",
    privacy: "By clicking the button you agree to the processing of personal data",
    successTitle: "Thank you! Your request has been submitted.",
    successSubtitle: "We will contact you shortly.",
    sendAnother: "Submit Another Request",
    errorServer: "An error occurred. Please try again.",
    errorConnection: "Connection error. Check your internet and try again.",
    cityOptions: [
      { value: "Наманган", label: "Namangan" },
      { value: "Ташкент", label: "Tashkent" },
      { value: "Онлайн", label: "Online" },
    ],
    messengerOptions: [
      { value: "Telegram", label: "Telegram" },
      { value: "WhatsApp", label: "WhatsApp" },
      { value: "KakaoTalk", label: "KakaoTalk" },
      { value: "Звонок", label: "Phone Call" },
    ],
    serviceOptions: [
      { value: "Notarial tarjima", label: "Notarized Translation" },
      { value: "Apostil", label: "Apostille" },
      { value: "Diplom tarjimasi", label: "Diploma and Certificate Translation" },
      { value: "Metrka tarjimasi", label: "Certificate Translation" },
      { value: "Nikoh guvohnomasi tarjimasi", label: "Marriage Certificate Translation" },
      { value: "Tibbiy hujjatlar tarjimasi", label: "Medical Translation" },
      { value: "Boshqa hujjat", label: "Other Document" },
    ],
    urgencyOptions: [
      { value: "Не срочно", label: "Not Urgent" },
      { value: "Сегодня", label: "Today" },
      { value: "Завтра", label: "Tomorrow" },
      { value: "Нужно уточнить", label: "To be clarified" },
    ],
    languageList: ["Russian", "Uzbek", "Korean", "English", "German", "Chinese", "Other"],
  },
  contacts: {
    badge: "Contact Us", title: "Contacts",
    subtitle: "Contact us in any convenient way or visit one of our offices",
    namangan: "Namangan Office", tashkent: "Tashkent Office",
    call: "Call", map: "Open Map", telegram: "Message on Telegram",
    hours: "Working Hours", generalContacts: "General Contacts",
  },
  benefits: {
    badge: "Our Advantages", title: "Why Choose Us",
    items: [
      "Accurate and neat document processing",
      "Experience with official documents",
      "Fast application processing",
      "Work with multiple languages",
      "Online document reception",
      "Support in Russian, Uzbek and Korean",
    ],
    officeTitle: "We work online and in offices",
    nameNamangan: "Namangan Office", subNamangan: "Document reception and translation delivery",
    nameTashkent: "Tashkent Office", subTashkent: "Document reception and translation delivery",
    nameOnline: "Online across Uzbekistan", subOnline: "Send a photo of your document — receive the translation",
    audienceBadge: "Our Clients", audienceTitle: "Who We Serve",
    audience: [
      { emoji: "🎓", title: "Students", desc: "Diploma and certificate translation for studying abroad" },
      { emoji: "🌍", title: "Foreign Citizens", desc: "Document legalization for residing in Uzbekistan" },
      { emoji: "🏢", title: "Companies", desc: "Corporate translations and business documents" },
      { emoji: "🏥", title: "Medical Clinics", desc: "Medical documentation and reference translation" },
      { emoji: "📚", title: "Educational Centers", desc: "Educational materials and certificate translation" },
      { emoji: "✈️", title: "Visa Processing", desc: "Translations for visas, apostille and overseas documents" },
    ],
  },
  process: {
    badge: "How It Works", title: "How We Work",
    subtitle: "A simple and clear process from application to receiving your completed translation",
    startNow: "Start Now",
    steps: [
      { title: "You Send Your Document", description: "The client sends a photo or scan of the document via the website or messenger." },
      { title: "We Assess the Cost and Timeline", description: "Our manager reviews the document and provides the exact price and timeline." },
      { title: "We Perform the Translation", description: "The translator prepares the document accurately with notarization." },
      { title: "You Receive the Finished File", description: "The client receives the translation online or at our Namangan / Tashkent office." },
    ],
  },
  languages: {
    badge: "Language Directions", title: "Translation Languages",
    subtitle: "We work with the most popular language directions for study, work, medicine, business and relocation.",
    items: [
      { name: "Russian", flag: "🇷🇺", code: "ru" },
      { name: "Uzbek", flag: "🇺🇿", code: "uz" },
      { name: "Korean", flag: "🇰🇷", code: "ko" },
      { name: "English", flag: "🇬🇧", code: "en" },
      { name: "German", flag: "🇩🇪", code: "de" },
      { name: "Chinese", flag: "🇨🇳", code: "zh" },
    ],
  },
  footer: {
    description: "Professional translation agency. Notarized, medical and official document translations.",
    servicesHeading: "Services", officesHeading: "Offices", contactsHeading: "Contacts",
    apply: "Submit Request", rights: "All rights reserved.", openMap: "Open Map",
    serviceLinks: [
      { label: "Notarized Translation", href: "/notarial-tarjima" },
      { label: "Apostille", href: "/apostil" },
      { label: "Diploma Translation", href: "/diplom-tarjimasi" },
      { label: "Certificate Translation", href: "/metrka-tarjimasi" },
      { label: "Marriage Certificate", href: "/nikoh-guvohnomasi-tarjimasi" },
      { label: "Medical Translation", href: "/tibbiy-hujjatlar-tarjimasi" },
    ],
  },
};

export const translations: Record<Locale, TranslationSchema> = { ru, uz, en };
