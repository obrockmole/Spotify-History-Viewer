"use client";

import React from "react";
import styles from "../history.module.css";

export default function ArtistsPage() {
    return (
        <div>
            <div className={styles.card}>
                <div className={styles.cardBody}>
                    <h2 className={styles.cardTitle}>Artists</h2>
                </div>
                <div className={styles.cardDivider}></div>
                <div className={styles.cardBody}>
                    <p className="text-2xl" style={{textAlign: "center"}}>🚧 Work in Progress 🚧</p>
                </div>
            </div>
        </div>
    );
}
