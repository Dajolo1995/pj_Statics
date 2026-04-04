import React from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Props {
  data: any[];
}

const STATE_COLORS: Record<number, string> = {
  1: "#1B4F8A",
  2: "#0E8C7A",
  3: "#3D4B57",
  4: "#F07040",
};

const STATE_NAMES: Record<number, string> = {
  1: "Fundación",
  2: "Aracataca",
  3: "Plato",
  4: "Sitionuevo",
};

const PressureChart: React.FC<Props> = ({ data }) => {
  const pressureMap: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  data?.forEach((c) => {
    c.stateId.forEach((sid: number) => {
      pressureMap[sid] += c.quantity;
    });
  });

  const chartData = Object.entries(pressureMap).map(([id, total]) => ({
    name: STATE_NAMES[Number(id)],
    demanda: total,
    color: STATE_COLORS[Number(id)],
  }));

  return (
    <ResponsiveContainer width="100%" >
      <BarChart data={chartData} barSize={28}>
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip formatter={(v: any) => [`${v} TON`, "Demanda total"]} />
        <Bar dataKey="demanda" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PressureChart;
