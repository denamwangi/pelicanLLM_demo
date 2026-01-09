import Grid from "./ui/Grid";

export default function Home() {
  return (
    <div>
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-8 py-12 mb-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">AI Model Evolution</h1>
          <p className="text-lg mb-2">
            Same prompt, different interpretations. Explore how various AI
            models visualize the same concept.
          </p>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 inline-block">
            <p className="text-sm font-semibold">
              Current Prompt: "Draw a pelican on a bike"
            </p>
          </div>
        </div>
      </div>
      <div className="px-4 h-full py-8">
        <Grid />
      </div>
    </div>
  );
}
