
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  AlertCircle,
  CheckCircle2, 
  Clock, 
  FileText, 
  HelpCircle, 
  MapPin, 
  BarChart3
} from "lucide-react";
import { useDisasterReports } from "@/contexts/DisasterReportContext";
import { useAuth } from "@/contexts/AuthContext";
import { DisasterReport } from "@/lib/types";

// Helper function to format date
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Status Badge component
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-status-pending text-status-pending-foreground">Pending</Badge>;
    case 'assigned':
      return <Badge variant="outline" className="bg-primary/20 text-primary">Assigned</Badge>;
    case 'dispatched':
      return <Badge variant="outline" className="bg-status-in-progress text-status-in-progress-foreground">Dispatched</Badge>;
    case 'in-progress':
      return <Badge variant="outline" className="bg-status-in-progress text-status-in-progress-foreground">In Progress</Badge>;
    case 'resolved':
      return <Badge variant="outline" className="bg-status-completed text-status-completed-foreground">Resolved</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const VolunteerDashboard = () => {
  const { userReports, updateReportStatus, loading } = useDisasterReports();
  const { userProfile } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('all');
  const [filteredReports, setFilteredReports] = useState<DisasterReport[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    assigned: 0,
    inProgress: 0,
    resolved: 0
  });
  
  // Filter reports based on active tab and update stats
  useEffect(() => {
    if (userReports.length > 0) {
      let filtered;
      
      switch (activeTab) {
        case 'assigned':
          filtered = userReports.filter(report => report.status === 'assigned');
          break;
        case 'inProgress':
          filtered = userReports.filter(report => report.status === 'in-progress' || report.status === 'dispatched');
          break;
        case 'resolved':
          filtered = userReports.filter(report => report.status === 'resolved');
          break;
        default:
          filtered = [...userReports];
      }
      
      // Sort by newest first
      filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      setFilteredReports(filtered);
      
      // Update stats
      setStats({
        total: userReports.length,
        assigned: userReports.filter(report => report.status === 'assigned').length,
        inProgress: userReports.filter(report => report.status === 'in-progress' || report.status === 'dispatched').length,
        resolved: userReports.filter(report => report.status === 'resolved').length
      });
    } else {
      setFilteredReports([]);
      setStats({
        total: 0,
        assigned: 0,
        inProgress: 0,
        resolved: 0
      });
    }
  }, [activeTab, userReports]);
  
  const handleTakeResponsibility = async (reportId: string) => {
    try {
      await updateReportStatus(reportId, 'in-progress');
      
      toast({
        title: "Status Updated",
        description: "You've taken responsibility for this case",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update report status",
        variant: "destructive"
      });
    }
  };
  
  if (loading) {
    return (
      <DashboardLayout title="Volunteer Dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout title="Volunteer Dashboard">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New Assignments</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold">{stats.assigned}</div>
            <AlertCircle className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold">{stats.inProgress}</div>
            <Clock className="h-5 w-5 text-status-in-progress" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold">{stats.resolved}</div>
            <CheckCircle2 className="h-5 w-5 text-status-completed" />
          </CardContent>
        </Card>
      </div>
      
      {/* Report Tabs */}
      <Card className="mt-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Disaster Assignments</CardTitle>
              <CardDescription>Manage your assigned disaster cases</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 w-full md:w-auto">
              <TabsTrigger value="all">All Reports</TabsTrigger>
              <TabsTrigger value="assigned">New Assignments</TabsTrigger>
              <TabsTrigger value="inProgress">In Progress</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {filteredReports.length > 0 ? (
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <Card key={report.id}>
                      <CardHeader className="pb-2">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {report.disasterType === 'fire' && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>}
                            {report.disasterType === 'flood' && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5.34a2 2 0 0 1 .23-.9l6-10.94a2 2 0 0 1 3.54 0l6 10.94a2 2 0 0 1 .23.9z"/><path d="M4.34 15h15.32"/></svg>}
                            {report.disasterType === 'earthquake' && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m2 12 6-6v4h8V6l6 6-6 6v-4H8v4l-6-6Z"/></svg>}
                            <h3 className="text-lg font-semibold capitalize">{report.disasterType} Incident</h3>
                            <StatusBadge status={report.status} />
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{report.location}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {report.description}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Reported: {formatDate(report.createdAt)}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Link to={`/volunteer/report/${report.id}`}>
                          <Button variant="outline" size="sm">View Details</Button>
                        </Link>
                        
                        {report.status === 'assigned' && (
                          <Button 
                            size="sm"
                            onClick={() => handleTakeResponsibility(report.id)}
                          >
                            Take Responsibility
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border rounded-lg bg-slate-50">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium">No reports found</h3>
                  <p className="text-muted-foreground mt-1">
                    {activeTab === 'all' 
                      ? "You don't have any assigned reports yet" 
                      : `No ${activeTab} reports available`}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Help and Guidelines */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            <span>Volunteer Guidelines</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">How to respond to an assignment:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Review all details of the assigned disaster case</li>
                <li>Click "Take Responsibility" to update the status</li>
                <li>Contact the local NDRF team if needed</li>
                <li>Add regular updates and notes to document progress</li>
                <li>Mark as "Resolved" once the situation is under control</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Emergency Contacts:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Emergency</Badge>
                  <span>National Emergency Hotline: 112</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">NDRF</Badge>
                  <span>NDRF Control Room: 1078</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Medical</Badge>
                  <span>Ambulance Services: 108</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default VolunteerDashboard;
