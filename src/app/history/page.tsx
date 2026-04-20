"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useHistory } from "@/context/HistoryContext";
import styles from './history.module.css';

export default function HistoryPage() {
  const router = useRouter();
  const { history } = useHistory();

  const [stats, setStats] = useState({
    listens: 0,
    uniqueSongs: 0,
    skippedSongs: 0,
    uniqueArtists: 0,
    minutesListened: 0,
  });

  useEffect(() => {
    if (history.length === 0) {
      router.push("/");
      return;
    }

    const artists = new Set(history.map(item => item.master_metadata_album_artist_name));
    const totalMs = history.reduce((acc, item) => acc + item.ms_played, 0);
    const minutesListened = Math.round(totalMs / 60000);
    const uniqueSongs = new Set(history.map(item => item.master_metadata_track_name));
    const skippedSongs = history.filter(item => item.skipped).length;

    setStats({
      listens: history.length,
      uniqueSongs: uniqueSongs.size,
      skippedSongs,
      uniqueArtists: artists.size,
      minutesListened,
    });
  }, [history, router]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className="text">Timeline</h2>
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
                <p className="text-2xl" style={{textAlign: "center"}}>🚧 Work in Progress 🚧</p>
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
                <h3 className={styles.statsLabel}>Time spent listening</h3>
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

              <div className={styles.statsItem}>
                <span className={styles.statsLabel}>Avg Listens per Day</span>
                <span className={styles.statsValue}>0</span>
              </div>

              <div className={styles.statsItem}>
                <span className={styles.statsLabel}>Longest time without listens</span>
                <span className={styles.statsValue}>0</span>
              </div>

              <div>
                <h3 className={styles.statsLabel}>Most Active...</h3>
                <div className={styles.statsSubItem}>
                  <span className={styles.statsLabel}>Year</span>
                  <span className={styles.statsValue}>0</span>
                </div>
                <div className={styles.statsSubItem}>
                  <span className={styles.statsLabel}>Month</span>
                  <span className={styles.statsValue}>0</span>
                </div>
                <div className={styles.statsSubItem}>
                  <span className={styles.statsLabel}>Day</span>
                  <span className={styles.statsValue}>0</span>
                </div>
                <div className={styles.statsSubItem}>
                  <span className={styles.statsLabel}>Hour</span>
                  <span className={styles.statsValue}>0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
