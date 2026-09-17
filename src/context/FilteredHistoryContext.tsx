"use client";

import React, {ReactNode} from "react";
import {AggregatedData, CountryData, PlatformData, SongData, Stats} from "@/context/HistoryContext";
import {Listen} from "@/types";

type DateRange = { start: number | null; end: number | null };

interface FilteredHistoryContextType {
    filteredHistory: Listen[];
    dateRange: DateRange;
    stats: Stats;
    dailyData: AggregatedData[];
    monthlyData: AggregatedData[];
    platformData: PlatformData[];
    countryData: CountryData[];
    songData: SongData[];
    setRange: (start: number, end: number) => void;
}

const FilteredHistoryContext = React.createContext<FilteredHistoryContextType | undefined>(undefined);

export function FilteredHistoryProvider({children, value}: { children: ReactNode; value: FilteredHistoryContextType }) {
    return (
        <FilteredHistoryContext.Provider value={value}>
            {children}
        </FilteredHistoryContext.Provider>
    );
}

export function useFilteredHistory() {
    const context = React.useContext(FilteredHistoryContext);
    if (!context) {
        throw new Error("useFilteredHistory must be used within a FilteredHistoryProvider");
    }
    return context;
}
