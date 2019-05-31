import { useState } from "react";
const FONTS =
  'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";';

const chartOptions = {
  chart: {
    zoomType: "x",
    type: "areaspline",
    animation: { duration: 150 },
    panKey: "meta",
    panning: true,
    resetZoomButton: {
      position: {
        y: 20
      }
    }
  },
  plotOptions: {
    areaspline: {},
    series: {
      fillOpacity: 0.5,
      animation: false,
      lineWidth: 0.4,
      marker: {
        enabled: false,
        symbol: "circle"
      },
      states: {
        hover: {
          halo: false,
          lineWidthPlus: 0
        }
      }
    }
  },
  navigation: {
    buttonOptions: {
      theme: {
        "stroke-width": 0,
        opacity: 0.35,
        states: {
          hover: {
            fill: null,
            opacity: 0.9
          },
          select: {
            fill: "#EEEEEE",
            opacity: 0.9
          }
        }
      }
    },
    menuItemStyle: {
      color: "#333",
      fontFamily: FONTS,
      fontSize: "0.7rem"
    }
  },
  credits: false,
  legend: {
    verticalAlign: "top",
    align: "right",
    x: -40,
    y: -1,
    itemStyle: {
      fontWeight: 600,
      fontSize: "11px",
      fontFamily: FONTS
    }
  },
  tooltip: {
    useHTML: true,
    backgroundColor: "#FFFFFFCC",
    borderColor: "#999",
    crosshairs: true,
    shared: true,
    valueDecimals: 3,
    positioner(labelWidth, labelHeight, point) {
      const chartwidth = this.chart.chartWidth;
      const y = Math.min(
        Math.max(point.plotY, 60),
        this.chart.chartHeight - labelHeight - 40
      );
      if (40 + point.plotX + labelWidth < chartwidth) {
        return {
          x: point.plotX + 35,
          y
        };
      }
      return {
        x: point.plotX - labelWidth - 20,
        y
      };
    },
    shadow: false,
    style: {
      color: "#333",
      fontFamily: FONTS,
      fontSize: "0.8rem"
    }
  },
  series: [],
  title: false,
  xAxis: {
    tickLength: 0,
    labels: {
      y: 15
    },
    min: null,
    max: null,
    crosshair: true
  },
  yAxis: {
    gridLineWidth: 0
    // title: false
    // reversed: true,
  },
  exporting: {
    sourceWidth: 1200,
    scale: 1,
    csv: {},
    chartOptions: {
      chart: {
        height: this && this.chartHeight
      },
      title: false
    },
    buttons: {
      contextButton: {
        menuItems: [
          "downloadPNG",
          "downloadPDF",
          "downloadSVG",
          "separator",
          "downloadCSV",
          "printChart",
          "separator",
          "reset"
          // "openInCloud"
          // "viewData"
        ]
      }
    }
  }
};

const useChartOptions = initial => {
  const [state, setState] = useState(initial || chartOptions);

  const setChartOptions = val => {
    setState({ ...state, ...val });
  };

  return [state, setChartOptions];
};
export { chartOptions, useChartOptions };
