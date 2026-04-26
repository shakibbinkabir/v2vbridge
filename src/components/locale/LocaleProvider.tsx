"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  isLocale,
  type Locale,
} from "@/lib/locale";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const stored =
      typeof window === "undefined"
        ? null
        : window.localStorage.getItem(LOCALE_STORAGE_KEY);
    const fromHtml =
      typeof document === "undefined"
        ? null
        : document.documentElement.getAttribute("lang");
    const initial = isLocale(stored)
      ? stored
      : isLocale(fromHtml)
        ? fromHtml
        : DEFAULT_LOCALE;
    setLocaleState(initial);
    document.documentElement.setAttribute("lang", initial);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.documentElement.setAttribute("lang", next);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // localStorage may be unavailable (private mode, quota); the lang
      // attribute on <html> still controls visible language for this session.
    }
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used inside <LocaleProvider>");
  }
  return ctx;
}
