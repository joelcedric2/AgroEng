import { ReactNode } from "react";
import { BottomNavigation, TopHeader } from "./navigation";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  showHeader?: boolean;
  showNavigation?: boolean;
  showProfile?: boolean;
  className?: string;
}

export function PageLayout({ 
  children, 
  title = "AgroEng AI", 
  showHeader = true, 
  showNavigation = true,
  showProfile = false,
  className = ""
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showHeader && <TopHeader title={title} showProfile={showProfile} />}
      
      <main className={`flex-1 ${showNavigation ? 'pb-16' : ''} ${className}`}>
        {children}
      </main>
      
      {showNavigation && <BottomNavigation />}
    </div>
  );
}