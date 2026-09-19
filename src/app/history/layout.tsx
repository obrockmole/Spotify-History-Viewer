"use client";

import React, {useCallback, useMemo, useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import styles from "./history.module.css";
import Timeline from "@/components/Timeline";
import {computeAggregates, useHistory} from "@/context/HistoryContext";
import {FilteredHistoryProvider} from "@/context/FilteredHistoryContext";

export default function HistoryLayout({children}: { children: React.ReactNode }) {
    const pathname = usePathname() || "";
    const base = "/history";
    const links = [
        {label: "Overview", href: `${base}/overview`},
        {label: "Artists", href: `${base}/artists`},
        {label: "Skips", href: `${base}/skips`},
        {label: "Timeline", href: `${base}/timeline`},
    ];

    const {
        history,
        stats,
        dailyData,
        monthlyData,
        platformData,
        countryData,
        songData,
        yearlyMinutesData
    } = useHistory();

    const [dateRange, setDateRange] = useState<{ start: number | null; end: number | null }>({start: null, end: null});

    const hasRangeChanged = dateRange.start !== null && dateRange.end !== null;

    const filteredHistory = useMemo(() => {
        if (!hasRangeChanged) {
            return history || [];
        }
        return (history || []).filter((item) => {
            return item.timestamp! >= dateRange.start! && item.timestamp! <= dateRange.end!;
        });
    }, [dateRange, history, hasRangeChanged]);

    const filteredAggregates = useMemo(() => {
        if (!hasRangeChanged) {
            return null;
        }

        return computeAggregates(filteredHistory);
    }, [filteredHistory, hasRangeChanged]);

    const handleRangeChange = useCallback((start: number, end: number) => {
        setDateRange({start, end});
    }, []);

    const providerValue = useMemo(() => ({
        filteredHistory,
        dateRange,
        setRange: handleRangeChange,
        stats: hasRangeChanged && filteredAggregates ? filteredAggregates.stats : (stats as never),
        dailyData: hasRangeChanged && filteredAggregates ? filteredAggregates.daily : (dailyData as never),
        monthlyData: hasRangeChanged && filteredAggregates ? filteredAggregates.monthly : (monthlyData as never),
        platformData: hasRangeChanged && filteredAggregates ? filteredAggregates.platforms : (platformData as never),
        countryData: hasRangeChanged && filteredAggregates ? filteredAggregates.countries : (countryData as never),
        songData: hasRangeChanged && filteredAggregates ? filteredAggregates.songListens : (songData as never),
        yearlyMinutesData: hasRangeChanged && filteredAggregates ? filteredAggregates.yearlyMinutes : (yearlyMinutesData as never)}
    ), [filteredHistory, dateRange, handleRangeChange, hasRangeChanged, filteredAggregates, stats, dailyData, monthlyData, platformData, countryData, songData, yearlyMinutesData]);

    return (
        <FilteredHistoryProvider value={providerValue}>
            <div className={styles.container}>
                <h1 className={styles.title}>Spotify History Viewer</h1>

                <div className={styles.navButtons}>
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={styles.button}
                            style={pathname === link.href ? {outline: "2px solid rgba(85,255,155,0.75)"} : undefined}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className={styles.card}>
                    <div className={`${styles.cardBody} ${styles.timelineCardBody}`}>
                        <Timeline history={history || []} onRangeChange={handleRangeChange}/>
                    </div>
                </div>

                <div style={{marginTop: "1rem"}}>{children}</div>

                <footer className={styles.footer}>
                    © 2026 obrockmole. All rights reserved.
                </footer>
            </div>
        </FilteredHistoryProvider>
    );
}
