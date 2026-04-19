export default function TempPage() {
    return (
        <div className="flex flex-col h-screen p-4 gap-4 bg-[#1C232B] text-white">
            <div className="w-full rounded-md shadow-md bg-[#22292F]">
                <div className="p-2">
                    <h2 className="text">Timeline</h2>
                </div>
            </div>

            <div className="flex justify-center gap-2">
                {["Overview", "Skips", "Timeline", "Artists"].map(label => (
                    <button key={label} className="px-4 py-2 rounded-full text-sm font-medium border border-gray-600 text-gray-300 hover:bg-gray-700">
                        {label}
                    </button>
                ))}
            </div>

            <div className="flex flex-1 gap-4 min-h-0">
                <div className="flex flex-col w-2/3 gap-4">
                    <div className="flex-1 rounded-md shadow-md bg-[#22292F]">
                        <div className="p-4">
                            <h2 className="text-center">Listens over time</h2>
                        </div>
                        <div className="h-1 bg-[#282F35]"></div>
                    </div>

                    <div className="flex flex-1 gap-4">
                        <div className="flex-1 rounded-md shadow-md bg-[#22292F]">
                            <div className="p-4">
                                <h2 className="text-center">Activity by day/week</h2>
                            </div>
                            <div className="h-1 bg-[#282F35]"></div>
                        </div>
                        <div className="flex-1 rounded-md shadow-md bg-[#22292F]">
                            <div className="p-4">
                                <h2 className="text-center">Listens by device</h2>
                            </div>
                            <div className="h-1 bg-[#282F35]"></div>
                        </div>
                    </div>
                </div>

                <div className="w-1/3 rounded-md shadow-md bg-[#22292F]">
                    <div className="p-4">
                        <h2 className="text-center">Listening Stats</h2>
                    </div>
                    <div className="h-1 bg-[#282F35]"></div>
                </div>
            </div>
        </div>
    )
}