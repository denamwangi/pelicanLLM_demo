import {
  MagnifyingGlassIcon,
  QueueListIcon,
  XMarkIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

interface ControlBarProps {
  query: string;
  setQuery: (query: string) => void;
  onRandomize: () => void;
  onShowAll: () => void;
}

export default function ControlBar({
  query,
  setQuery,
  onRandomize,
  onShowAll,
}: ControlBarProps) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center gap-3 p-2 bg-white border border-slate-200 rounded-2xl shadow-sm focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
        {/* Search Input */}
        <div className="flex-1 flex items-center gap-2 pl-2">
          <MagnifyingGlassIcon className="w-5 h-5 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by model or provider..."
            className="w-full bg-transparent outline-none text-slate-600 placeholder:text-slate-400"
          />
          {query && (
            <button onClick={() => setQuery("")}>
              <XMarkIcon className="w-4 h-4 text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>

        <div className="h-8 w-[1px] bg-slate-200 mx-1" />

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, rotate: 15 }}
            onClick={onRandomize}
            className="p-2 text-slate-500 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors"
            title="Randomize"
          >
            <BoltIcon className="w-6 h-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onShowAll}
            className="p-2 text-slate-500 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors"
            title="Show All"
          >
            <QueueListIcon className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
