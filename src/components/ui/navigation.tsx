import { Home, Camera, History, BookOpen, Settings, User, LogOut, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NavigationItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  adminOnly?: boolean;
}

const navigationItems: NavigationItem[] = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Camera, label: "Camera", path: "/camera" },
  { icon: History, label: "History", path: "/history" },
  { icon: BookOpen, label: "Tips", path: "/tips" },
  { icon: Database, label: "Admin", path: "/crop-database", adminOnly: true },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useUserRole();

  // Filter navigation items based on user role
  const visibleItems = navigationItems.filter(item => 
    !item.adminOnly || isAdmin
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground scale-105" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function TopHeader({ title, showProfile = false }: { title: string; showProfile?: boolean }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate('/auth');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <header className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border z-40">
      <div className="flex items-center justify-between h-16 px-4">
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
        {showProfile && user && (
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate('/settings')}
              className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <User className="h-5 w-5" />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors text-destructive"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}