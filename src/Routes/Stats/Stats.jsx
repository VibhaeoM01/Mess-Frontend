// import "./stats.scss";

// // function Stats() {
// //   return (
// //     <div className="stats">
// //       Stats
// //     </div>
// //   );
// // }

// // export default Stats;

// import React, { useEffect, useState } from "react";
// import { Line } from "react-chartjs-2";
// import axios from "axios";
// import {
//   Chart as ChartJS,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Legend,
//   Tooltip,
// } from "chart.js";

// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

// function Stats() {
//   const [chartData, setChartData] = useState(null);

//   useEffect(() => {
//     axios.get("http://localhost:5000/api/feedbacks/sentiment-trends").then((res) => {
//       const data = res.data.data;
//       const labels = data.map((d) => d._id);
//       const sentiments = { positive: [], neutral: [], negative: [] };
//       data.forEach((d) => {
//         const counts = { positive: 0, neutral: 0, negative: 0 };
//         d.sentiments.forEach((s) => {
//           counts[s.sentiment] = s.count;
//         });
//         sentiments.positive.push(counts.positive);
//         sentiments.neutral.push(counts.neutral);
//         sentiments.negative.push(counts.negative);
//       });
//       setChartData({
//         labels,
//         datasets: [
//           {
//             label: "Positive",
//             data: sentiments.positive,
//             borderColor: "#16a34a",
//             backgroundColor: "#16a34a33",
//             fill: false,
//           },
//           {
//             label: "Neutral",
//             data: sentiments.neutral,
//             borderColor: "#fbbf24",
//             backgroundColor: "#fbbf2433",
//             fill: false,
//           },
//           {
//             label: "Negative",
//             data: sentiments.negative,
//             borderColor: "#dc2626",
//             backgroundColor: "#dc262633",
//             fill: false,
//           },
//         ],
//       });
//     });
//   }, []);

//   if (!chartData) return <div>Loading...</div>;

//   return (
//     <div>
//       <h2>Sentiment Trends Over Time</h2>
//       <Line data={chartData} />
//     </div>
//   );
// }

// export default Stats;

import React from "react";
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
import apiRequest from "../../lib/apiRequest";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

const data = {
  labels: ["Week 1", "Week 2", "Week 3 (after MessMaster)", "Week 4", "Week 5"],
  datasets: [
    {
      label: "Total Wastage (kg)",
      data: [244, 250.7, 235.3, 91, 89.8],
      borderColor: "#2563eb",
      backgroundColor: "#93c5fd",
      tension: 0.4,
      fill: false,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: { display: true },
    tooltip: { enabled: true },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: { display: true, text: "Wastage (kg)" },
    },
    x: {
      title: { display: true, text: "Week" },
    },
  },
};

function SentimentTrendsChart() {
  const [chartData, setChartData] = React.useState(null);

  React.useEffect(() => {
    const fetchTrends = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await apiRequest.get(
          " feedbacks/sentiment-trends",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
      } catch (err) {
        setChartData(null);
      }
    };
    fetchTrends();
  }, []);

  if (!chartData) return <div>Loading sentiment trends...</div>;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto 0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Sentiment Trends Over Time</h2>
      <Line data={chartData} />
      <div style={{ marginTop: "2rem", background: "#f9fafb", padding: "1rem", borderRadius: "8px" }}>
        <h3>About Sentiment Analysis</h3>
        <p>
          This chart visualizes the trends of positive, neutral, and negative feedback received from students over time. Each comment submitted by students is analyzed using sentiment analysis to determine its overall tone. This helps us understand student satisfaction and the impact of improvements made in the mess.
        </p>
      </div>
    </div>
  );
}

function WastageLineChart() {
  return (
    <div style={{ maxWidth: 600, margin: "auto", marginTop: "80px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Mess Wastage Reduction Over Weeks</h2>
      <Line data={data} options={options} />
      <SentimentTrendsChart />
    </div>
  );
}

export default WastageLineChart;