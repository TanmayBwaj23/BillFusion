import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function VendorPerformanceOverview({ vendors }) {
  const totalVendors = vendors.length;
  const activeVendors = vendors.filter(v => v.contractStatus === 'Active').length;
  const avgPerformance = vendors.reduce((sum, v) => sum + v.performance, 0) / vendors.length;
  const totalSpend = vendors.reduce((sum, v) => sum + v.monthlySpend, 0);
  const totalEmployees = vendors.reduce((sum, v) => sum + v.employeeCount, 0);

  const performanceByTier = {
    excellent: vendors.filter(v => v.performance >= 90).length,
    good: vendors.filter(v => v.performance >= 80 && v.performance < 90).length,
    needsImprovement: vendors.filter(v => v.performance < 80).length
  };

  const getPerformanceTrend = (current, previous = 88) => {
    const diff = current - previous;
    if (diff > 2) return { icon: TrendingUp, color: 'text-green-600', text: '+2.3%' };
    if (diff < -2) return { icon: TrendingDown, color: 'text-red-600', text: '-1.8%' };
    return { icon: Minus, color: 'text-gray-600', text: '0%' };
  };

  const trend = getPerformanceTrend(avgPerformance);
  const TrendIcon = trend.icon;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Vendors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalVendors}</div>
          <p className="text-xs text-gray-500 mt-1">
            {activeVendors} active contracts
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Average Performance
          </CardTitle>
          <TrendIcon className={`h-4 w-4 ${trend.color}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgPerformance.toFixed(1)}%</div>
          <p className={`text-xs mt-1 ${trend.color}`}>
            {trend.text} from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Coverage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEmployees}</div>
          <p className="text-xs text-gray-500 mt-1">
            employees across all vendors
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Performance Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-green-600">Excellent (90%+)</span>
              <span className="font-medium">{performanceByTier.excellent}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-yellow-600">Good (80-89%)</span>
              <span className="font-medium">{performanceByTier.good}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-red-600">Needs Improvement (&lt;80%)</span>
              <span className="font-medium">{performanceByTier.needsImprovement}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
