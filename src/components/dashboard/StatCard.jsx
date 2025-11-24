import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

export function StatCard({ title, value, trend, icon: Icon, color }) {
    const isPositive = trend >= 0;

    const colorMap = {
        blue: 'text-blue-600 bg-blue-50',
        green: 'text-green-600 bg-green-50',
        purple: 'text-purple-600 bg-purple-50',
        orange: 'text-orange-600 bg-orange-50',
        red: 'text-red-600 bg-red-50',
        yellow: 'text-yellow-600 bg-yellow-50',
    };

    const iconColorClass = colorMap[color] || 'text-gray-600 bg-gray-50';

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">{title}</p>
                        <h3 className="text-2xl font-bold mt-2 text-gray-900">{value}</h3>
                    </div>
                    <div className={`p-3 rounded-full ${iconColorClass}`}>
                        {Icon && <Icon className="w-6 h-6" />}
                    </div>
                </div>

                {trend !== undefined && trend !== null && (
                    <div className="mt-4 flex items-center">
                        <span className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                            {Math.abs(trend)}%
                        </span>
                        <span className="text-sm text-gray-500 ml-2">from last month</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
