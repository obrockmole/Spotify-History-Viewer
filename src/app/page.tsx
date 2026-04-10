"use client";

import React, { useState } from "react";

export default function Home() {
  const [entryCount, setEntryCount] = useState<number | null>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    setFileNames(Array.from(files).map(f => f.name));
    setEntryCount(null);
    setError(null);

    let totalEntries = 0;
    const filePromises = Array.from(files).map(file => {
      return new Promise<number>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result;
            if (typeof content === "string") {
              const data = JSON.parse(content);
              if (Array.isArray(data)) {
                resolve(data.length);
              } else {
                reject("Invalid JSON format.");
              }
            }
          } catch (err) {
            console.error(err);
            reject(`Error parsing ${file.name}.`);
          }
        };
        reader.onerror = () => {
          reject(`Error reading ${file.name}.`);
        };
        reader.readAsText(file);
      });
    });

    Promise.all(filePromises)
      .then(entryCounts => {
        totalEntries = entryCounts.reduce((acc, count) => acc + count, 0);
        setEntryCount(totalEntries);
      })
      .catch(err => {
        setError(err);
      });
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black text-zinc-900 dark:text-zinc-50">
      <main className="flex flex-col items-center justify-center flex-1 w-full max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-8">
          Spotify History Viewer
        </h1>

        <div className="w-full max-w-sm">
          <label
            htmlFor="file-upload"
            className="cursor-pointer inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700"
          >
            Select JSON File
          </label>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept=".json"
            onChange={handleFileUpload}
            multiple
          />
        </div>

        {fileNames.length > 0 && (
          <div className="mt-8 text-lg">
            <p>
              Files: <span className="font-medium">{fileNames.join(", ")}</span>
            </p>
          </div>
        )}

        {entryCount !== null && (
          <div className="mt-4 text-2xl font-semibold text-green-600 dark:text-green-400">
            <p>Number of entries: {entryCount.toLocaleString()}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 text-lg text-red-600 dark:text-red-400">
            <p>{error}</p>
          </div>
        )}
      </main>
    </div>
  );
}
