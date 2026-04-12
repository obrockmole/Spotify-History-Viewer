"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useHistory } from "@/context/HistoryContext";

export default function HistoryPage() {
  const router = useRouter();
  const { history } = useHistory();
  const [selectedYear, setSelectedYear] = useState<string>("Total");

  const years = Array.from(new Set(history.map(item => new Date(item.ts).getFullYear().toString()))).sort();

  const [stats, setStats] = useState({
    listens: 0,
    uniqueArtists: 0,
    minutesListened: 0,
  });

  useEffect(() => {
    if (history.length === 0) {
      router.push("/");
      return;
    }

    const filteredListens = selectedYear === "Total"
      ? history
      : history.filter(item => new Date(item.ts).getFullYear().toString() === selectedYear);

    const artists = new Set(filteredListens.map(item => item.master_metadata_album_artist_name));
    const totalMs = filteredListens.reduce((acc, item) => acc + item.ms_played, 0);
    const minutesListened = Math.round(totalMs / 60000);

    setStats({
      listens: filteredListens.length,
      uniqueArtists: artists.size,
      minutesListened,
    });

  }, [history, selectedYear, router]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black text-zinc-900 dark:text-zinc-50">
      <main className="flex flex-col items-center justify-center flex-1 w-full max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        {years.length > 1 && (
          <div className="mb-8">
            <nav className="flex space-x-4">
              <button
                onClick={() => setSelectedYear("Total")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${selectedYear === "Total" ? "bg-blue-600 text-white" : "text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"}`}
              >
                Total
              </button>

              {years.map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${selectedYear === year ? "bg-blue-600 text-white" : "text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"}`}
                >
                  {year}
                </button>
              ))}
            </nav>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl">
            <div className="p-6 rounded-lg shadow-md bg-zinc-100 dark:bg-zinc-800">
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Total Listens</h2>
                <p className="mt-2 text-4xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.listens.toLocaleString()}
                </p>
            </div>

            <div className="p-6 rounded-lg shadow-md bg-zinc-100 dark:bg-zinc-800">
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Artists</h2>
                <p className="mt-2 text-4xl font-bold text-green-600 dark:text-green-400">
                    {stats.uniqueArtists.toLocaleString()}
                </p>
            </div>

            <div className="p-6 rounded-lg shadow-md bg-zinc-100 dark:bg-zinc-800">
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Minutes Listened</h2>
                <p className="mt-2 text-4xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.minutesListened.toLocaleString()}
                </p>
            </div>
        </div>
      </main>
    </div>
  );
}
