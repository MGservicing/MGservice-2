export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-md p-2 flex flex-col h-full animate-pulse">
      {/* Image placeholder */}
      <div className="w-full h-32 bg-gray-200 rounded-md mb-3"></div>

      {/* Text placeholders */}
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
  );
}
