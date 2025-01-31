"use client";

import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
  type TooltipModel,
  type ChartTypeRegistry,
  BubbleDataPoint,
  Point,
} from "chart.js";
import { useTheme } from "next-themes";
import { Line } from "react-chartjs-2";

ChartJs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

function getOrCreateTooltip(
  chart: ChartJs<
    keyof ChartTypeRegistry,
    (number | [number, number] | Point | BubbleDataPoint | null)[],
    unknown
  >,
) {
  if (!chart.canvas.parentNode) {
    return;
  }
  let tooltipEl = chart.canvas.parentNode.querySelector("div");

  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.classList.add(
      ...[
        "bg-transparent",
        "border",
        "shadow-md",
        "rounded-md",
        "!p-0",
        "dark:border-darkText",
        "transition",
      ],
    );

    tooltipEl.style.opacity = "1";
    tooltipEl.style.pointerEvents = "none";
    tooltipEl.style.position = "absolute";
    tooltipEl.style.transform = "translate(-50%, 0)";

    const container = document.createElement("div");
    container.classList.add(
      ...[
        "container",
        "flex",
        "flex-col",
        "rounded-md",
        "justify-center",
        "text-xs",
        "text-lightText",
        "dark:text-darkText",
        "dark:bg-dark",
        "bg-white",
        "lg:text-sm",
      ],
    );

    tooltipEl.appendChild(container);
    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  return tooltipEl;
}

const externalToolTipHandler = (context: {
  chart: ChartJs;
  tooltip: TooltipModel<keyof ChartTypeRegistry>;
}) => {
  const { chart, tooltip } = context;
  const tooltipEl = getOrCreateTooltip(chart);
  if (!tooltipEl) {
    return;
  }
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = "0";
    return;
  }

  // Set Text
  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map((b) => b.lines);

    const tableHead = document.createElement("h3");
    tableHead.classList.add(...["px-2", "border-b-lightText/30", "border-b"]);
    titleLines.forEach((title) => {
      tableHead.innerText = title;
    });
    const tableBody = document.createElement("div");
    tableBody.classList.add(
      ...["flex", "gap-4", "p-2", "justify-between", "items-center"],
    );

    const colors = tooltip.labelColors[0];
    const divContainer = document.createElement("div");
    divContainer.classList.add(
      ...["flex", "justify-center", "items-center", "gap-2"],
    );
    const span = document.createElement("span");
    span.style.backgroundColor = colors.backgroundColor as string;
    span.classList.add(...["size-2", "rounded-full"]);

    const [identifier, data] = bodyLines[0][0].split(":");
    const title = document.createTextNode(`${identifier}:`);
    divContainer.appendChild(span);
    divContainer.appendChild(title);
    const text = document.createElement("p");
    text.innerText = data;
    text.classList.add(...["m-0", "p-0", "text-black", "dark:text-white"]);
    tableBody.appendChild(divContainer);
    tableBody.appendChild(text);

    const tableRoot = tooltipEl.querySelector(".container");

    if (!tableRoot) {
      return;
    }
    // Remove old children
    while (tableRoot.firstChild) {
      tableRoot.firstChild.remove();
    }

    // Add new children
    tableRoot.appendChild(tableHead);
    tableRoot.appendChild(tableBody);
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

  // Display, position, and set styles for font
  tooltipEl.style.opacity = "1";
  tooltipEl.style.left = positionX + tooltip.caretX + "px";
  tooltipEl.style.top = positionY + tooltip.caretY + "px";

  tooltipEl.style.padding =
    tooltip.options.padding + "px " + tooltip.options.padding + "px";
};

function createDataConfiguration(
  dataX: number[],
  dataY: number[],
  label: string,
) {
  const dataConfiguration = {
    labels: dataX,

    datasets: [
      {
        label: label,
        data: dataY,
        borderColor: "#746DE8",
        backgroundColor: "#746DE8",
      },
    ],
  } satisfies ChartData;
  return dataConfiguration;
}

function createChartConfig(theme: string | undefined) {
  const chartConfig = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "linear",

        grid: {
          color: "transparent",
        },
        ticks: {
          color: "#9BA0A9",
        },
        border: {
          color: `${theme === "dark" ? "#323232" : "#F2F3F5"}`,
        },
      },
      y: {
        grid: {
          color: `${theme === "dark" ? "#323232" : "#F2F3F5"}`,
        },
        ticks: {
          color: "#9BA0A9",
        },
        border: {
          color: `${theme === "dark" ? "#323232" : "#F2F3F5"}`,
        },
      },
    },

    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
        position: "nearest",
        external: externalToolTipHandler,
      },
    },
  } satisfies ChartOptions;

  return chartConfig;
}
export default function GraphComponent(props: {
  dataX: number[];
  dataY: number[];
  label: string;
}) {
  const { resolvedTheme } = useTheme();

  const chartData = createDataConfiguration(
    props.dataX,
    props.dataY,
    props.label,
  );

  const options = createChartConfig(resolvedTheme);
  return <Line options={options} data={chartData} className=" !w-full" />;
}
