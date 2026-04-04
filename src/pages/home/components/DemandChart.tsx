import React from "react";
import {  Tag } from "antd";
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

const DemandChart: React.FC<Props> = ({ data }) => {
  const chartData = data?.map((c) => ({
    name: c.name.replace("CLAIMANT ", "C"),
    quantity: c.quantity,
    multi: c.stateId.length > 1,
  }));

  return (
    <>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} barSize={18}>
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v: any) => [`${v} TON`, "Demanda"]} />
          <Bar dataKey="quantity" radius={[4, 4, 0, 0]}>
            {chartData?.map((entry, i) => (
              <Cell key={i} fill={entry.multi ? "#F07040" : "#1B4F8A"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
        <Tag color="#1B4F8A" style={{ fontSize: 11 }}>
          ■ Un estado
        </Tag>
        <Tag color="#F07040" style={{ fontSize: 11 }}>
          ■ Multi-estado
        </Tag>
      </div>
    </>
  );
};

export default DemandChart;
