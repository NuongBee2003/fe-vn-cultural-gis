import { useTranslation } from 'react-i18next';

/**
 * Language Switcher — toggle giữa VI, EN, và ZH.
 * @param {{ className?: string; collapsed?: boolean; variant?: 'default' | 'menu' }} props
 */
export default function LanguageSwitcher({ className = '', collapsed = false, variant = 'default' }) {
  const { i18n } = useTranslation();
  
  const languages = ['vi', 'en', 'zh'];

  // Safeguard: normalize language to matching prefix (e.g. 'en-US' -> 'en', 'zh-CN' -> 'zh')
  const rawLang = i18n.language || 'vi';
  const currentLang = rawLang.startsWith('zh') ? 'zh' : rawLang.startsWith('en') ? 'en' : 'vi';

  const toggle = () => {
    const currentIndex = languages.indexOf(currentLang);
    const nextIndex = (currentIndex + 1) % languages.length;
    const next = languages[nextIndex];
    i18n.changeLanguage(next);
  };

  const nextIndex = (languages.indexOf(currentLang) + 1) % languages.length;
  const nextLang = languages[nextIndex];

  const getFlag = (lng) => {
    if (lng === 'en') return '🇬🇧';
    if (lng === 'zh') return '🇨🇳';
    return '🇻🇳';
  };

  const getLabel = (lng) => {
    if (lng === 'en') return 'EN';
    if (lng === 'zh') return 'ZH';
    return 'VI';
  };

  const getFullName = (lng) => {
    if (lng === 'en') return 'English (EN)';
    if (lng === 'zh') return '中文 (ZH)';
    return 'Tiếng Việt (VI)';
  };

  const getTransitionText = (lng) => {
    if (lng === 'en') return 'Switch to English';
    if (lng === 'zh') return '切换至中文 (Chinese)';
    return 'Chuyển sang Tiếng Việt';
  };

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={toggle}
        title={getTransitionText(nextLang)}
        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150 text-[var(--muted-1)] hover:bg-white/5 hover:text-[var(--muted-2)] border border-[var(--brand-primary-18)] bg-transparent cursor-pointer shrink-0 ${className}`}
      >
        <span className="text-base leading-none">
          {getFlag(currentLang)}
        </span>
      </button>
    );
  }

  if (variant === 'menu') {
    return (
      <button
        type="button"
        onClick={toggle}
        title={getTransitionText(nextLang)}
        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-[var(--muted-1)] bg-transparent border border-[var(--brand-primary-35)] cursor-pointer transition-all hover:bg-[var(--brand-primary-10)] hover:text-[var(--brand-primary)] w-full shrink-0 ${className}`}
      >
        <span className="text-base leading-none">
          {getFlag(currentLang)}
        </span>
        <span className="font-semibold">
          {getFullName(currentLang)}
        </span>
      </button>
    );
  }

  // default variant (used in Top Bar / Navbar)
  return (
    <button
      type="button"
      onClick={toggle}
      title={getTransitionText(nextLang)}
      className={`flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors hover:bg-muted cursor-pointer ${className}`}
    >
      <span className="text-base leading-none">
        {getFlag(currentLang)}
      </span>
      <span className="hidden sm:inline">
        {getLabel(currentLang)}
      </span>
    </button>
  );
}
