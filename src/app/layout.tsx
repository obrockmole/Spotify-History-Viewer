import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {HistoryProvider} from "@/context/HistoryContext";
import React from "react";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Spotify History Viewer",
    description: "View your extended Spotify listening history",
};

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <HistoryProvider>{children}</HistoryProvider>
            </body>
        </html>
    );
}
