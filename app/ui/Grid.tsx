"use client";
import ImageCard from "./ImageCard";
import svgJson from "../data/svgs.json";
import { useEffect, useState } from "react";

type SvgData = {
  id: string;
  content: string;
  provider: string;
  model: string;
};

export default function Grid() {
  const [data, setData] = useState<SvgData[]>([]);

  useEffect(() => {
    const loadJson = () => {
      // const svgData = JSON.parse(svgJson);
      setData(svgJson);
    };
    loadJson();
  }, []);
  // const example1 = svgJson["claude-3-5-sonnet-20240620_25673648"];
  // const example2 = svgJson["claude-3-haiku-20240307_10dde2f4"];
  // const example3 = svgJson["gpt-o3-mini_1d3fed7b"];
  // const example4 = svgJson["gpt-4o-mini_04697c05"];
  // const example5 = svgJson["gpt-4.1-nano_c6b837b6"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 ">
      {data?.map((svgData, i) => (
        <ImageCard key={i} svgData={svgData} />
      ))}
    </div>
  );
}
