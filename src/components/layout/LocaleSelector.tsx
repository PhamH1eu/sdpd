import { LOCALES } from '../../i18n';
import { useGameState } from '../../hooks/useGameState';
import { useTranslation } from '../../i18n';

interface LocaleSelectorProps {
  compact?: boolean;
}

export function LocaleSelector({ compact = false }: LocaleSelectorProps) {
  const { locale, setLocale } = useGameState();
  const { t } = useTranslation();

  return (
    <label className="flex items-center gap-2 text-xs font-mono text-noir-400">
      {!compact && <span>{t('settings.language')}</span>}
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value as typeof locale)}
        aria-label={t('settings.language')}
        className="min-h-9 rounded border border-noir-600/50 bg-noir-900 px-2 text-xs text-noir-200 outline-none hover:border-amber-500/40 focus:border-amber-500/60"
      >
        {LOCALES.map((option) => (
          <option key={option.value} value={option.value}>
            {compact ? option.shortLabel : option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
