import { useState } from 'react';
import { Brain, TrendingUp, BarChart3, PieChart, Activity, Lightbulb, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Layout from '@/components/Layout';

interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'prediction' | 'optimization' | 'trend' | 'alert';
  impact: 'high' | 'medium' | 'low';
  value?: string;
}

const AIAnalytics = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const insights: Insight[] = [
    {
      id: '1',
      title: 'Laboratory Services Demand',
      description: 'Expected 15% increase in laboratory test requests next month based on seasonal patterns.',
      type: 'prediction',
      impact: 'high',
      value: '+15%'
    },
    {
      id: '2',
      title: 'Billing Optimization',
      description: 'Consider bundling common procedures to improve billing efficiency by 8%.',
      type: 'optimization',
      impact: 'medium',
      value: '8%'
    },
    {
      id: '3',
      title: 'Room Occupancy Trend',
      description: 'Private room utilization increased by 22% compared to last quarter.',
      type: 'trend',
      impact: 'high',
      value: '+22%'
    },
    {
      id: '4',
      title: 'Medication Stock Alert',
      description: 'Antibiotic usage trending higher. Consider reviewing stock levels.',
      type: 'alert',
      impact: 'medium'
    },
    {
      id: '5',
      title: 'Peak Hours Analysis',
      description: 'Outpatient services peak between 9-11 AM. Consider staffing adjustments.',
      type: 'optimization',
      impact: 'low'
    }
  ];

  const stats = [
    { label: 'Total Transactions', value: '2,847', change: '+12%', icon: Activity },
    { label: 'Average Bill Amount', value: '₱15,420', change: '+5%', icon: TrendingUp },
    { label: 'Most Used Category', value: 'Laboratory', change: '34%', icon: BarChart3 },
    { label: 'Peak Usage Time', value: '10:00 AM', change: 'Weekdays', icon: Clock },
  ];

  const categoryDistribution = [
    { category: 'Laboratory', percentage: 34, color: 'bg-primary' },
    { category: 'Pharmacy', percentage: 22, color: 'bg-accent' },
    { category: 'Radiology', percentage: 18, color: 'bg-blue-500' },
    { category: 'Room & Board', percentage: 15, color: 'bg-amber-500' },
    { category: 'Others', percentage: 11, color: 'bg-muted-foreground' },
  ];

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-primary/20 text-primary border-primary/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low': return 'bg-muted text-muted-foreground border-muted';
      default: return '';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'prediction': return TrendingUp;
      case 'optimization': return Lightbulb;
      case 'trend': return BarChart3;
      case 'alert': return Target;
      default: return Brain;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                <Brain className="h-8 w-8 text-primary" />
                AI Analytics
              </h1>
              <p className="text-muted-foreground">
                AI-powered insights for cost prediction, demand forecasting, and billing optimization.
              </p>
            </div>
            <Button 
              variant="medical" 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Activity className="h-4 w-4 mr-2 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Run Analysis
                </>
              )}
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="glass-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                        <Badge variant="outline" className="mt-2 bg-primary/10 text-primary border-primary/30">
                          {stat.change}
                        </Badge>
                      </div>
                      <div className="p-3 bg-secondary rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* AI Insights */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    AI-Powered Insights
                  </CardTitle>
                  <CardDescription>
                    Intelligent recommendations based on your billing data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {insights.map((insight) => {
                    const Icon = getTypeIcon(insight.type);
                    return (
                      <div 
                        key={insight.id} 
                        className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground">{insight.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant="outline" className={getImpactColor(insight.impact)}>
                              {insight.impact}
                            </Badge>
                            {insight.value && (
                              <span className="text-lg font-bold text-primary">{insight.value}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Predictions Card */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Revenue Predictions
                  </CardTitle>
                  <CardDescription>
                    Forecasted billing trends for the next quarter
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                        <p className="text-sm text-muted-foreground">Next Month</p>
                        <p className="text-2xl font-bold text-primary">₱4.2M</p>
                        <Badge className="mt-2 bg-primary/20 text-primary">+8%</Badge>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-accent/10 border border-accent/20">
                        <p className="text-sm text-muted-foreground">Next Quarter</p>
                        <p className="text-2xl font-bold text-accent">₱13.5M</p>
                        <Badge className="mt-2 bg-accent/20 text-accent">+12%</Badge>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-secondary border border-border">
                        <p className="text-sm text-muted-foreground">Year-End</p>
                        <p className="text-2xl font-bold text-foreground">₱52M</p>
                        <Badge variant="outline" className="mt-2">Projected</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Category Distribution */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    Category Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categoryDistribution.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground">{item.category}</span>
                        <span className="text-muted-foreground">{item.percentage}%</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Export Analytics Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    Set Revenue Goals
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="h-4 w-4 mr-2" />
                    View Detailed Metrics
                  </Button>
                </CardContent>
              </Card>

              {/* AI Status */}
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4 animate-glow">
                      <Brain className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">AI Model Active</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Last updated: 5 minutes ago
                    </p>
                    <Badge className="mt-3 bg-primary/20 text-primary">
                      95% Accuracy
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AIAnalytics;
