export default function SkeletonCard() {
  return (
    <div className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="relative">
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-gray-300 h-6 w-24 rounded-full" />
        </div>
        <div className="w-full aspect-square bg-gray-200" />
      </div>
      <div className="px-4 py-3">
        <div className="bg-gray-200 h-4 w-32 rounded" />
      </div>
    </div>
  );
}

