import React from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

interface Props {
  data: any[];
}

const TypeChart: React.FC<Props> = ({ data }) => {
  const single = data?.filter((c) => c.stateId.length === 1).length;
  const multi = data?.filter((c) => c.stateId.length > 1).length;

  const chartData = [
    { name: "Un estado", value: single, color: "#1B4F8A" },
    { name: "Multi-estado", value: multi, color: "#F07040" },
  ];

  return (
    <ResponsiveContainer width="100%" >
      <PieChart>
        <Pie
          data={chartData}
    
          innerRadius={40}
          outerRadius={60}
          dataKey="value"
          label={({ value }) => `${value}`}
          labelLine={false}
        >
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Legend
          iconType="square"
          iconSize={10}
          formatter={(v) => <span style={{ fontSize: 11 }}>{v}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TypeChart;
