"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Listen } from "@/types";

function getInitialState() {
  if (typeof window === "undefined") {
    return { listens: [], uniqueArtists: 0, minutesListened: 0 };
  }

  const storedData = sessionStorage.getItem("spotifyHistory");
  if (storedData) {
    const parsedData: Listen[] = JSON.parse(storedData);
    const artists = new Set(parsedData.map(item => item.master_metadata_album_artist_name));
    const msListened = parsedData.reduce((acc, item) => acc + item.ms_played, 0);
    const minutesListened = Math.round(msListened / 60000);
    
    return { listens: parsedData, uniqueArtists: artists.size, minutesListened };
  }

  return { listens: [], uniqueArtists: 0, minutesListened: 0 };
}

export default function HistoryPage() {
  const router = useRouter();
  const [initialState] = useState(getInitialState);
  const { listens, uniqueArtists, minutesListened } = initialState;

  useEffect(() => {
    if (initialState.listens.length === 0) {
      router.push("/");
    }
  }, [initialState.listens.length, router]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black text-zinc-900 dark:text-zinc-50">
      <main className="flex flex-col items-center justify-center flex-1 w-full max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl">
            <div className="p-6 rounded-lg shadow-md bg-zinc-100 dark:bg-zinc-800">
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Total Listens</h2>
                <p className="mt-2 text-4xl font-bold text-blue-600 dark:text-blue-400">
                    {listens.length.toLocaleString()}
                </p>
            </div>
            <div className="p-6 rounded-lg shadow-md bg-zinc-100 dark:bg-zinc-800">
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Artists</h2>
                <p className="mt-2 text-4xl font-bold text-green-600 dark:text-green-400">
                    {uniqueArtists.toLocaleString()}
                </p>
            </div>
            <div className="p-6 rounded-lg shadow-md bg-zinc-100 dark:bg-zinc-800">
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Minutes Listened</h2>
                <p className="mt-2 text-4xl font-bold text-purple-600 dark:text-purple-400">
                    {minutesListened.toLocaleString()}
                </p>
            </div>
        </div>
      </main>
    </div>
  );
}
