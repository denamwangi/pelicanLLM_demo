import type { SvgWithModelAndProvider } from "@/app/lib/definitions";

export default function ImageCard2({
  svgData,
  index,
}: {
  svgData: SvgWithModelAndProvider;
  index: number;
}) {
  const { content, model } = svgData;
  const { displayName, provider } = model;
  return (
    <div>
      <div
        className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-1 animate-[fadeIn_0.5s_ease-out]"
        style={{ animationDelay: `${index * 0.3}s` }}
      >
        <div className="relative">
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-black/70 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {displayName}
            </span>
          </div>
          <div
            className="w-full aspect-square bg-gray-100 flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        <div className="px-4 py-3">
          <p className="text-sm text-gray-600">{`${provider.displayName} `}</p>
        </div>
      </div>
    </div>
  );
}
