
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavbarLayout from "@/components/layouts/NavbarLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Shield, Users, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, currentUser } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  // Redirect if already logged in
  if (currentUser) {
    navigate('/');
    return null;
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await signIn(formData.email, formData.password);
      
      // Redirect will happen automatically based on user role in the AuthProvider
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Login failed. Please check your credentials and try again.";
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please try again later.";
      }
      
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <NavbarLayout>
      <div className="max-w-md mx-auto mt-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Login to Your Account</h1>
          <p className="text-gray-600 mt-2">
            Access your portal to manage disaster response
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        
        <div className="mt-6 text-center space-y-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register now
            </Link>
          </p>
          
          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm font-medium text-gray-700 mb-4">Portal Access</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mb-2">
                  <User className="h-5 w-5 text-red-600" />
                </div>
                <span className="text-xs text-gray-600">Admin Portal</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-xs text-gray-600">Volunteer Portal</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-xs text-gray-600">NDRF Portal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NavbarLayout>
  );
};

export default LoginPage;
