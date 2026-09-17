"use client";

import React, {useLayoutEffect, useRef} from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map"
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow"
import { Listen } from "@/types";

interface ListensByCountryProps {
  history?: Listen[];
  data?: { id: string; value: number }[];
}

const ListensByCountry: React.FC<ListensByCountryProps> = ({ history, data }) => {
  const rootRef = useRef<am5.Root | null>(null)
  const seriesRef = useRef<am5map.MapPolygonSeries | null>(null)

  useLayoutEffect(() => {
    const root = am5.Root.new("ListensByCountryDiv")

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "none",
        panY: "none",
        projection: am5map.geoMercator(),
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingTop: 0
      })
    )

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        valueField: "value",
        calculateAggregates: true,
        exclude: ["AQ"]
      })
    )

    polygonSeries.set("heatRules", [{
      target: polygonSeries.mapPolygons.template,
      dataField: "value",
      min: am5.color(0x236744),
      max: am5.color(0x00FF8C),
      key: "fill"
    }])

    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color(0x00CC70)
    })

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}: {value} listens",
      fill: am5.color(0x333333),
      stroke: am5.color(0x111111),
    });

    rootRef.current = root
    seriesRef.current = polygonSeries

    return () => {
      root.dispose()
    }
  }, [])

  useLayoutEffect(() => {
    if (!seriesRef.current) {
      return;
    }

    let chartData;
    if (data && data.length > 0) {
        chartData = data;
    } else {
        chartData = (history || []).reduce<{ id: string; value: number }[]>((result, item) => {
          const country = item.conn_country?.toUpperCase().trim();
          if (!country) {
            return result;
          }

          const index = result.findIndex((entry) => entry.id === country);
          if (index >= 0) {
            result[index].value += 1;
          } else {
            result.push({ id: country, value: 1 });
          }

          return result;
        }, []);
      }

    if (chartData.length === 0) {
      return;
    }

    seriesRef.current.data.setAll(chartData);
  }, [data, history]);

  return (
    <div id="ListensByCountryDiv" style={{ width: "100%", minHeight: 300, marginLeft: 8, marginBottom: 8 }}></div>
  );
};

export default ListensByCountry;