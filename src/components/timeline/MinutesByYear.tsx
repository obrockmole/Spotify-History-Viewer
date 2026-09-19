"use client";

import React, {useLayoutEffect} from "react";
import * as am5 from "@amcharts/amcharts5";
import {
    AxisRendererX,
    AxisRendererY,
    DateAxis,
    LineSeries,
    ValueAxis,
    XYChart,
    XYCursor
} from "@amcharts/amcharts5/xy";
import {YearlyMinutesData} from "@/context/HistoryContext";

interface MinutesByYearProps {
    data?: YearlyMinutesData[];
}

const MinutesByYear: React.FC<MinutesByYearProps> = ({data}) => {
    useLayoutEffect(() => {
        if (!data || data.length === 0) return;

        const root = am5.Root.new("MinutesByYearDiv");
        const chart = root.container.children.push(
            XYChart.new(root, {
                panX: true,
                panY: false,
                wheelX: "panX",
                wheelY: "zoomX",
                paddingLeft: 0
            })
        );

        const cursor = chart.set("cursor", XYCursor.new(root, {
            behavior: "none"
        }));
        cursor.lineY.set("visible", false);

        const xAxis = chart.xAxes.push(
            DateAxis.new(root, {
                baseInterval: { timeUnit: "day", count: 1 },
                renderer: AxisRendererX.new(root, {}),
                tooltipDateFormat: "MMM dd"
            })
        );

        xAxis.get("renderer").labels.template.setAll({
            fill: am5.color(0xFFFFFF)
        });

        const yAxis = chart.yAxes.push(
            ValueAxis.new(root, {
                renderer: AxisRendererY.new(root, {})
            })
        );

        yAxis.get("renderer").labels.template.setAll({
            fill: am5.color(0xFFFFFF)
        });

        data.forEach((yearSeries) => {
            const series = chart.series.push(
                LineSeries.new(root, {
                    name: yearSeries.year,
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueYField: "value",
                    valueXField: "date",
                    tooltip: am5.Tooltip.new(root, {
                        labelText: "{name}: {valueY.formatNumber('#,###.0')} mins"
                    })
                })
            );
            series.strokes.template.setAll({ strokeWidth: 2 });
            series.data.setAll(yearSeries.data);
        });

        const legend = chart.children.push(am5.Legend.new(root, {
            centerX: am5.p50,
            x: am5.p50,
            marginTop: 15
        }));
        legend.labels.template.setAll({ fill: am5.color(0xFFFFFF) });
        legend.data.setAll(chart.series.values);

        return () => {
            root.dispose();
        };
    }, [data]);

    return (
        <div id="MinutesByYearDiv" style={{width: "100%", minHeight: 450, marginLeft: 5, marginBottom: 8}}></div>
    );
};

export default MinutesByYear;