import { Link } from 'react-router-dom';
import { Calculator, Users, Stethoscope, Database, ArrowRight, Heart, Activity, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';

const Index = () => {
  const features = [
    {
      title: 'Outpatient Calculator',
      description: 'Calculate bills for outpatient services including laboratory, X-ray, consultations, and procedures.',
      icon: Users,
      href: '/outpatient',
      variant: 'medical' as const
    },
    {
      title: 'Inpatient Calculator',
      description: 'Manage inpatient billing with daily rates, room charges, medicines, and extended stay calculations.',
      icon: Stethoscope,
      href: '/inpatient',
      variant: 'default' as const
    },
    {
      title: 'Database Management',
      description: 'Add, edit, and manage medical items, procedures, and their pricing across all categories.',
      icon: Database,
      href: '/database',
      variant: 'medical-outline' as const
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="medical-gradient text-primary-foreground py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6 animate-fade-in">
              <div className="p-4 bg-primary-foreground/20 rounded-full backdrop-blur-sm">
                <Heart className="h-16 w-16 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Hospital Bill Calculator
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Professional medical billing calculator for hospitals and clinics.
              Manage outpatient and inpatient calculations with real-time pricing and comprehensive database management.
            </p>
            <div className="flex justify-center space-x-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Link to="/outpatient">
                <Button size="xl" variant="hero" className="font-semibold">
                  Start Calculating
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Complete Billing Solution
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to calculate accurate medical bills with ease and precision.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card 
                    key={index} 
                    className="glass-card group border-secondary/20 animate-fade-in"
                    style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-3 bg-secondary rounded-full w-fit group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl font-bold text-foreground">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-muted-foreground mb-6">
                        {feature.description}
                      </p>
                      <Link to={feature.href}>
                        <Button
                          variant={feature.variant}
                          className="w-full font-semibold"
                        >
                          Open Calculator
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="text-4xl font-bold text-primary mb-2">10+</div>
                <div className="text-muted-foreground">Outpatient Categories</div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="text-4xl font-bold text-accent mb-2">19+</div>
                <div className="text-muted-foreground">Inpatient Categories</div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="text-4xl font-bold text-primary mb-2">∞</div>
                <div className="text-muted-foreground">Customizable Items</div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Why Choose Our Calculator?
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-secondary rounded-lg">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Real-time Calculations</h3>
                      <p className="text-muted-foreground text-sm">Instant bill updates as you add items and services</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-secondary rounded-lg">
                      <ClipboardList className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Comprehensive Categories</h3>
                      <p className="text-muted-foreground text-sm">Cover all medical services from lab tests to surgeries</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-secondary rounded-lg">
                      <Database className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Flexible Database</h3>
                      <p className="text-muted-foreground text-sm">Easily customize pricing and add new items</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="glass-card p-8 rounded-xl">
                <div className="text-center">
                  <Calculator className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">Ready to Start?</h3>
                  <p className="text-muted-foreground mb-6">
                    Begin calculating accurate medical bills today
                  </p>
                  <Link to="/outpatient">
                    <Button variant="medical" size="lg" className="w-full">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-8 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-muted-foreground text-sm">
              Hospital Bill Calculator - Professional Medical Billing System
            </p>
          </div>
        </footer>
      </div>
    </Layout>
  );
};

export default Index;
