import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement } from "chart.js";

const PieChart = ({ total, value, width = 50, height = 50 }) => {
  ChartJS.register(ArcElement);

  const style = {
    width: width,
    height: height,
  };
  const data = {
    datasets: [
      {
        data: [total - value, value],
        backgroundColor: ["rgba(255, 99, 132)", "rgba(75, 192, 192)"],
        borderWidth: 0,
      },
    ],
  };
  return (
    <div style={style}>
      <Pie data={data} />
    </div>
  );
};

export default PieChart;
