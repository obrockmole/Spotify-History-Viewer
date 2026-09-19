"use client";

import {createContext, ReactNode, useContext, useState} from "react";
import {Listen} from "@/types";

export interface AggregatedData {
    date: number;
    value: number
}

export interface PlatformData {
    platform: string;
    value: number
}

export interface CountryData {
    id: string;
    value: number
}

export interface SongData {
    song: string;
    value: number
}

export interface YearlyMinutesData {
    year: string;
    data: AggregatedData[];
}

export interface Stats {
    listens: number;
    uniqueSongs: number;
    uniqueArtists: number;
    minutesListened: number;
    skippedSongs: number;
    days: number;
    mostActiveYear: string;
    mostActiveMonth: string;
}

interface HistoryContextType {
    setHistory: (history: Listen[]) => void;
    history: Listen[];
    stats?: Stats;
    dailyData?: AggregatedData[];
    monthlyData?: AggregatedData[];
    platformData?: PlatformData[];
    countryData?: CountryData[];
    songData?: SongData[];
    yearlyMinutesData?: YearlyMinutesData[];
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function computeAggregates(history: Listen[]) {
    const dayMap: Record<number, number> = {};
    const monthMap: Record<number, number> = {};
    const platformMap: Record<string, number> = {};
    const countryMap: Record<string, number> = {};
    const artistSet = new Set<string>();
    const songMap: Record<string, number> = {};
    const yearlyMinutesMap: Record<number, AggregatedData[]> = {};
    const cumulativeMins: Record<string, number> = {};

    let totalSeconds = 0;
    let skipped = 0;
    let minTime = Infinity;
    let maxTime = -Infinity;

    for (let i = 0; i < history.length; i++) {
        const entry = history[i];
        const dayKey = entry.dayKey!;
        const monthKey = entry.monthKey!;
        const yearKey = entry.yearKey!;
        const time = entry.timestamp!;

        const dateObj = new Date(time);
        const normalizedDate = new Date(yearKey, dateObj.getMonth(), dateObj.getDate(), dateObj.getHours(), dateObj.getMinutes()).getTime();

        dayMap[dayKey] = (dayMap[dayKey] || 0) + 1;
        monthMap[monthKey] = (monthMap[monthKey] || 0) + 1;

        const platform = (entry.platform || "Unknown").trim();
        platformMap[platform] = (platformMap[platform] || 0) + 1;

        if (entry.conn_country) {
            const countryCode = entry.conn_country.toUpperCase().trim();
            if (countryCode) {
                countryMap[countryCode] = (countryMap[countryCode] || 0) + 1;
            }
        }

        if (entry.master_metadata_track_name) {
            songMap[entry.master_metadata_track_name] = (songMap[entry.master_metadata_track_name] || 0) + 1;
        }
        if (entry.master_metadata_album_artist_name) {
            artistSet.add(entry.master_metadata_album_artist_name);
        }

        totalSeconds += Number(entry.ms_played) / 1000 || 0;

        if (!yearlyMinutesMap[yearKey]) {
            yearlyMinutesMap[yearKey] = [];
            cumulativeMins[yearKey] = 0;
        }

        cumulativeMins[yearKey] += (Number(entry.ms_played) / 1000 / 60);
        yearlyMinutesMap[yearKey].push({
            date: normalizedDate,
            value: cumulativeMins[yearKey]
        });

        if (entry.skipped) {
            skipped++;
        }

        if (time < minTime) {
            minTime = time;
        }
        if (time > maxTime) {
            maxTime = time;
        }
    }

    const daily = Object.keys(dayMap).map(day => ({
        date: parseInt(day),
        value: dayMap[parseInt(day)]
    })).sort((a, b) => a.date - b.date);
    const monthly = Object.keys(monthMap).map(month => ({
        date: parseInt(month),
        value: monthMap[parseInt(month)]
    })).sort((a, b) => a.date - b.date);
    const platforms = Object.keys(platformMap).map(platform => ({
        platform: platform,
        value: platformMap[platform]
    })).sort((a, b) => b.value - a.value).slice(0, 10);
    const countries = Object.keys(countryMap).map(country => ({
        id: country,
        value: countryMap[country]
    })).sort((a, b) => b.value - a.value);
    const songListens = Object.keys(songMap).map(song => ({
        song: song,
        value: songMap[song]
    })).sort((a, b) => b.value - a.value).slice(0, 10);
    const yearlyMinutes = Object.keys(yearlyMinutesMap).map(year => ({
        year,
        data: yearlyMinutesMap[parseInt(year)]
    }));

    const minutesListened = Math.round(totalSeconds / 60);

    let days = 1;
    if (minTime !== Infinity && maxTime !== -Infinity && maxTime > minTime) {
        const diff = maxTime - minTime;
        days = Math.max(1, Math.ceil(diff / 86400000));
    }

    const yearMap: Record<number, number> = {};
    const monthLabelMap: Record<string, number> = {};
    for (let i = 0; i < daily.length; i++) {
        const date = new Date(daily[i].date);
        const year = date.getFullYear();

        const monthKey = `${date.getMonth() + 1}-${date.getFullYear()}`;

        yearMap[year] = (yearMap[year] || 0) + daily[i].value;
        monthLabelMap[monthKey] = (monthLabelMap[monthKey] || 0) + daily[i].value;
    }

    const mostActiveYear = (() => {
        const entries = Object.entries(yearMap);
        if (entries.length === 0) {
            return "";
        }
        return entries.reduce((a, b) => Number(b[1]) > Number(a[1]) ? b : a)[0];
    })();

    const mostActiveMonth = (() => {
        const entries = Object.entries(monthLabelMap);
        if (entries.length === 0) {
            return "";
        }

        const monthKey = entries.reduce((a, b) => Number(b[1]) > Number(a[1]) ? b : a)[0];
        return monthKey.split('-').map((v, i) => i === 0 ? v : v).join(' ');
    })();

    const stats = {
        listens: history.length,
        uniqueSongs: songMap.size,
        uniqueArtists: artistSet.size,
        skippedSongs: skipped,
        minutesListened: minutesListened,
        days: days,
        mostActiveYear: mostActiveYear,
        mostActiveMonth: mostActiveMonth
    };

    return {daily, monthly, platforms, countries, songListens, stats, yearlyMinutes};
}

export function HistoryProvider({children}: { children: ReactNode }) {
    const [history, _setHistory] = useState<Listen[]>([]);
    const [stats, setStats] = useState<Stats | undefined>(undefined);
    const [daily, setDaily] = useState<AggregatedData[] | undefined>(undefined);
    const [monthly, setMonthly] = useState<AggregatedData[] | undefined>(undefined);
    const [platforms, setPlatforms] = useState<PlatformData[] | undefined>(undefined);
    const [countries, setCountries] = useState<CountryData[] | undefined>(undefined);
    const [songListens, setSongListens] = useState<SongData[] | undefined>(undefined);
    const [yearlyMinutes, setYearlyMinutes] = useState<YearlyMinutesData[] | undefined>(undefined);

    const setHistory = (rawHistory: Listen[]) => {
        const history = rawHistory.map(entry => {
            const date = new Date(entry.ts);
            return {
                ...entry,
                timestamp: date.getTime(),
                dayKey: new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(),
                monthKey: new Date(date.getFullYear(), date.getMonth(), 1).getTime(),
                yearKey: date.getFullYear(),
            };
        });

        _setHistory(history);

        setTimeout(() => {
            const aggregates = computeAggregates(history);

            setStats(aggregates.stats);
            setDaily(aggregates.daily);
            setMonthly(aggregates.monthly);
            setPlatforms(aggregates.platforms);
            setCountries(aggregates.countries);
            setSongListens(aggregates.songListens)
            setYearlyMinutes(aggregates.yearlyMinutes)
        }, 0);
    };

    return (
        <HistoryContext.Provider value={{
            history,
            setHistory,
            dailyData: daily,
            monthlyData: monthly,
            platformData: platforms,
            countryData: countries,
            songData: songListens,
            yearlyMinutesData: yearlyMinutes,
            stats
        }}>
            {children}
        </HistoryContext.Provider>
    );
}

export function useHistory() {
    const context = useContext(HistoryContext);
    if (context === undefined) {
        throw new Error("useHistory must be used within a HistoryProvider");
    }
    return context;
}

