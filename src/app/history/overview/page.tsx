"use client";

import React from "react";
import {useFilteredHistory} from "@/context/FilteredHistoryContext";
import styles from "../history.module.css";
import ListensOverTime from "@/components/ListensOverTime";
import ListensByPlatform from "@/components/ListensByPlatform";
import ListensByCountry from "@/components/ListensByCountry";
import TopSongListens from "@/components/TopSongListens";

export default function OverviewPage() {
    const {stats, monthlyData, platformData, countryData, songData} = useFilteredHistory();

    return (
        <div className={styles.mainContent}>
            <div className={`${styles.card} ${styles.topRow}`}>
                <div className={styles.cardBody}>
                    <h2 className={styles.cardTitle}>Listens Over Time</h2>
                </div>
                <div className={styles.cardDivider}></div>
                <div className={styles.cardBody}>
                    <ListensOverTime data={monthlyData}/>
                </div>
            </div>

            <div className={`${styles.card} ${styles.statsCard}`}>
                <div className={styles.cardBody}>
                    <h2 className={styles.cardTitle}>Listening Stats</h2>
                </div>
                <div className={styles.cardDivider}></div>
                <div className={styles.cardBody}>
                    <div className={styles.statsContainer}>
                        <div className={styles.statsItem}>
                            <span className={styles.statsLabel}>Total Listens</span>
                            <span className={styles.statsValue}>{stats.listens}</span>
                        </div>
                        <div className={styles.statsSubItem}>
                            <span className={styles.statsLabel}>Unique songs</span>
                            <span className={styles.statsValue}>{stats.uniqueSongs}</span>
                        </div>
                        <div className={styles.statsSubItem}>
                            <span className={styles.statsLabel}>Skipped</span>
                            <span className={styles.statsValue}>{stats.skippedSongs}</span>
                        </div>

                        <div className={styles.statsItem}>
                            <span className={styles.statsLabel}>Total Artists</span>
                            <span className={styles.statsValue}>{stats.uniqueArtists}</span>
                        </div>

                        <div>
                            <h3 className={styles.statsLabel}>Time Spent Listening</h3>
                            <div className={styles.statsSubItem}>
                                <span className={styles.statsLabel}>Minutes</span>
                                <span className={styles.statsValue}>{stats.minutesListened}</span>
                            </div>
                            <div className={styles.statsSubItem}>
                                <span className={styles.statsLabel}>Hours</span>
                                <span className={styles.statsValue}>{(stats.minutesListened / 60).toFixed(1)}</span>
                            </div>
                            <div className={styles.statsSubItem}>
                                <span className={styles.statsLabel}>Days</span>
                                <span className={styles.statsValue}>{(stats.minutesListened / 1440).toFixed(1)}</span>
                            </div>
                        </div>

                        <div>
                            <span className={styles.statsLabel}>Avg ______ per Day</span>
                            <div className={styles.statsSubItem}>
                                <span className={styles.statsLabel}>Listens</span>
                                <span className={styles.statsValue}>{(stats.listens / stats.days).toFixed(1)}</span>
                            </div>
                            <div className={styles.statsSubItem}>
                                <span className={styles.statsLabel}>Artists</span>
                                <span className={styles.statsValue}>{(stats.uniqueArtists / stats.days).toFixed(1)}</span>
                            </div>
                            <div className={styles.statsSubItem}>
                                <span className={styles.statsLabel}>Minutes listened</span>
                                <span className={styles.statsValue}>{(stats.minutesListened / stats.days).toFixed(1)}</span>
                            </div>
                        </div>

                        <div>
                            <h3 className={styles.statsLabel}>Most Active...</h3>
                            <div className={styles.statsSubItem}>
                                <span className={styles.statsLabel}>Year</span>
                                <span className={styles.statsValue}>{stats.mostActiveYear || "-"}</span>
                            </div>
                            <div className={styles.statsSubItem}>
                                <span className={styles.statsLabel}>Month</span>
                                <span className={styles.statsValue}>{stats.mostActiveMonth || "-"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.bottomRow}>
                <div className={styles.card}>
                    <div className={styles.cardBody}>
                        <h2 className={styles.cardTitle}>Top Songs by Listens</h2>
                    </div>
                    <div className={styles.cardDivider}></div>
                    <div className={styles.cardBody}>
                        <TopSongListens data={songData}/>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardBody}>
                        <h2 className={styles.cardTitle}>Listens by Platform</h2>
                    </div>
                    <div className={styles.cardDivider}></div>
                    <div className={styles.cardBody}>
                        <ListensByPlatform data={platformData}/>
                    </div>
                </div>
            </div>

            <div className={`${styles.card} ${styles.countryCard}`}>
                <div className={styles.cardBody}>
                    <h2 className={styles.cardTitle}>Listens by Country</h2>
                </div>
                <div className={styles.cardDivider}></div>
                <div className={styles.cardBody}>
                    <ListensByCountry data={countryData}/>
                </div>
            </div>
        </div>
    );
}