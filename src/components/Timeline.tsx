"use client";

import React, {useCallback, useLayoutEffect, useRef} from "react";
import * as am5 from "@amcharts/amcharts5";
import { Listen } from "@/types";
import {
  AxisRenderer,
  AxisRendererX,
  AxisRendererY,
  DateAxis,
  StepLineSeries,
  ValueAxis,
  XYChart,
  XYChartScrollbar
} from "@amcharts/amcharts5/xy";

interface TimelineProps {
  history: Listen[];
  onRangeChange: (start: number, end: number) => void;
}

interface AggregatedData {
  date: number;
  value: number;
}

const Timeline: React.FC<TimelineProps> = ({ history, onRangeChange }) => {
  const chartRef = useRef<am5.Root | null>(null);
  const xAxisRef = useRef<DateAxis<AxisRenderer> | null>(null);

  const dateAxisChanged = useCallback((ev: { start: number; end: number }) => {
    if (xAxisRef.current) {
      let start = xAxisRef.current.positionToDate(ev.start).getTime();
      let end = xAxisRef.current.positionToDate(ev.end).getTime();

      if (start > end) {
        [start, end] = [end, start];
      }
      if (!isNaN(start) && !isNaN(end)) {
        onRangeChange(start, end);
      }
    }
  }, [onRangeChange]);

  useLayoutEffect(() => {
    if (history.length === 0) {
      return;
    }

    const root = am5.Root.new("TimelineDiv");

    const chart = root.container.children.push(XYChart.new(root, {
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
    }));

    chart.plotContainer.set("visible", false);
    chart.rightAxesContainer.set("visible", false);
    chart.leftAxesContainer.set("visible", false);
    chart.bottomAxesContainer.set("visible", false);

    const scrollbar = XYChartScrollbar.new(root, {
      orientation: "horizontal",
      height: 50,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
    });

    scrollbar.get("background")!.setAll({
      fillOpacity: 0
    });

    scrollbar.overlay.setAll({
        fill: am5.color(0x111111),
        fillOpacity: 0.6
    });

    chart.set("scrollbarX", scrollbar);

    const xAxis = scrollbar.chart.xAxes.push(DateAxis.new(root, {
      baseInterval: {
        timeUnit: "day",
        count: 1
      },
      renderer: AxisRendererX.new(root, {})
    }));
    xAxisRef.current = xAxis;

    xAxis.get("renderer").labels.template.setAll({
        fill: am5.color(0xFFFFFF)
    });

    const yAxis = scrollbar.chart.yAxes.push(ValueAxis.new(root, {
        renderer: AxisRendererY.new(root, {})
    }));

    const series = scrollbar.chart.series.push(StepLineSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "date",
        valueYField: "value"
    }));

    series.strokes.template.setAll({
      strokeWidth: 1,
      strokeOpacity: 0.5,
    });

    series.fills.template.setAll({
      fillOpacity: 0.1,
      visible: true,
    });

    const data = history.map(item => ({
      date: new Date(item.ts).getTime(),
      value: 1
    }));

    const aggregatedData: AggregatedData[] = [];
    const dataMap: { [key: number]: number } = {};

    data.forEach(item => {
      const date = new Date(item.date);
      date.setHours(0, 0, 0, 0);
      const day = date.getTime();

      if (dataMap[day]) {
        dataMap[day]++;
      } else {
        dataMap[day] = 1;
      }
    });

    Object.keys(dataMap).forEach(day => {
      aggregatedData.push({
        date: parseInt(day),
        value: dataMap[parseInt(day)]
      });
    });

    aggregatedData.sort((a, b) => a.date - b.date);
    series.data.setAll(aggregatedData);

    scrollbar.events.on("rangechanged", dateAxisChanged);

    chartRef.current = root;

    return () => {
      root.dispose();
    };
  }, [history, onRangeChange, dateAxisChanged]);

  return (
    <div id="TimelineDiv" style={{ height: "50px" }}></div>
  );
};

export default Timeline;
