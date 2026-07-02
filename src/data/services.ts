import { FileText, Stamp, GraduationCap, Heart, Stethoscope, BookOpen } from "lucide-react";

export const services = [
  {
    id: "notarial",
    icon: "Stamp",
    title: "Нотариальный перевод",
    description: "Перевод документов с нотариальным заверением для официального использования.",
    slug: "/notarial-tarjima",
  },
  {
    id: "apostil",
    icon: "FileText",
    title: "Апостиль",
    description: "Помощь с оформлением апостиля для документов, которые нужны за границей.",
    slug: "/apostil",
  },
  {
    id: "diplom",
    icon: "GraduationCap",
    title: "Перевод дипломов и аттестатов",
    description: "Перевод школьных аттестатов, колледжных и университетских дипломов.",
    slug: "/diplom-tarjimasi",
  },
  {
    id: "metrka",
    icon: "Heart",
    title: "Перевод свидетельств",
    description: "Перевод свидетельства о рождении, браке, отсутствии брака и других документов.",
    slug: "/metrka-tarjimasi",
  },
  {
    id: "medical",
    icon: "Stethoscope",
    title: "Медицинский перевод",
    description: "Перевод медицинских справок, анализов, заключений и документов для клиник.",
    slug: "/tibbiy-hujjatlar-tarjimasi",
  },
  {
    id: "official",
    icon: "BookOpen",
    title: "Перевод всех официальных документов",
    description:
      "Перевод справок, водительских прав, кадастровых документов, трудовых книжек и других бумаг.",
    slug: "/notarial-tarjima",
  },
];

export const languages = [
  { name: "Русский", flag: "🇷🇺", code: "ru" },
  { name: "Узбекский", flag: "🇺🇿", code: "uz" },
  { name: "Корейский", flag: "🇰🇷", code: "ko" },
  { name: "Английский", flag: "🇬🇧", code: "en" },
  { name: "Немецкий", flag: "🇩🇪", code: "de" },
  { name: "Китайский", flag: "🇨🇳", code: "zh" },
];

export const benefits = [
  "Аккуратное оформление документов",
  "Опыт работы с официальными документами",
  "Быстрая обработка заявок",
  "Работа с несколькими языками",
  "Онлайн-приём документов",
  "Поддержка клиентов на русском, узбекском и корейском языках",
];

export const processSteps = [
  {
    step: 1,
    title: "Вы отправляете документ",
    description: "Клиент отправляет фото или скан документа.",
  },
  {
    step: 2,
    title: "Мы оцениваем стоимость и срок",
    description: "Менеджер проверяет документ и сообщает цену.",
  },
  {
    step: 3,
    title: "Выполняем перевод",
    description: "Переводчик готовит документ аккуратно и грамотно.",
  },
  {
    step: 4,
    title: "Вы получаете готовый файл",
    description: "Клиент получает перевод онлайн или в офисе.",
  },
];

export const audience = [
  { title: "Студенты", icon: "GraduationCap" },
  { title: "Иностранные граждане", icon: "Globe" },
  { title: "Компании", icon: "Building2" },
  { title: "Медицинские клиники", icon: "Stethoscope" },
  { title: "Образовательные центры", icon: "BookOpen" },
  { title: "Клиенты, оформляющие визу", icon: "Passport" },
];
