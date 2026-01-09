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
      setData(svgJson);
    };
    loadJson();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
      {data?.map((svgData, i) => (
        <ImageCard key={i} svgData={svgData} />
      ))}
    </div>
  );
}
