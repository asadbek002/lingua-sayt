import type { ServiceDef } from "./types";

export const apostil: ServiceDef = {
  slug: "apostil",
  related: ["notarial-tarjima", "diplom-tarjimasi", "metrka-tarjimasi"],
  copy: {
    ru: {
      label: "Апостиль",
      metaTitle: "Апостиль документов в Намангане и Ташкенте",
      metaDescription:
        "Оформление апостиля для документов в Узбекистане. Помощь с апостилем дипломов, свидетельств и официальных документов в Намангане и Ташкенте.",
      h1: "Апостиль документов в Узбекистане",
      intro:
        "Помощь с оформлением апостиля для документов. Консультация и перевод документов для использования за границей.",
      serviceName: "Апостиль документов",
      benefits: [
        "Консультация по всему процессу апостиля",
        "Нотариальный перевод для апостиля",
        "Опыт работы с государственными органами",
        "Информация о сроках и требованиях",
        "Приём документов онлайн",
        "Поддержка на 3 языках",
      ],
      sections: [
        {
          heading: "Что такое апостиль и зачем он нужен",
          paragraphs: [
            "Апостиль — это специальный штамп, подтверждающий подлинность документа для его использования за границей. Апостиль признаётся всеми странами-участницами Гаагской конвенции 1961 года и заменяет собой более сложную процедуру консульской легализации.",
            "Апостиль требуется при поступлении в иностранный вуз, трудоустройстве за рубежом, оформлении вида на жительство, регистрации брака с иностранцем и в других случаях, когда официальный документ Узбекистана нужно предъявить в другой стране.",
          ],
        },
        {
          heading: "Как мы помогаем с оформлением апостиля",
          paragraphs: [
            "Мы помогаем подготовить документы для апостилирования: выполняем нотариальный перевод, консультируем по требованиям конкретной страны назначения и сопровождаем процесс подачи в уполномоченные государственные органы Узбекистана.",
            "Сроки оформления апостиля зависят от типа документа и загруженности государственных органов — обычно это занимает от нескольких дней до нескольких недель. Мы заранее предупреждаем клиентов о примерных сроках и держим в курсе процесса.",
          ],
        },
        {
          heading: "Какие документы можно апостилировать",
          paragraphs: [
            "Апостиль ставится на дипломы и приложения к ним, свидетельства о рождении и браке, справки об отсутствии судимости, доверенности и другие официальные документы, выданные государственными органами Узбекистана.",
          ],
        },
      ],
      faqs: [
        { question: "Что такое апостиль?", answer: "Апостиль — это специальный штамп, который подтверждает подлинность подписи и печати на документе. Апостиль нужен для использования документов в странах, подписавших Гаагскую конвенцию." },
        { question: "Для каких документов нужен апостиль?", answer: "Апостиль нужен для дипломов, аттестатов, свидетельств о рождении, браке, справок из государственных органов и других официальных документов." },
        { question: "Сколько времени занимает апостиль?", answer: "Сроки зависят от работы министерств и государственных органов. Обычно 5–10 рабочих дней, но сроки могут меняться." },
        { question: "Нужно ли переводить документ перед апостилем?", answer: "Сначала делается апостиль на оригинальный документ, затем нотариальный перевод. Иногда порядок меняется в зависимости от требований принимающей страны." },
        { question: "Вы помогаете с апостилем или только с переводом?", answer: "Мы консультируем по всему процессу и помогаем с переводом документов для апостиля." },
      ],
    },
    uz: {
      label: "Apostil",
      metaTitle: "Hujjatlarga apostil qo'yish — Namangan va Toshkent",
      metaDescription:
        "O'zbekistonda hujjatlarga apostil qo'yish. Diplom, guvohnoma va rasmiy hujjatlar uchun apostil bo'yicha yordam — Namangan va Toshkentda.",
      h1: "O'zbekistonda hujjatlarga apostil qo'yish",
      intro:
        "Apostil rasmiylashtirishda yordam. Hujjatlarni chet elda ishlatish uchun maslahat va tarjima.",
      serviceName: "Hujjatlarga apostil qo'yish",
      benefits: [
        "Apostil jarayoni bo'yicha to'liq maslahat",
        "Apostil uchun notarial tarjima",
        "Davlat organlari bilan ishlash tajribasi",
        "Muddat va talablar haqida aniq ma'lumot",
        "Hujjatlarni onlayn qabul qilish",
        "3 tilda xizmat",
      ],
      sections: [
        {
          heading: "Apostil nima va u nima uchun kerak",
          paragraphs: [
            "Apostil — hujjatning haqiqiyligini tasdiqlovchi maxsus shtamp bo'lib, hujjatni chet elda ishlatish uchun kerak. 1961-yilgi Gaaga konvensiyasiga a'zo barcha davlatlar apostilni tan oladi va u konsullik legalizatsiyasining murakkab tartibini almashtiradi.",
            "Apostil xorijiy oliy o'quv yurtiga kirishda, chet elda ishga joylashishda, yashash guvohnomasini olishda, chet ellik bilan nikohdan o'tishda va O'zbekiston rasmiy hujjatini boshqa davlatda taqdim etish kerak bo'lgan boshqa holatlarda talab qilinadi.",
          ],
        },
        {
          heading: "Apostil rasmiylashtirishda qanday yordam beramiz",
          paragraphs: [
            "Hujjatlarni apostilga tayyorlashda yordam beramiz: notarial tarjimani bajaramiz, tegishli davlat talablari bo'yicha maslahat beramiz va O'zbekistonning vakolatli davlat organlariga topshirish jarayonini kuzatamiz.",
            "Apostil muddati hujjat turiga va davlat organlarining bandligiga bog'liq — odatda bir necha kundan bir necha haftagacha. Taxminiy muddatlarni oldindan aytamiz va jarayondan xabardor qilib turamiz.",
          ],
        },
        {
          heading: "Qaysi hujjatlarga apostil qo'yiladi",
          paragraphs: [
            "Apostil diplom va ilovalariga, tug'ilganlik va nikoh guvohnomalariga, sudlanmaganlik to'g'risidagi ma'lumotnomalarga, ishonchnomalarga va O'zbekiston davlat organlari bergan boshqa rasmiy hujjatlarga qo'yiladi.",
          ],
        },
      ],
      faqs: [
        { question: "Apostil nima?", answer: "Apostil — hujjatdagi imzo va muhrning haqiqiyligini tasdiqlovchi maxsus shtamp. U Gaaga konvensiyasiga qo'shilgan davlatlarda hujjatni ishlatish uchun kerak." },
        { question: "Qaysi hujjatlar uchun apostil kerak?", answer: "Diplom, attestat, tug'ilganlik va nikoh guvohnomalari, davlat organlarining ma'lumotnomalari va boshqa rasmiy hujjatlar uchun." },
        { question: "Apostil qancha vaqt oladi?", answer: "Muddat vazirliklar va davlat organlarining ishiga bog'liq. Odatda 5–10 ish kuni, lekin o'zgarishi mumkin." },
        { question: "Apostildan oldin hujjatni tarjima qilish kerakmi?", answer: "Avval asl hujjatga apostil qo'yiladi, keyin notarial tarjima qilinadi. Qabul qiluvchi davlat talabiga qarab tartib o'zgarishi mumkin." },
        { question: "Apostil bo'yicha ham yordam berasizmi yoki faqat tarjimami?", answer: "Butun jarayon bo'yicha maslahat beramiz va apostil uchun hujjatlarni tarjima qilamiz." },
      ],
    },
    en: {
      label: "Apostille",
      metaTitle: "Apostille for Documents in Namangan and Tashkent",
      metaDescription:
        "Apostille for documents in Uzbekistan. Help with apostilles for diplomas, certificates and official documents in Namangan and Tashkent.",
      h1: "Apostille for documents in Uzbekistan",
      intro:
        "Help with obtaining an apostille. Consultation and document translation for use abroad.",
      serviceName: "Apostille for documents",
      benefits: [
        "Guidance through the whole apostille process",
        "Notarized translation for the apostille",
        "Experience working with government bodies",
        "Clear information on timing and requirements",
        "Online document submission",
        "Support in 3 languages",
      ],
      sections: [
        {
          heading: "What an apostille is and why you need it",
          paragraphs: [
            "An apostille is a special stamp that certifies a document is genuine so it can be used abroad. It is recognised by all member states of the 1961 Hague Convention and replaces the more complicated process of consular legalisation.",
            "An apostille is required for enrolling at a foreign university, working abroad, getting a residence permit, marrying a foreign citizen and any other case where an official Uzbek document must be presented in another country.",
          ],
        },
        {
          heading: "How we help with the apostille",
          paragraphs: [
            "We help prepare your documents for apostillisation: we provide notarized translation, advise on the requirements of the destination country and follow the submission to the competent Uzbek authorities.",
            "Processing time depends on the type of document and the workload of the authorities — usually from a few days to a few weeks. We tell you the expected timing in advance and keep you updated.",
          ],
        },
        {
          heading: "Which documents can be apostilled",
          paragraphs: [
            "An apostille can be placed on diplomas and their supplements, birth and marriage certificates, criminal record certificates, powers of attorney and other official documents issued by Uzbek authorities.",
          ],
        },
      ],
      faqs: [
        { question: "What is an apostille?", answer: "An apostille is a special stamp that confirms the authenticity of the signature and seal on a document. It is needed to use documents in countries that are parties to the Hague Convention." },
        { question: "Which documents need an apostille?", answer: "Diplomas, school certificates, birth and marriage certificates, certificates from government bodies and other official documents." },
        { question: "How long does an apostille take?", answer: "It depends on the ministries and government bodies involved. Usually 5–10 working days, but timing can change." },
        { question: "Do I need to translate the document before the apostille?", answer: "The apostille is first placed on the original document, then the notarized translation is made. The order sometimes changes depending on the requirements of the receiving country." },
        { question: "Do you help with the apostille or only with translation?", answer: "We advise on the whole process and translate documents for the apostille." },
      ],
    },
  },
};
