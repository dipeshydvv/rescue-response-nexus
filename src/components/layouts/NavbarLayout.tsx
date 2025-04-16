
import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { User, LogOut, Shield, LifeBuoy, Home, FileText } from "lucide-react";

interface NavbarLayoutProps {
  children: ReactNode;
  title?: string;
}

const NavbarLayout = ({ children, title = "Disaster Management System" }: NavbarLayoutProps) => {
  const { currentUser, userProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Navigation Bar */}
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold flex items-center gap-2">
              <LifeBuoy className="h-8 w-8" />
              <span className="hidden sm:inline">Disaster Response Nexus</span>
            </Link>

            <nav className="hidden md:flex space-x-4 items-center">
              <Link to="/" className="py-2 px-3 rounded hover:bg-primary-700 transition-colors flex items-center gap-1">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              
              <Link to="/report" className="py-2 px-3 rounded hover:bg-primary-700 transition-colors flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Report Disaster</span>
              </Link>
              
              {!currentUser && (
                <>
                  <Link to="/login">
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="secondary">Register</Button>
                  </Link>
                </>
              )}

              {currentUser && userProfile && (
                <>
                  <Link 
                    to={`/${userProfile.role}`} 
                    className="py-2 px-3 rounded hover:bg-primary-700 transition-colors flex items-center gap-1"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <div className="flex items-center gap-2 bg-primary-700 py-1 px-3 rounded">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{userProfile.name}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={handleSignOut}
                      className="text-white hover:bg-primary-700"
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </div>
                </>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              {/* Simplified mobile button */}
              <Button variant="ghost" className="text-white">
                Menu
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {title && (
          <div className="bg-gradient-to-r from-primary to-primary-700 text-white py-8 px-4">
            <div className="container mx-auto">
              <h1 className="text-3xl font-bold">{title}</h1>
            </div>
          </div>
        )}
        <div className="container mx-auto py-6 px-4">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Disaster Response Nexus</h3>
              <p className="text-gray-300">
                A comprehensive platform connecting civilians, volunteers, 
                and emergency response teams for efficient disaster management.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
                <li><Link to="/report" className="text-gray-300 hover:text-white">Report Disaster</Link></li>
                <li><Link to="/login" className="text-gray-300 hover:text-white">Login</Link></li>
                <li><Link to="/register" className="text-gray-300 hover:text-white">Register</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Emergency Contacts</h3>
              <ul className="space-y-2 text-gray-300">
                <li>National Emergency Hotline: 112</li>
                <li>Disaster Management: 1078</li>
                <li>Medical Emergency: 108</li>
                <li>Fire Department: 101</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Disaster Response Nexus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NavbarLayout;
