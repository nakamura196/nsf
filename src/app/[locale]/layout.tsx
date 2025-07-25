import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import './globals.css';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import { getTranslations } from 'next-intl/server';

const inter = Inter({ subsets: ['latin'] });

export const generateMetadata = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const locale = (await params).locale;
  const tCommon = await getTranslations('Common');
  
  const title = tCommon('title');
  const description = tCommon('description');
  const siteName = "Next.js Search UI Sample";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nsf-psi.vercel.app";
  
  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    keywords: locale === 'ja' 
      ? "Next.js, Search UI, Fuse.js, React, TypeScript, 検索, サンプル"
      : "Next.js, Search UI, Fuse.js, React, TypeScript, search, sample",
    authors: [{ name: "NSF Project" }],
    creator: "NSF Project",
    publisher: "NSF Project",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: siteUrl,
      languages: {
        'ja': `${siteUrl}/ja`,
        'en': `${siteUrl}/en`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'ja' ? 'ja_JP' : 'en_US',
      url: siteUrl,
      siteName,
      title,
      description,
      images: [
        {
          url: `${siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/og-image.jpg`],
      creator: '@nsfproject',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    manifest: `${siteUrl}/site.webmanifest`,
    icons: {
      icon: '/favicon.ico',
    },
  };
};

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: LayoutProps) {
  const locale = (await params).locale;
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as 'en' | 'ja')) {
    notFound();
  }

  // SSG対応
  setRequestLocale(locale);

  // getMessagesを同期的に呼び出すように変更
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <Header />
            {children}
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
