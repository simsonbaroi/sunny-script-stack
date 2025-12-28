import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calculator, Database, Users, Stethoscope, Brain } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Calculator },
    { name: 'Outpatient', href: '/outpatient', icon: Users },
    { name: 'Inpatient', href: '/inpatient', icon: Stethoscope },
    { name: 'Database', href: '/database', icon: Database },
    { name: 'AI Analytics', href: '/ai-analytics', icon: Brain },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="header-enhanced text-primary-foreground sticky top-0 z-50 border-b border-primary/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-center h-14 sm:h-16 relative">
            {/* Logo and Title - Centered */}
            <div className="flex items-center justify-center flex-1">
              <Calculator className="h-7 w-7 sm:h-8 sm:w-8 text-primary-foreground mr-2 sm:mr-3" />
              <div className="text-center">
                <h1 className="text-base sm:text-xl font-bold text-primary-foreground leading-tight">
                  Hospital Bill Calculator
                </h1>
                <p className="text-xs text-primary-foreground/80 mt-0.5 hidden sm:block">
                  Professional Medical Billing System
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="border-t border-primary-foreground/10">
            <nav className="flex justify-center py-2.5 px-1 overflow-x-auto">
              <div className="flex space-x-0.5 sm:space-x-1 min-w-max max-w-full">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`nav-button-enhanced flex items-center px-2 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium min-w-[70px] sm:min-w-[100px] max-w-[85px] sm:max-w-none justify-center flex-shrink-0 transition-all ${
                        isActive
                          ? 'nav-button-active bg-primary-foreground/25 text-primary-foreground font-semibold border border-primary-foreground/30'
                          : 'text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/15'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="whitespace-nowrap leading-tight truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
