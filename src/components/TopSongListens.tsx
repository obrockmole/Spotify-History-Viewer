"use client";

import React, {useLayoutEffect, useRef} from "react";
import * as am5 from "@amcharts/amcharts5";
import { Listen } from "@/types";
import {
  AxisRenderer,
  AxisRendererX,
  AxisRendererY,
  CategoryAxis,
  ColumnSeries,
  ValueAxis,
  XYChart,
  XYCursor
} from "@amcharts/amcharts5/xy";
import {Color} from "@amcharts/amcharts5";

interface TopSongListensProps {
  history?: Listen[];
  data?: { song: string; value: number }[];
}

const TopSongListens: React.FC<TopSongListensProps> = ({ history, data }) => {
  const rootRef = useRef<am5.Root | null>(null);
  const seriesRef = useRef<ColumnSeries | null>(null);
  const yAxisRef = useRef<CategoryAxis<AxisRenderer> | null>(null)
  const xAxisRef = useRef<ValueAxis<AxisRenderer> | null>(null)

  useLayoutEffect(() => {
    const root = am5.Root.new("TopSongListensDiv");

    const chart = root.container.children.push(
      XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0
      })
    );

    const cursor = chart.set("cursor", XYCursor.new(root, {}));
    cursor.lineX.set("visible", false);
    cursor.lineY.set("visible", false);

    const xAxis = chart.xAxes.push(
      ValueAxis.new(root, {
        min: 0,
        strictMinMax: true,
        renderer: AxisRendererX.new(root, {
          visible: false
        })
      })
    )
    xAxis.get("renderer").grid.template.set("forceHidden", true)
    xAxis.get("renderer").labels.template.set("forceHidden", true)

    const yAxis = chart.yAxes.push(
      CategoryAxis.new(root, {
        categoryField: "song",
        renderer: AxisRendererY.new(root, {
          inversed: true,
          visible: false
        })
      })
    )
    yAxis.get("renderer").grid.template.set("forceHidden", true)
    yAxis.get("renderer").labels.template.set("forceHidden", true)

    const series = ColumnSeries.new(root, {
      name: "Series",
      xAxis: xAxis,
      yAxis: yAxis,
      valueXField: "value",
      categoryYField: "song",
      fill: Color.fromHex(0x0ADB6C),
      tooltip: am5.Tooltip.new(root, {
        labelText: "{categoryY}: {valueX} listens"
      })
    })

    series.columns.template.setAll({
      cornerRadiusBR: 3,
      cornerRadiusTR: 3,
      strokeOpacity: 0,
      height: am5.percent(70)
    })

    series.bullets.push(() => {
      return am5.Bullet.new(root, {
        locationX: 0,
        sprite: am5.Label.new(root, {
          text: "{categoryY}",
          fill: am5.color(0x000000),
          centerY: am5.p50,
          centerX: am5.p0,
          dx: 10,
          populateText: true,
          fontWeight: "bold"
        })
      })
    })

    series.bullets.push(() => {
      return am5.Bullet.new(root, {
        locationX: 1,
        sprite: am5.Label.new(root, {
          text: "{valueX}",
          fill: am5.color(0x000000),
          centerY: am5.p50,
          centerX: am5.p100,
          dx: -10,
          populateText: true,
          fontWeight: "bold"
        })
      })
    })

    chart.series.push(series)

    rootRef.current = root
    seriesRef.current = series
    xAxisRef.current = xAxis
    yAxisRef.current = yAxis

    return () => {
      root.dispose()
    }
  }, [])

  useLayoutEffect(() => {
    if (!seriesRef.current || !yAxisRef.current) {
      return;
    }

    let chartData;
    if (data && data.length > 0) {
      chartData = data;
    } else {
      chartData = (history || []).reduce<{ song: string; value: number }[]>((result, item) => {
        const song = (item.master_metadata_track_name || "Unknown").trim();

        const index = result.findIndex((entry) => entry.song === song);
        if (index >= 0) {
          result[index].value += 1;
        } else {
          result.push({song, value: 1});
        }

        return result;
      }, []).sort((a, b) => b.value - a.value).slice(0, 10);
    }

    if (chartData.length === 0) {
      return;
    }

    yAxisRef.current.data.setAll(chartData);
    seriesRef.current.data.setAll(chartData);
  }, [data, history]);

  return (
    <div id="TopSongListensDiv" style={{ width: "100%", minHeight: 300, marginLeft: 8, marginBottom: 8 }}></div>
  );
};

export default TopSongListens;