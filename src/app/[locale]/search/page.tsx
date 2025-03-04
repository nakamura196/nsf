import { routing } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import Search from '@/components/page/search';
import { getTranslations } from 'next-intl/server';
import Layout from '@/components/layout/Layout';

// SSG対応
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function SearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Search');

  const breadcrumbItems = [{ title: t('title') }];

  return (
    <Layout
      breadcrumbItems={breadcrumbItems}
      title={t('title')}
      description={t('description')}
      fluid
    >
      <Search />
    </Layout>
  );
}
