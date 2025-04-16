
import NavbarLayout from "@/components/layouts/NavbarLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LifeBuoy, AlertTriangle, Users, Shield, ArrowRight } from "lucide-react";
import BackToTop from "@/components/ui/back-to-top";

const HomePage = () => {
  return (
    <NavbarLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-700 text-white py-16 px-4 rounded-lg mb-12 shadow-lg animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Disaster Response Nexus</h1>
          <p className="text-xl mb-8">
            A unified platform connecting civilians, volunteers, and emergency response teams
            for efficient disaster management and coordination.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/report">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto btn-hover">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Report a Disaster
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary w-full sm:w-auto btn-hover">
                <Users className="mr-2 h-5 w-5" />
                Volunteer Registration
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Portal Description Section */}
      <div className="max-w-6xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Integrated Portals</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Report & Admin Portal */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow animate-zoom-in card-hover">
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Report & Admin Portal</h3>
            <p className="text-gray-600 mb-4">
              Civilians can report disasters with detailed information, while administrators 
              manage and assign reports to appropriate response teams.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm">Easy disaster reporting</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm">Admin assignment dashboard</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm">Status tracking</span>
              </li>
            </ul>
            <Link to="/report" className="text-primary hover:text-primary-700 font-medium flex items-center group">
              Report a Disaster 
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Volunteer Portal */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow animate-zoom-in card-hover" style={{animationDelay: '0.1s'}}>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Volunteer Portal</h3>
            <p className="text-gray-600 mb-4">
              Volunteers can view assignments, accept responsibility for cases, 
              and coordinate with emergency response teams to provide aid.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm">Case assignment system</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm">Progress reporting</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm">NDRF coordination</span>
              </li>
            </ul>
            <Link to="/register" className="text-primary hover:text-primary-700 font-medium flex items-center group">
              Register as Volunteer 
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* NDRF Base Portal */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow animate-zoom-in card-hover" style={{animationDelay: '0.2s'}}>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">NDRF Base Portal</h3>
            <p className="text-gray-600 mb-4">
              Emergency response teams track assigned cases, update operation status,
              and provide detailed rescue reports and documentation.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm">Operation management</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm">Response tracking</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm">Documentation system</span>
              </li>
            </ul>
            <Link to="/login" className="text-primary hover:text-primary-700 font-medium flex items-center group">
              NDRF Login 
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50 py-12 px-4 rounded-lg mb-12 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6 items-center animate-slide-in" style={{animationDelay: '0.1s'}}>
              <div className="bg-white p-4 rounded-full h-16 w-16 flex items-center justify-center shadow-md">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <div className="flex-1 md:ml-4">
                <h3 className="text-xl font-semibold mb-2">Disaster Reporting</h3>
                <p className="text-gray-600">
                  Civilians can report disasters through the user-friendly form, providing essential 
                  details about the incident including location, type, and severity.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center animate-slide-in" style={{animationDelay: '0.2s'}}>
              <div className="bg-white p-4 rounded-full h-16 w-16 flex items-center justify-center shadow-md">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <div className="flex-1 md:ml-4">
                <h3 className="text-xl font-semibold mb-2">Administrative Assessment</h3>
                <p className="text-gray-600">
                  Administrators review incoming reports, validate information, and assign cases 
                  to either volunteer teams or the National Disaster Response Force.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center animate-slide-in" style={{animationDelay: '0.3s'}}>
              <div className="bg-white p-4 rounded-full h-16 w-16 flex items-center justify-center shadow-md">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <div className="flex-1 md:ml-4">
                <h3 className="text-xl font-semibold mb-2">Response Coordination</h3>
                <p className="text-gray-600">
                  Assigned teams can view detailed case information, coordinate response efforts, 
                  and update status as they work towards resolution.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center animate-slide-in" style={{animationDelay: '0.4s'}}>
              <div className="bg-white p-4 rounded-full h-16 w-16 flex items-center justify-center shadow-md">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <div className="flex-1 md:ml-4">
                <h3 className="text-xl font-semibold mb-2">Resolution & Documentation</h3>
                <p className="text-gray-600">
                  Teams document the resolution process, add notes and images, and update the 
                  status to resolved once the response is complete.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-primary text-white py-12 px-4 rounded-lg text-center shadow-lg animate-fade-in">
        <div className="max-w-3xl mx-auto">
          <LifeBuoy className="h-16 w-16 mx-auto mb-4 animate-pulse" />
          <h2 className="text-3xl font-bold mb-4">Ready to contribute?</h2>
          <p className="text-xl mb-8">
            Join our network of volunteers and emergency responders to help communities in times of need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto btn-hover">
                Register Now
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary w-full sm:w-auto btn-hover">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Back to Top Button */}
      <BackToTop />
    </NavbarLayout>
  );
};

export default HomePage;
