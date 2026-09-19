"use client";

import React from "react";
import styles from "../history.module.css";
import MinutesByYear from "@/components/timeline/MinutesByYear";
import {useFilteredHistory} from "@/context/FilteredHistoryContext";

export default function TimelinePage() {
    const {yearlyMinutesData} = useFilteredHistory();

    return (
        <div>
            <div className={styles.card}>
                <div className={styles.cardBody}>
                    <h2 className={styles.cardTitle}>Timeline</h2>
                </div>
                <div className={styles.cardDivider}></div>
                <div className={styles.cardBody}>
                    <MinutesByYear data={yearlyMinutesData} />
                </div>
            </div>
        </div>
    );
}
