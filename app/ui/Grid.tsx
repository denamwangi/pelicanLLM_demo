"use client";
import ImageCard from "./ImageCard";
import ImageCard2 from "./ImageCard2";
import svgJson from "../data/svgs.json";
import { useEffect, useState } from "react";
import { fetchInitial } from "@/app/actions";
import { Svg } from "@prisma/client";
import type { SvgWithModelAndProvider } from "@/app/lib/definitions";
type SvgData = {
  id: string;
  content: string;
  provider: string;
  model: string;
};

export default function Grid() {
  const [data, setData] = useState<SvgData[]>([]);
  const [intialData, setInitialData] = useState<SvgWithModelAndProvider[]>([]);

  useEffect(() => {
    const loadJson = async () => {
      setData(svgJson);
      const resData = await fetchInitial([
        "haiku",
        "sonnet-3.7",
        "gpt-4o-mini",
        "gpt-4.1",
      ]);
      resData.sort((a, b) => {
        // Use a fallback (0) if the date is null or undefined
        const dateA = a.model.releaseDate
          ? new Date(a.model.releaseDate).getTime()
          : 0;
        const dateB = b.model.releaseDate
          ? new Date(b.model.releaseDate).getTime()
          : 0;

        return dateA - dateB; // Newest to oldest
      });
      setInitialData(resData);
    };
    loadJson();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
      {intialData?.map((initial, i) => (
        <ImageCard2 key={i} svgData={initial} />
      ))}
      {/* {data?.map((svgData, i) => (
        <ImageCard key={i} index={i} svgData={svgData} />
      ))} */}
    </div>
  );
}
