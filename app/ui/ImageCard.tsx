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
        <div
          className="w-full aspect-square bg-gray-100 flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <div className="px-4 py-3">
          <p>{`${provider} ${model}`}</p>
        </div>
      </div>
    </div>
  );
}
