type SvgData = {
  id: string;
  content: string;
  provider: string;
  model: string;
};

export default function ImageCard({ svgData }: { svgData: SvgData }) {
  const { content, provider, model } = svgData;
  return (
    <div>
      <div className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative">
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-black/70 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {model}
            </span>
          </div>
          <div
            className="w-full aspect-square bg-gray-100 flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        <div className="px-4 py-3">
          <p className="text-sm text-gray-600">{`${provider} `}</p>
        </div>
      </div>
    </div>
  );
}
