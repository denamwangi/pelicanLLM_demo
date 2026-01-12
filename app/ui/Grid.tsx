"use client";
import ImageCard2 from "./ImageCard2";
import SkeletonCard from "./SkeletonCard";
import Pagination from "./Pagination";
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

const PAGE_SIZE = 9;

export default function Grid({ searchQuery, mode, randomizeGroups, randomizeKey }: GridProps) {
  const [displayData, setDisplayData] = useState<SvgWithModelAndProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Reset to page 1 when mode or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [mode, debouncedSearchQuery, randomizeGroups, randomizeKey]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        let data: SvgWithModelAndProvider[] = [];
        let total = 0;

        if (mode === "search") {
          // Only search if we have a query
          if (debouncedSearchQuery.trim()) {
            const result = await searchByModelOrProvider(
              debouncedSearchQuery,
              currentPage,
              PAGE_SIZE
            );
            data = result.data;
            total = result.total;
          } else {
            // Empty grid when search is cleared
            data = [];
            total = 0;
          }
        } else if (mode === "showAll") {
          const result = await fetchAllModels(currentPage, PAGE_SIZE);
          data = result.data;
          total = result.total;
        } else if (mode === "randomize" && randomizeGroups) {
          data = await fetchRandomSvgs(randomizeGroups);
          total = data.length;
        } else {
          // Initial load
          data = await fetchInitial([
            "haiku",
            "sonnet-3.7",
            "gpt-4o-mini",
            "gpt-4.1",
          ]);
          total = data.length;
        }

        setDisplayData(data);
        setTotalPages(Math.ceil(total / PAGE_SIZE));
      } catch (error) {
        console.error("Error loading data:", error);
        setDisplayData([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [mode, debouncedSearchQuery, randomizeGroups, randomizeKey, currentPage]);

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

  const showPagination = (mode === "search" || mode === "showAll") && totalPages > 1;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayData.map((svgData, i) => (
          <ImageCard2 key={svgData.id || i} svgData={svgData} index={i} />
        ))}
      </div>
      {showPagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
}
