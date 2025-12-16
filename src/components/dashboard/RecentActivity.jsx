import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  UserPlus,
  CheckCircle,
  CreditCard,
  AlertTriangle,
  Package,
} from 'lucide-react';
import { recentActivities } from '../../data/dummyData';

const iconMap = {
  UserPlus,
  CheckCircle,
  CreditCard,
  AlertTriangle,
  Package,
};

const typeColors = {
  user: 'bg-blue-500/10 text-blue-500',
  job: 'bg-green-500/10 text-green-500',
  payment: 'bg-emerald-500/10 text-emerald-500',
  alert: 'bg-amber-500/10 text-amber-500',
};

const RecentActivity = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => {
            const Icon = iconMap[activity.icon];
            const colorClass = typeColors[activity.type] || 'bg-gray-500/10 text-gray-500';

            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {activity.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
