import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  LabelList,
} from "recharts";
import { uniqueColors } from "@/tools/theme";

interface StateProps {
  stateData: any[];
}

const getShuffledColors = (colors: string[]) => {
  return [...colors].sort(() => Math.random() - 0.5);
};

const State: React.FC<StateProps> = ({ stateData }) => {
  const data = Array.isArray(stateData)
    ? [...stateData].sort((a, b) => b.quantity - a.quantity)
    : [];

  if (!data.length) return <div>No hay datos</div>;

  const colors = useMemo(() => {
    const shuffled = getShuffledColors(uniqueColors);

    return data.map((_, index) => 
      shuffled[index % shuffled.length]
    );
  }, [data]);

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="2 2" vertical={false} />

          <XAxis dataKey="name" />
          <YAxis />

          <Tooltip />

          <Bar dataKey="quantity" radius={[10, 10, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={index} fill={colors[index]} />
            ))}

            <LabelList dataKey="quantity" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default State;