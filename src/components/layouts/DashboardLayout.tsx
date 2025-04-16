
import { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  User, 
  LogOut, 
  LayoutDashboard, 
  ListTodo, 
  ClipboardList, 
  Settings, 
  Bell, 
  FileText,
  LifeBuoy,
  Home
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const { userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!userProfile) {
    return null;
  }

  const role = userProfile.role;
  const baseUrl = `/${role}`;

  // Navigation links based on role
  const getNavLinks = () => {
    const commonLinks = [
      {
        label: "Dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
        href: `${baseUrl}`
      },
      {
        label: "Disaster Reports",
        icon: <ListTodo className="h-5 w-5" />,
        href: `${baseUrl}/reports`
      }
    ];

    switch (role) {
      case "admin":
        return [
          ...commonLinks,
          {
            label: "User Management",
            icon: <User className="h-5 w-5" />,
            href: `${baseUrl}/users`
          },
          {
            label: "Settings",
            icon: <Settings className="h-5 w-5" />,
            href: `${baseUrl}/settings`
          }
        ];
      case "volunteer":
        return [
          ...commonLinks,
          {
            label: "My Assignments",
            icon: <ClipboardList className="h-5 w-5" />,
            href: `${baseUrl}/assignments`
          },
          {
            label: "Notifications",
            icon: <Bell className="h-5 w-5" />,
            href: `${baseUrl}/notifications`
          }
        ];
      case "ndrf":
        return [
          ...commonLinks,
          {
            label: "Rescue Operations",
            icon: <ClipboardList className="h-5 w-5" />,
            href: `${baseUrl}/operations`
          },
          {
            label: "Reports",
            icon: <FileText className="h-5 w-5" />,
            href: `${baseUrl}/reports`
          }
        ];
      default:
        return commonLinks;
    }
  };

  const navLinks = getNavLinks();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Determine if a nav link is active
  const isActive = (href: string) => {
    // For the main dashboard, only match exact path
    if (href === baseUrl) {
      return location.pathname === baseUrl;
    }
    // For other links, match if the current path starts with the href
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar */}
      <aside className="bg-sidebar w-full md:w-64 flex-shrink-0 md:h-screen md:sticky top-0 border-r border-border">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-sidebar-foreground flex items-center gap-2">
            <LifeBuoy className="h-6 w-6" />
            <span>Disaster Nexus</span>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-sidebar-foreground">{userProfile.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{role} Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive(link.href)
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}

          <div className="pt-4 mt-4 border-t border-border">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sidebar-foreground hover:bg-sidebar-accent/50"
            >
              <Home className="h-5 w-5" />
              <span>Return to Home</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sidebar-foreground hover:bg-sidebar-accent/50 mt-2"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Top bar */}
        <header className="bg-white shadow-sm px-4 py-3 md:px-6 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">{title}</h1>
            <div className="md:hidden">
              {/* Mobile menu button */}
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
