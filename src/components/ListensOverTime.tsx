"use client";

import React, {useLayoutEffect, useRef} from "react";
import * as am5 from "@amcharts/amcharts5";
import { Listen } from "@/types";
import {
  AxisRendererX,
  AxisRendererY,
  ColumnSeries,
  DateAxis,
  ValueAxis,
  XYChart, XYCursor
} from "@amcharts/amcharts5/xy";
import {Color} from "@amcharts/amcharts5";

interface ListensOverTimeProps {
  history: Listen[];
}

interface AggregatedData {
  date: number;
  value: number;
}

const ListensOverTime: React.FC<ListensOverTimeProps> = ({ history }) => {
  const rootRef = useRef<am5.Root | null>(null);
  const seriesRef = useRef<ColumnSeries | null>(null);

  useLayoutEffect(() => {
    const root = am5.Root.new("ListensOverTimeDiv");

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
      DateAxis.new(root, {
        baseInterval: {
          timeUnit: "month",
          count: 1
        },
        renderer: AxisRendererX.new(root, {})
      })
    );
    xAxis.get("renderer").labels.template.setAll({
      fill: am5.color(0xFFFFFF)
    });
    xAxis.get("renderer").grid.template.setAll({
      stroke: am5.color(0xFFFFFF),
      strokeOpacity: 0.15
    });

    const yAxis = chart.yAxes.push(
      ValueAxis.new(root, {
        renderer: AxisRendererY.new(root, {})
      })
    );
    yAxis.get("renderer").labels.template.setAll({
      fill: am5.color(0xFFFFFF)
    });
    yAxis.get("renderer").grid.template.setAll({
      stroke: am5.color(0xFFFFFF),
      strokeOpacity: 0.15
    });

    const series = ColumnSeries.new(root, {
      name: "Series",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      valueXField: "date",
      fill: Color.fromHex(0x00FF8C),
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueX.formatDate('MMMM yyyy')}: {valueY} listens"
      })
    });

    series.columns.template.setAll({
      cornerRadiusTL: 3,
      cornerRadiusTR: 3,
      strokeOpacity: 0,
    });

    chart.series.push(series);

    rootRef.current = root;
    seriesRef.current = series;

    return () => {
      root.dispose();
    };
  }, []);

  useLayoutEffect(() => {
    if (!seriesRef.current || history.length === 0) {
      return;
    }

    const data = history.map(item => ({
      date: new Date(item.ts).getTime(),
      value: 1
    }));

    const aggregatedData: AggregatedData[] = [];
    const dataMap: { [key: number]: number } = {};

    data.forEach(item => {
      const date = new Date(item.date);
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      const monthTimestamp = date.getTime();

      if (dataMap[monthTimestamp]) {
        dataMap[monthTimestamp]++;
      } else {
        dataMap[monthTimestamp] = 1;
      }
    });

    Object.keys(dataMap).forEach(month => {
      aggregatedData.push({
        date: parseInt(month),
        value: dataMap[parseInt(month)]
      });
    });

    aggregatedData.sort((a, b) => a.date - b.date);

    seriesRef.current.data.setAll(aggregatedData);
  }, [history]);

  return (
    <div id="ListensOverTimeDiv" style={{ minHeight: 450, marginLeft: 5, marginBottom: 8 }}></div>
  );
};

export default ListensOverTime;