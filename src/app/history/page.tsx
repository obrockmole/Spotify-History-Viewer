"use client";

import { useRouter } from "next/navigation";
import React, {useCallback, useEffect, useState} from "react";
import { useHistory } from "@/context/HistoryContext";
import styles from "./history.module.css";
import Timeline from "@/components/Timeline";
import { Listen } from "@/types";
import ListensOverTime from "@/components/ListensOverTime";

export default function HistoryPage() {
  const router = useRouter();
  const { history } = useHistory();
  const [filteredHistory, setFilteredHistory] = useState<Listen[]>(history);
  const [dateRange, setDateRange] = useState<{ start: number | null, end: number | null }>({ start: null, end: null });

  const [stats, setStats] = useState({
    listens: 0,
    uniqueSongs: 0,
    skippedSongs: 0,
    uniqueArtists: 0,
    minutesListened: 0,
    days: 0,
    mostActiveYear: "",
    mostActiveMonth: ""
  });

  useEffect(() => {
    if (history.length === 0) {
      router.push("/");
    }
  }, [history, router]);

  useEffect(() => {
    setFilteredHistory(history);
  }, [history]);

  useEffect(() => {
    const artists = new Set(filteredHistory.map(item => item.master_metadata_album_artist_name));
    const totalMs = filteredHistory.reduce((acc, item) => acc + item.ms_played, 0);
    const minutesListened = Math.round(totalMs / 60000);
    const uniqueSongs = new Set(filteredHistory.map(item => item.master_metadata_track_name));
    const skippedSongs = filteredHistory.filter(item => item.skipped).length;

    let days = 1;
    if (dateRange.start && dateRange.end && dateRange.end > dateRange.start) {
      const timeDiff = Math.abs(dateRange.end - dateRange.start);
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      days = daysDiff > 0 ? daysDiff : 1;
    }

    const yearMap = new Map<number, number>();
    const monthMap = new Map<string, number>();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    filteredHistory.forEach(item => {
      const date = new Date(item.ts);

      const year = new Date(item.ts).getFullYear();
      yearMap.set(year, (yearMap.get(year) || 0) + 1);

      const monthKey = `${String(date.getMonth() + 1)}-${date.getFullYear()}`;
      monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
    });

    const mostActiveYear = (() => {
      const entries = Array.from(yearMap.entries());
      if (entries.length === 0) {
        return "";
      }
      return entries.reduce((a, b) => b[1] > a[1] ? b : a)[0].toString();
    })();

    const mostActiveMonth = (() => {
      const entries = Array.from(monthMap.entries());
      if (entries.length === 0) {
        return "";
      }
      const monthKey = entries.reduce((a, b) => b[1] > a[1] ? b : a)[0];
      const [month, year] = monthKey.split('-');
      const monthName = months[parseInt(month) - 1] || month;
      return `${monthName} ${year}`;
    })();

    setStats({
      listens: filteredHistory.length,
      uniqueSongs: uniqueSongs.size,
      skippedSongs,
      uniqueArtists: artists.size,
      minutesListened,
      days,
      mostActiveYear,
      mostActiveMonth
    });
  }, [filteredHistory, dateRange]);

  const handleRangeChange = useCallback((start: number, end: number) => {
    setDateRange({ start, end });
    const newFilteredHistory = history.filter(item => {
      const itemDate = new Date(item.ts).getTime();
      return itemDate >= start && itemDate <= end;
    });
    setFilteredHistory(newFilteredHistory);
  }, [history]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Spotify History Viewer
      </h1>

      <div className={styles.card}>
        <div className={`${styles.cardBody} ${styles.timelineCardBody}`}>
          <Timeline history={history} onRangeChange={handleRangeChange} />
        </div>
      </div>

      <div className={styles.navButtons}>
        {["Overview", "Artists", "Skips", "Timeline"].map(label => (
          <button key={label} className={styles.button}>
            {label}
          </button>
        ))}
      </div>

      <div className={styles.mainContent}>
        <div className={styles.leftColumn}>
          <div className={`${styles.card} ${styles.topRow}`}>
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>Listens Over Time</h2>
            </div>
            <div className={styles.cardDivider}></div>
            <div className={styles.cardBody}>
              <ListensOverTime history={filteredHistory} />
            </div>
          </div>

          <div className={styles.bottomRow}>
            <div className={`${styles.card} ${styles.bottomLeftCard}`}>
              <div className={styles.cardBody}>
                <h2 className={styles.cardTitle}>Activity by Day/Week</h2>
              </div>
              <div className={styles.cardDivider}></div>
              <div className={styles.cardBody}>
                  <p className="text-2xl" style={{textAlign: "center"}}>🚧 Work in Progress 🚧</p>
              </div>
            </div>

            <div className={`${styles.card} ${styles.bottomRightCard}`}>
              <div className={styles.cardBody}>
                <h2 className={styles.cardTitle}>Listens by Device</h2>
              </div>
              <div className={styles.cardDivider}></div>
              <div className={styles.cardBody}>
                  <p className="text-2xl" style={{textAlign: "center"}}>🚧 Work in Progress 🚧</p>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.card} ${styles.rightColumn}`}>
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
                 <div className={styles.statsSubItem}>
                   <span className={styles.statsLabel}>Week</span>
                   <span className={styles.statsValue}>-</span>
                 </div>
                 <div className={styles.statsSubItem}>
                   <span className={styles.statsLabel}>Day</span>
                   <span className={styles.statsValue}>-</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
