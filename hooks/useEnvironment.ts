// src/hooks/useEnvironment.ts
import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type Variant = "tg" | "mobile" | "desktop";

const hasWindow = () => typeof window !== "undefined";

const isTelegramEnv = () => {
  if (!hasWindow()) return false;
  // Найнадійніше — наявність Telegram WebApp API
  const tg = (window as any).Telegram?.WebApp;
  if (tg) return true;

  // Додаткові слабші ознаки (інколи корисно в дубльованих веб-обгортках)
  const href = window.location.href;
  const ref = document.referrer || "";
  return href.includes("tgWebAppData=") || ref.includes("t.me/");
};

const isMobileDevice = () => {
  if (!hasWindow()) return false;
  // Поєднання UA + matchMedia
  const ua = navigator.userAgent || "";
  const mobileUA =
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop|BlackBerry/i.test(
      ua
    );
  const narrow = window.matchMedia?.("(max-width: 768px)")?.matches ?? false;
  return mobileUA || narrow;
};

const computeVariant = (forced?: string): Variant => {
  if (forced === "tg" || forced === "mobile" || forced === "desktop") {
    return forced;
  }
  if (isTelegramEnv()) return "tg";
  if (isMobileDevice()) return "mobile";
  return "desktop";
};

const setSearchParam = (search: string, key: string, value: string) => {
  const params = new URLSearchParams(search);
  params.set(key, value);
  return `?${params.toString()}`;
};

export const useEnvironment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const onceRef = useRef(false);

  const urlVariant = useMemo<Variant | undefined>(() => {
    const params = new URLSearchParams(location.search);
    const v = params.get("variant");
    if (v === "tg" || v === "mobile" || v === "desktop") return v;
    return undefined;
  }, [location.search]);

  const resolved: Variant = useMemo(
    () => computeVariant(urlVariant),
    [urlVariant]
  );

  // Якщо Telegram і в URL нема variant=tg — додаємо його (replace, без history push)
  useEffect(() => {
    if (onceRef.current) return;
    if (resolved === "tg" && urlVariant !== "tg") {
      const nextSearch = setSearchParam(location.search, "variant", "tg");
      navigate(
        { pathname: location.pathname, search: nextSearch },
        { replace: true }
      );
      // позначаємо, що вже робили replace — щоб не бігати по колу
      onceRef.current = true;
    }
  }, [resolved, urlVariant, location.pathname, location.search, navigate]);

  return {
    variant: resolved,
    isTelegram: resolved === "tg",
    isMobile: resolved === "mobile",
    isDesktop: resolved === "desktop",
  };
};
