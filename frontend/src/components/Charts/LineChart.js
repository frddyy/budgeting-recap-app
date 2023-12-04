import React from "react";
import ReactApexChart from "react-apexcharts";
import { lineChartOptions } from "variables/charts";

const LineChart = ({ data }) => {
  // Dapatkan data dari prop
  const chartData = data || [];

  // Set options dari lineChartOptions
  const chartOptions = lineChartOptions;

  return (
    <ReactApexChart
      options={chartOptions}
      series={chartData}
      type="area"
      width="100%"
      height="100%"
    />
  );
};

export default LineChart;
