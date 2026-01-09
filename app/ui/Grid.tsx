"use client";
import ImageCard2 from "./ImageCard2";
import SkeletonCard from "./SkeletonCard";
import { useEffect, useState } from "react";
import {
  fetchInitial,
  fetchAllModels,
  fetchRandomSvgs,
  searchByModelOrProvider,
} from "@/app/actions";
import type { SvgWithModelAndProvider } from "@/app/lib/definitions";
import { useDebounce } from "@/app/lib/useDebounce";

type GridMode = "initial" | "search" | "showAll" | "randomize";

interface GridProps {
  searchQuery: string;
  mode: GridMode;
  randomizeGroups?: string[][];
  randomizeKey?: number;
}

export default function Grid({ searchQuery, mode, randomizeGroups, randomizeKey }: GridProps) {
  const [displayData, setDisplayData] = useState<SvgWithModelAndProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        let data: SvgWithModelAndProvider[] = [];

        if (mode === "search") {
          // Only search if we have a query
          if (debouncedSearchQuery.trim()) {
            data = await searchByModelOrProvider(debouncedSearchQuery);
          } else {
            // Empty grid when search is cleared
            data = [];
          }
        } else if (mode === "showAll") {
          data = await fetchAllModels();
        } else if (mode === "randomize" && randomizeGroups) {
          data = await fetchRandomSvgs(randomizeGroups);
        } else {
          // Initial load
          data = await fetchInitial([
            "haiku",
            "sonnet-3.7",
            "gpt-4o-mini",
            "gpt-4.1",
          ]);
        }

        // Data is already sorted by model release date from service layer
        // (except for search mode, which doesn't need sorting)

        setDisplayData(data);
      } catch (error) {
        console.error("Error loading data:", error);
        setDisplayData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [mode, debouncedSearchQuery, randomizeGroups, randomizeKey]);

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // Show empty state for search
  if (mode === "search" && debouncedSearchQuery.trim() && displayData.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-gray-500 text-lg">
          No results found for &quot;{debouncedSearchQuery}&quot;
        </p>
      </div>
    );
  }

  // Show empty grid when search is cleared
  if (mode === "search" && !debouncedSearchQuery.trim()) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {displayData.map((svgData, i) => (
        <ImageCard2 key={svgData.id || i} svgData={svgData} index={i} />
      ))}
    </div>
  );
}
