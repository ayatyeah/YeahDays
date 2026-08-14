/**
 * Человекочитаемая метка устройства из User-Agent — для списка "Ваши
 * устройства" в профиле и для голосового ответа СалемАй. Простые проверки
 * по подстрокам, не полноценный UA-парсер: достаточно для "Chrome · Windows",
 * точность бренда/версии не нужна.
 */
export function labelFromUserAgent(ua: string): string {
  let os = "Устройство";
  if (/iPhone/.test(ua)) os = "iPhone";
  else if (/iPad/.test(ua)) os = "iPad";
  else if (/Android/.test(ua)) os = "Android";
  else if (/Windows/.test(ua)) os = "Windows";
  else if (/Macintosh|Mac OS/.test(ua)) os = "Mac";
  else if (/Linux/.test(ua)) os = "Linux";

  // Порядок важен: на iOS Chrome/Firefox тоже содержат "Safari" в UA, а Edge
  // на Android/Windows содержит "Chrome" — проверяем самые специфичные токены первыми.
  let browser = "Браузер";
  if (/EdgA|EdgiOS|Edg\//.test(ua)) browser = "Edge";
  else if (/YaBrowser/.test(ua)) browser = "Яндекс Браузер";
  else if (/CriOS|Chrome\//.test(ua)) browser = "Chrome";
  else if (/FxiOS|Firefox\//.test(ua)) browser = "Firefox";
  else if (/Safari\//.test(ua)) browser = "Safari";

  return `${browser} · ${os}`;
}
