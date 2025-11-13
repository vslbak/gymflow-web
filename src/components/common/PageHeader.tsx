interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-orange-600 to-orange-500 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">{title}</h1>
        <p className="text-xl text-orange-100">{subtitle}</p>
      </div>
    </div>
  );
}
