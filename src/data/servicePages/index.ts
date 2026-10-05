import type { Locale } from "@/i18n/config";
import type { ServiceDef } from "./types";
import { apostil } from "./apostil";
import { notarialTarjima } from "./notarial-tarjima";
import { diplomTarjimasi } from "./diplom-tarjimasi";
import { metrkaTarjimasi } from "./metrka-tarjimasi";
import { nikohGuvohnomasiTarjimasi } from "./nikoh-guvohnomasi-tarjimasi";
import { tibbiyHujjatlarTarjimasi } from "./tibbiy-hujjatlar-tarjimasi";
import { tarjimaNamangan } from "./tarjima-namangan";
import { tarjimaTashkent } from "./tarjima-tashkent";
import { inglizTiligaTarjima } from "./ingliz-tiliga-tarjima";
import { koreysTiligaTarjima } from "./koreys-tiliga-tarjima";
import { rusTiligaTarjima } from "./rus-tiliga-tarjima";

export type { ServiceCopy, ServiceDef } from "./types";

export const serviceDefs: ServiceDef[] = [
  notarialTarjima,
  apostil,
  diplomTarjimasi,
  metrkaTarjimasi,
  nikohGuvohnomasiTarjimasi,
  tibbiyHujjatlarTarjimasi,
  tarjimaNamangan,
  tarjimaTashkent,
  inglizTiligaTarjima,
  koreysTiligaTarjima,
  rusTiligaTarjima,
];

export { serviceSlugs } from "../serviceSlugs";

export function getServiceDef(slug: string): ServiceDef | undefined {
  return serviceDefs.find((s) => s.slug === slug);
}

export function serviceLabel(slug: string, locale: Locale): string {
  return getServiceDef(slug)?.copy[locale].label ?? slug;
}
