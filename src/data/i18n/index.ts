import { en } from "./en";
import { ptBr } from "./pt-br";

export type TranslationKey = keyof typeof en;

export const translations = {
  en,
  "pt-br": ptBr,
};

export type Language = keyof typeof translations;
