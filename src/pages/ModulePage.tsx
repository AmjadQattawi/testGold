import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
export default function ModulePage({ title }: { title: string }) {
  const { t } = useTranslation();
  return <section className="rounded-3xl border border-control-border bg-card-background p-8 sm:p-12 shadow-sm"><p className="mb-3 text-sm font-semibold text-accent">22-Gold</p><h1 className="text-2xl font-bold">{title}</h1><p className="mt-4 text-secondary-text">{t('moduleNotImplemented')}</p><Link className="mt-6 inline-block font-medium text-accent hover:underline" to="/home">{t('homePage')}</Link></section>;
}
