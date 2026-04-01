import en from './locales/en.json'
import ru from './locales/ru.json'

const messages = { en, ru }

export function getMessage(key, locale = 'en') {
  const keys = key.split('.')
  let message = messages[locale]

  for (const k of keys) {
    message = message?.[k]
  }

  return message || key
}

export const supportedLocales = ['en', 'ru']
export const defaultLocale = 'en'
