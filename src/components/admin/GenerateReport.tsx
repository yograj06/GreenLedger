import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { BarChart3, Download, Calendar as CalendarIcon, FileText } from 'lucide-react';
import { useDemoStore } from '@/state/demoStore';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type ReportType = 'users' | 'transactions' | 'products' | 'trust_scores' | 'deliveries';

export default function GenerateReport() {
  const { state } = useDemoStore();
  const [reportType, setReportType] = useState<ReportType>('users');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [generatedReport, setGeneratedReport] = useState<any>(null);

  const generateReport = () => {
    let reportData: any = {};

    switch (reportType) {
      case 'users':
        reportData = generateUserReport();
        break;
      case 'transactions':
        reportData = generateTransactionReport();
        break;
      case 'products':
        reportData = generateProductReport();
        break;
      case 'trust_scores':
        reportData = generateTrustScoreReport();
        break;
      case 'deliveries':
        reportData = generateDeliveryReport();
        break;
    }

    setGeneratedReport({
      type: reportType,
      generatedAt: new Date(),
      dateRange,
      data: reportData
    });

    toast.success('Report generated successfully!');
  };

  const generateUserReport = () => {
    const roleStats = state.users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgTrustScore = state.users.reduce((sum, user) => sum + user.trustScore, 0) / state.users.length;

    return {
      totalUsers: state.users.length,
      roleDistribution: roleStats,
      averageTrustScore: Math.round(avgTrustScore * 100) / 100,
      recentJoins: state.users.filter(user => 
        Date.now() - user.createdAt < 30 * 24 * 60 * 60 * 1000
      ).length,
      userDetails: state.users.map(user => ({
        id: user.id,
        name: user.name,
        role: user.role,
        district: user.district,
        trustScore: user.trustScore,
        totalTransactions: user.totalTransactions,
        joinDate: format(new Date(user.createdAt), 'MMM dd, yyyy')
      }))
    };
  };

  const generateTransactionReport = () => {
    const totalTransactions = state.users.reduce((sum, user) => sum + user.totalTransactions, 0);
    const totalPayments = state.payments.length;
    const completedPayments = state.payments.filter(p => p.state === 'released').length;
    const totalAmount = state.payments.reduce((sum, payment) => sum + payment.amount, 0);

    return {
      totalTransactions,
      totalPayments,
      completedPayments,
      pendingPayments: totalPayments - completedPayments,
      totalAmount,
      averageTransactionValue: Math.round((totalAmount / totalPayments) * 100) / 100,
      paymentDetails: state.payments.map(payment => ({
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        state: payment.state,
        createdAt: format(new Date(payment.createdAt), 'MMM dd, yyyy')
      }))
    };
  };

  const generateProductReport = () => {
    const categoryStats = state.products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusStats = state.products.reduce((acc, product) => {
      acc[product.status] = (acc[product.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalProducts: state.products.length,
      categoryDistribution: categoryStats,
      statusDistribution: statusStats,
      totalValue: state.products.reduce((sum, product) => 
        sum + (product.quantity * product.pricePerUnit), 0
      ),
      organicProducts: state.products.filter(p => p.organicCertified).length,
      productDetails: state.products.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        quantity: product.quantity,
        unit: product.unit,
        pricePerUnit: product.pricePerUnit,
        status: product.status,
        district: product.district
      }))
    };
  };

  const generateTrustScoreReport = () => {
    const scores = state.users.map(u => u.trustScore);
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const highScores = scores.filter(score => score >= 90).length;
    const mediumScores = scores.filter(score => score >= 70 && score < 90).length;
    const lowScores = scores.filter(score => score < 70).length;

    return {
      averageScore: Math.round(avgScore * 100) / 100,
      highTrustUsers: highScores,
      mediumTrustUsers: mediumScores,
      lowTrustUsers: lowScores,
      scoreDistribution: {
        '90-100': highScores,
        '70-89': mediumScores,
        '0-69': lowScores
      },
      userScores: state.users.map(user => ({
        id: user.id,
        name: user.name,
        role: user.role,
        trustScore: user.trustScore,
        totalTransactions: user.totalTransactions,
        successfulDeliveries: user.successfulDeliveries
      }))
    };
  };

  const generateDeliveryReport = () => {
    const totalShipments = state.shipments.length;
    const deliveredShipments = state.shipments.filter(s => s.status === 'delivered').length;
    const inTransitShipments = state.shipments.filter(s => s.status === 'in_transit').length;

    return {
      totalShipments,
      deliveredShipments,
      inTransitShipments,
      pendingShipments: totalShipments - deliveredShipments - inTransitShipments,
      successRate: Math.round((deliveredShipments / totalShipments) * 100),
      shipmentDetails: state.shipments.map(shipment => ({
        id: shipment.id,
        status: shipment.status,
        origin: shipment.originDistrict,
        destination: shipment.destinationDistrict,
        createdAt: format(new Date(shipment.createdAt), 'MMM dd, yyyy'),
        temperature: shipment.temperature,
        humidity: shipment.humidity
      }))
    };
  };

  const downloadReport = () => {
    if (!generatedReport) return;

    const reportContent = JSON.stringify(generatedReport, null, 2);
    const blob = new Blob([reportContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_report_${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Report downloaded successfully!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Generate Reports</h1>
          <p className="text-muted-foreground">Create detailed analytics reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Report Type</label>
              <Select value={reportType} onValueChange={(value: ReportType) => setReportType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="users">User Analytics</SelectItem>
                  <SelectItem value="transactions">Transaction Report</SelectItem>
                  <SelectItem value="products">Product Analysis</SelectItem>
                  <SelectItem value="trust_scores">Trust Score Report</SelectItem>
                  <SelectItem value="deliveries">Delivery Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Date Range (Optional)</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange as any}
                    onSelect={setDateRange as any}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button onClick={generateReport} className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>

            {generatedReport && (
              <Button onClick={downloadReport} variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Report Preview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Report Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {generatedReport ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold capitalize">
                    {generatedReport.type.replace('_', ' ')} Report
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Generated: {format(generatedReport.generatedAt, 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>

                <ReportContent report={generatedReport} />
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Select report type and click "Generate Report" to see preview
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ReportContent({ report }: { report: any }) {
  const { type, data } = report;

  const renderSummaryCards = (summaryData: Record<string, any>) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(summaryData).map(([key, value]) => (
        <div key={key} className="text-center p-4 bg-muted rounded-lg">
          <p className="text-2xl font-bold text-primary">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          <p className="text-sm text-muted-foreground capitalize">
            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
          </p>
        </div>
      ))}
    </div>
  );

  switch (type) {
    case 'users':
      return (
        <div className="space-y-6">
          {renderSummaryCards({
            totalUsers: data.totalUsers,
            avgTrustScore: `${data.averageTrustScore}%`,
            recentJoins: data.recentJoins
          })}
          
          <div>
            <h4 className="font-semibold mb-3">Role Distribution</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(data.roleDistribution).map(([role, count]) => (
                <div key={role} className="flex justify-between p-2 bg-muted rounded">
                  <span className="capitalize">{role}s:</span>
                  <span className="font-medium">{count as number}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'transactions':
      return (
        <div className="space-y-6">
          {renderSummaryCards({
            totalTransactions: data.totalTransactions,
            completedPayments: data.completedPayments,
            totalAmount: `₹${data.totalAmount.toLocaleString()}`,
            avgValue: `₹${data.averageTransactionValue}`
          })}
        </div>
      );

    case 'products':
      return (
        <div className="space-y-6">
          {renderSummaryCards({
            totalProducts: data.totalProducts,
            totalValue: `₹${data.totalValue.toLocaleString()}`,
            organicProducts: data.organicProducts
          })}
          
          <div>
            <h4 className="font-semibold mb-3">Category Distribution</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(data.categoryDistribution).map(([category, count]) => (
                <div key={category} className="flex justify-between p-2 bg-muted rounded">
                  <span className="capitalize">{category}:</span>
                  <span className="font-medium">{count as number}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'trust_scores':
      return (
        <div className="space-y-6">
          {renderSummaryCards({
            averageScore: `${data.averageScore}%`,
            highTrust: data.highTrustUsers,
            mediumTrust: data.mediumTrustUsers,
            lowTrust: data.lowTrustUsers
          })}
        </div>
      );

    case 'deliveries':
      return (
        <div className="space-y-6">
          {renderSummaryCards({
            totalShipments: data.totalShipments,
            delivered: data.deliveredShipments,
            inTransit: data.inTransitShipments,
            successRate: `${data.successRate}%`
          })}
        </div>
      );

    default:
      return <p>Report data not available</p>;
  }
}