"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DashboardContentProps {
  data: Array<{
    date: string;
    revenue: number;
    cost: number;
    profit: number;
  }>;
}

const DashboardContent = ({ data }: DashboardContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly sales for 1 mount</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer>
            <BarChart data={data}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />

              <Legend />
              <Tooltip />

              <Bar
                dataKey="revenue"
                fill="#4F46E5"
                name="รายรับ (revenue)"
                barSize={50}
              />

              <Bar
                dataKey="cost"
                fill="#e53e3e"
                name="ต้นทุน (cost)"
                barSize={50}
              />

              <Bar
                dataKey="profit"
                fill="#22c55e"
                name="กำไร (profit)"
                barSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
export default DashboardContent;
