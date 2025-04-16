
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
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  MapPin,
  Bell
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

const NDRFDashboard = () => {
  const { userReports, updateReportStatus, loading } = useDisasterReports();
  const { userProfile } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('all');
  const [filteredReports, setFilteredReports] = useState<DisasterReport[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    assigned: 0,
    dispatched: 0,
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
        case 'active':
          filtered = userReports.filter(report => 
            report.status === 'dispatched' || report.status === 'in-progress'
          );
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
        dispatched: userReports.filter(report => report.status === 'dispatched').length,
        inProgress: userReports.filter(report => report.status === 'in-progress').length,
        resolved: userReports.filter(report => report.status === 'resolved').length
      });
    } else {
      setFilteredReports([]);
      setStats({
        total: 0,
        assigned: 0,
        dispatched: 0,
        inProgress: 0,
        resolved: 0
      });
    }
  }, [activeTab, userReports]);
  
  const handleDispatch = async (reportId: string) => {
    try {
      await updateReportStatus(reportId, 'dispatched');
      
      toast({
        title: "Team Dispatched",
        description: "NDRF team has been dispatched to the location",
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
      <DashboardLayout title="NDRF Dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout title="NDRF Control Center">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
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
            <CardTitle className="text-sm font-medium text-muted-foreground">New</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold">{stats.assigned}</div>
            <Bell className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Dispatched</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold">{stats.dispatched}</div>
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
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
      
      {/* Active Operations */}
      <Card className="mt-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Disaster Response Operations</CardTitle>
              <CardDescription>Manage NDRF rescue operations</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 w-full md:w-auto">
              <TabsTrigger value="all">All Operations</TabsTrigger>
              <TabsTrigger value="assigned">New Assignments</TabsTrigger>
              <TabsTrigger value="active">Active Operations</TabsTrigger>
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
                        <Link to={`/ndrf/report/${report.id}`}>
                          <Button variant="outline" size="sm">View Details</Button>
                        </Link>
                        
                        {report.status === 'assigned' && (
                          <Button 
                            size="sm"
                            onClick={() => handleDispatch(report.id)}
                          >
                            Dispatch Team
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border rounded-lg bg-slate-50">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium">No operations found</h3>
                  <p className="text-muted-foreground mt-1">
                    {activeTab === 'all' 
                      ? "No rescue operations have been assigned to NDRF yet" 
                      : `No ${activeTab} operations available`}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Emergency Guidelines */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span>NDRF Operational Guidelines</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Disaster Response Protocol:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Review all details of the assigned disaster case</li>
                <li>Click "Dispatch Team" to confirm deployment</li>
                <li>Mobilize appropriate teams based on disaster type</li>
                <li>Coordinate with local authorities and volunteers</li>
                <li>Provide regular updates through the notes system</li>
                <li>Document all operations with photos and reports</li>
                <li>Mark as "Resolved" once the operation is complete</li>
              </ol>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2 text-red-800">Fire Response</h3>
                <ul className="space-y-1 text-xs text-red-700">
                  <li>Deploy firefighting equipment</li>
                  <li>Establish evacuation zones</li>
                  <li>Coordinate with fire services</li>
                  <li>Set up medical stations</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2 text-blue-800">Flood Response</h3>
                <ul className="space-y-1 text-xs text-blue-700">
                  <li>Deploy boats and life jackets</li>
                  <li>Establish elevated shelters</li>
                  <li>Monitor water levels</li>
                  <li>Distribute clean water</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2 text-yellow-800">Earthquake Response</h3>
                <ul className="space-y-1 text-xs text-yellow-700">
                  <li>Deploy search and rescue teams</li>
                  <li>Assess structural damage</li>
                  <li>Set up field hospitals</li>
                  <li>Establish communication centers</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default NDRFDashboard;
