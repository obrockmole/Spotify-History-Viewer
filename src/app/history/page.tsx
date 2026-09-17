"use client";

import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function HistoryPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/history/overview');
    }, [router]);
}