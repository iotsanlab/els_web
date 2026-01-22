
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Pt", thisWeek: 40, lastWeek: 70 },
  { day: "Sa", thisWeek: 30, lastWeek: 60 },
  { day: "Ça", thisWeek: 50, lastWeek: 80 },
  { day: "Pe", thisWeek: 70, lastWeek: 90 },
  { day: "Cu", thisWeek: 60, lastWeek: 85 },
  { day: "Ct", thisWeek: 90, lastWeek: 100 },
  { day: "Pa", thisWeek: 50, lastWeek: 75 },
];

const FuelChart = () => {
  return (
    <div style={{ width: 700, height: 420, backgroundColor: "#FFF", borderRadius: 10 }}>

      <ResponsiveContainer>
        <AreaChart
          data={data}
          //margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="thisWeek"
            stroke="#4CAF50"
                  fill="#5EB044"
            fillOpacity={0.3}
          />
          <Area
            type="monotone"
            dataKey="lastWeek"
            stroke="#FF5252"
            fill="#E84747A1"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
      <p style={{ textAlign: "center", marginTop: 10 }}>
        <strong>%10</strong> Yakıt tüketiminiz geçen haftaya kıyasla %10 daha ekonomik.
      </p>
    </div>
  );
};

export default FuelChart;
