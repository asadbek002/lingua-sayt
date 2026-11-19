// Topic banks for the content agent. Blog topics are real client questions; the agent takes the first one
// that is not in the blog yet, so the list is also the publishing order. Add new topics at the end.
export const BLOG_TOPICS: string[] = [
  "Как поставить апостиль на диплом в Узбекистане: пошаговая инструкция",
  "Апостиль или консульская легализация: в чём разница и что нужно вам",
  "Какие документы нужны для учёбы в Корее и как их перевести",
  "Нотариальный перевод паспорта: когда он нужен и как его сделать",
  "Перевод свидетельства о рождении для визы: частые ошибки",
  "Как правильно написать имя в переводе: транслитерация по загранпаспорту",
  "Перевод аттестата для поступления в зарубежный университет",
  "Сколько времени занимает нотариальный перевод и от чего зависит срок",
  "Документы для брака с иностранцем: что перевести и где поставить апостиль",
  "Перевод медицинских документов для лечения за границей",
  "Как отправить документы на перевод онлайн, не приходя в офис",
  "Перевод справки о несудимости: для чего нужна и как оформить",
  "Апостиль на свидетельство о браке и рождении: куда обращаться",
  "Перевод документов для работы в Корее: что подготовить заранее",
  "Чем нотариальный перевод отличается от обычного",
  "Как подготовить документы к нострификации диплома за рубежом",
  "Перевод водительского удостоверения: когда он нужен",
  "Электронный апостиль в Узбекистане: как это работает",
  "Какие документы нельзя апостилировать и что делать вместо этого",
  "Перевод трудовой книжки и справок о работе для выезда за границу",
];

// Google Business post topics; each points to the site page the post promotes.
// For each office the city-specific page is used when one exists.
export const GBP_TOPICS: { topic: string; slug: string; namangan?: string; tashkent?: string }[] = [
  { topic: "Апостиль на диплом и аттестат за 3–5 рабочих дней", slug: "apostil-diplom", namangan: "apostil-namangan", tashkent: "apostil-tashkent" },
  { topic: "Нотариальный перевод документов", slug: "notarial-tarjima", namangan: "tarjima-namangan", tashkent: "tarjima-tashkent" },
  { topic: "Перевод диплома и аттестата для учёбы за рубежом", slug: "diplom-tarjimasi" },
  { topic: "Перевод на корейский язык для учёбы и работы в Корее", slug: "koreys-tiliga-tarjima" },
  { topic: "Перевод свидетельства о рождении и браке", slug: "metrka-tarjimasi" },
  { topic: "Перевод на английский язык с нотариальным заверением", slug: "ingliz-tiliga-tarjima" },
  { topic: "Перевод медицинских документов", slug: "tibbiy-hujjatlar-tarjimasi" },
  { topic: "Приём документов онлайн: пришлите фото — мы сделаем остальное", slug: "", namangan: "tarjima-namangan", tashkent: "tarjima-tashkent" },
];
