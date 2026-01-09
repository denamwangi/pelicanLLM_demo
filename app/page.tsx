"use client";
import Grid from "./ui/Grid";
import { useState } from "react";
import ControlBar from "./ui/controlbar";

type GridMode = "initial" | "search" | "showAll" | "randomize";

export default function Home() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<GridMode>("initial");
  const [randomizeGroups, setRandomizeGroups] = useState<string[][]>([
    ["haiku", "sonnet-3.7", "gpt-4o-mini", "gpt-4.1"],
  ]);
  const [randomizeKey, setRandomizeKey] = useState(0);

  const handleRandomize = () => {
    setMode("randomize");
    setQuery(""); // Clear search when randomizing
    // Force fresh fetch by updating the key
    setRandomizeKey((prev) => prev + 1);
  };

  const handleShowAll = () => {
    setMode("showAll");
    setQuery(""); // Clear search when showing all
  };

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    if (newQuery.trim()) {
      setMode("search");
    } else {
      setMode("initial");
    }
  };

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
              Current Prompt: Draw a pelican on a bike
            </p>
          </div>
        </div>
      </div>
      <div>
        <ControlBar
          query={query}
          setQuery={handleQueryChange}
          onRandomize={handleRandomize}
          onShowAll={handleShowAll}
        />
      </div>
      <div className="px-4 h-full py-8">
        <Grid
          searchQuery={query}
          mode={mode}
          randomizeGroups={randomizeGroups}
          randomizeKey={randomizeKey}
        />
      </div>
    </div>
  );
}
