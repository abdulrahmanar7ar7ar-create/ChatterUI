import { getLocales } from 'expo-localization'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { I18nManager } from 'react-native'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Storage } from '@lib/enums/Storage'
import { createMMKVStorage } from '@lib/storage/MMKV'

import ar from './locales/ar.json'
import en from './locales/en.json'
import id from './locales/id.json'
import ru from './locales/ru.json'
import zh from './locales/zh.json'

const lang = getLocales()[0].languageCode ?? 'en'

type Language = {
    id: string
    label: string
    translation: object
}

export const supportedLanguages: Language[] = [
    { id: 'ar', translation: ar, label: 'العربية' },
    {
        id: 'en',
        translation: en,
        label: 'English',
    },
    {
        id: 'zh',
        translation: zh,
        label: '简体中文',
    },
    {
        id: 'ru',
        translation: ru,
        label: 'Русский',
    },
    {
        id: 'id',
        translation: id,
        label: 'Bahasa Indonesia',
    },
]

type LanguageStoreProps = {
    language: string
    setLanguage: (lang: string) => void
}

export const useLanguageStore = create<LanguageStoreProps>()(
    persist(
        (set) => ({
            language: lang,
            setLanguage: (language: string) => {
                set({ language })
                i18n.changeLanguage(language)
                I18nManager.allowRTL(language === 'ar')
                I18nManager.forceRTL(language === 'ar')
            },
        }),
        {
            storage: createMMKVStorage(),
            name: Storage.Language,
            version: 1,
        }
    )
)

const activeLanguage = useLanguageStore.getState().language ?? lang
I18nManager.allowRTL(activeLanguage === 'ar')
I18nManager.forceRTL(activeLanguage === 'ar')

const supportedLanguageAsObject = Object.fromEntries(
    supportedLanguages.map(({ id: name, translation }) => [name, { translation: translation }])
)

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: supportedLanguageAsObject,
    lng: activeLanguage,
    fallbackLng: 'en',

    interpolation: {
        escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
})

export default i18n
