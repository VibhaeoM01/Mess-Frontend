import "./stats.scss";

// function Stats() {
//   return (
//     <div className="stats">
//       Stats
//     </div>
//   );
// }

// export default Stats;

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

function Stats() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/feedbacks/sentiment-trends").then((res) => {
      const data = res.data.data;
      const labels = data.map((d) => d._id);
      const sentiments = { positive: [], neutral: [], negative: [] };
      data.forEach((d) => {
        const counts = { positive: 0, neutral: 0, negative: 0 };
        d.sentiments.forEach((s) => {
          counts[s.sentiment] = s.count;
        });
        sentiments.positive.push(counts.positive);
        sentiments.neutral.push(counts.neutral);
        sentiments.negative.push(counts.negative);
      });
      setChartData({
        labels,
        datasets: [
          {
            label: "Positive",
            data: sentiments.positive,
            borderColor: "#16a34a",
            backgroundColor: "#16a34a33",
            fill: false,
          },
          {
            label: "Neutral",
            data: sentiments.neutral,
            borderColor: "#fbbf24",
            backgroundColor: "#fbbf2433",
            fill: false,
          },
          {
            label: "Negative",
            data: sentiments.negative,
            borderColor: "#dc2626",
            backgroundColor: "#dc262633",
            fill: false,
          },
        ],
      });
    });
  }, []);

  if (!chartData) return <div>Loading...</div>;

  return (
    <div>
      <h2>Sentiment Trends Over Time</h2>
      <Line data={chartData} />
    </div>
  );
}

export default Stats;