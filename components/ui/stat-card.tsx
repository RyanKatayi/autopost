
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FC, ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
}

export const StatCard: FC<StatCardProps> = ({ title, value, icon, description }) => (
  <Card className="hover:shadow-md transition-shadow duration-200">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-4 px-4">
      <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      <div className="p-1.5 bg-green-100 rounded-lg shrink-0">
        <div className="text-green-600 w-4 h-4">{icon}</div>
      </div>
    </CardHeader>
    <CardContent className="px-4 pb-4">
      <div className="text-2xl font-bold text-green-600 mb-1">{value}</div>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </CardContent>
  </Card>
);
