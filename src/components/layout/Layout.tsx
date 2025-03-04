import Breadcrumb from '@/components/layout/Breadcrumb';
export default function Static({
  title,
  description,
  breadcrumbItems,
  children,
  fluid = false,
}: {
  title: string;
  description?: string;
  breadcrumbItems: { title: string; href?: string }[];
  children: React.ReactNode;
  fluid?: boolean;
}) {
  return (
    <>
      <Breadcrumb items={breadcrumbItems} />

      <div className="max-w-4xl mx-auto px-4">
        {/* 記事ヘッダー */}
        <header className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6">
            {title}
          </h1>
          {description && (
            <p className="text-gray-600 dark:text-gray-300 mb-4 md:mb-6">{description}</p>
          )}
        </header>
      </div>
      <div
        className={`
            px-4 py-8 md:py-12
            ${fluid ? 'max-w-full' : 'container mx-auto'}
          `}
      >
        {children}
      </div>
    </>
  );
}
