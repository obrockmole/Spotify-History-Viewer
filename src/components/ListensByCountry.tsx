"use client";

import React, {useLayoutEffect, useRef} from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map"
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow"
import { Listen } from "@/types";
import {useHistory} from "@/context/HistoryContext";

interface ListensByCountryProps {
  history: Listen[];
}

const ListensByCountry: React.FC<ListensByCountryProps> = ({ history }) => {
  const rootRef = useRef<am5.Root | null>(null)
  const seriesRef = useRef<am5map.MapPolygonSeries | null>(null)
  const { countryData } = useHistory()

  useLayoutEffect(() => {
    const root = am5.Root.new("ListensByCountryDiv")

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "translateX",
        panY: "translateY",
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
    if (!seriesRef.current || history.length === 0) {
      return;
    }

    if (countryData && countryData.length > 0) {
      seriesRef.current.data.setAll(countryData);
      return;
    }

    const dataMap: { [key: string]: number } = {};

    history.forEach(item => {
      let country = item.conn_country

      if (country) {
        country = country.toUpperCase().trim()
        dataMap[country] = (dataMap[country] || 0) + 1
      }
    })

    const aggregatedData = Object.keys(dataMap).map(country => ({
      id: country,
      value: dataMap[country]
    }));

    seriesRef.current.data.setAll(aggregatedData);
  }, [history, countryData]);

  return (
    <div id="ListensByCountryDiv" style={{ width: "100%", minHeight: 300, marginLeft: 8, marginBottom: 8 }}></div>
  );
};

export default ListensByCountry;