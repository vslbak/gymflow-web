interface LoadingSkeletonProps {
  type: 'cards' | 'details';
  count?: number;
}

export default function LoadingSkeleton({ type, count = 6 }: LoadingSkeletonProps) {
  if (type === 'cards') {
    return (
      <div className="animate-pulse grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl h-96 shadow-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl h-96"></div>
        <div className="bg-white rounded-2xl h-96"></div>
      </div>
    </div>
  );
}
