import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Filter, 
  MapPin, 
  MoreHorizontal,
  Users,
  FlameIcon as Fire,
  AlarmClockIcon as Alarm
} from "lucide-react";
import { useDisasterReports } from "@/contexts/DisasterReportContext";
import { DisasterReport } from "@/lib/types";

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { reports, assignReport, updateReportStatus, loading } = useDisasterReports();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('all');
  const [filteredReports, setFilteredReports] = useState<DisasterReport[]>([]);
  
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    byType: [] as {name: string, value: number}[]
  });
  
  useEffect(() => {
    if (reports.length > 0) {
      const pending = reports.filter(report => report.status === 'pending').length;
      const assigned = reports.filter(report => report.status === 'assigned').length;
      const inProgress = reports.filter(report => 
        report.status === 'dispatched' || report.status === 'in-progress'
      ).length;
      const resolved = reports.filter(report => report.status === 'resolved').length;
      
      const typeMap = new Map<string, number>();
      reports.forEach(report => {
        const count = typeMap.get(report.disasterType) || 0;
        typeMap.set(report.disasterType, count + 1);
      });
      
      const byType = Array.from(typeMap.entries()).map(([name, value]) => ({
        name, value
      }));
      
      setStats({
        total: reports.length,
        pending,
        assigned,
        inProgress,
        resolved,
        byType
      });
    }
  }, [reports]);
  
  useEffect(() => {
    if (reports.length > 0) {
      let filtered;
      
      switch (activeTab) {
        case 'pending':
          filtered = reports.filter(report => report.status === 'pending');
          break;
        case 'assigned':
          filtered = reports.filter(report => report.status === 'assigned');
          break;
        case 'inProgress':
          filtered = reports.filter(report => 
            report.status === 'dispatched' || report.status === 'in-progress'
          );
          break;
        case 'resolved':
          filtered = reports.filter(report => report.status === 'resolved');
          break;
        default:
          filtered = [...reports];
      }
      
      filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      setFilteredReports(filtered);
    }
  }, [activeTab, reports]);
  
  const handleAssign = async (reportId: string, assignTo: 'unassigned' | 'volunteer' | 'ndrf') => {
    try {
      await assignReport(reportId, assignTo);
      if (assignTo !== 'unassigned') {
        await updateReportStatus(reportId, 'assigned');
      }
      
      toast({
        title: "Report Assigned",
        description: assignTo === 'unassigned' 
          ? "Report has been unassigned" 
          : `Report has been assigned to ${assignTo}`,
      });
    } catch (error) {
      console.error("Error assigning report:", error);
      toast({
        title: "Assignment Error",
        description: "Failed to assign the report. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  if (loading) {
    return (
      <DashboardLayout title="Admin Dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold">{stats.pending}</div>
            <Clock className="h-5 w-5 text-status-pending" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold">{stats.inProgress + stats.assigned}</div>
            <Alarm className="h-5 w-5 text-status-in-progress" />
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Disaster Reports by Type</CardTitle>
            <CardDescription>Distribution of reports by disaster type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {stats.byType.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.byType}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {stats.byType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Reports Status Overview</CardTitle>
            <CardDescription>Current status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Pending', value: stats.pending, fill: '#FFBB28' },
                    { name: 'Assigned', value: stats.assigned, fill: '#0088FE' },
                    { name: 'In Progress', value: stats.inProgress, fill: '#0088FE' },
                    { name: 'Resolved', value: stats.resolved, fill: '#00C49F' }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8">
                    {[
                      { name: 'Pending', fill: '#FFBB28' },
                      { name: 'Assigned', fill: '#0088FE' },
                      { name: 'In Progress', fill: '#0088FE' },
                      { name: 'Resolved', fill: '#00C49F' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Disaster Reports</CardTitle>
              <CardDescription>Manage and assign incoming reports</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
              <Link to="/report">
                <Button size="sm" className="gap-1">
                  <FileText className="h-4 w-4" />
                  <span>New Report</span>
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full md:w-auto">
              <TabsTrigger value="all">All Reports</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="assigned">Assigned</TabsTrigger>
              <TabsTrigger value="inProgress">In Progress</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {filteredReports.length > 0 ? (
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <Card key={report.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {report.disasterType === 'fire' && <Fire className="h-5 w-5 text-red-500" />}
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
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Reported: {formatDate(report.createdAt)}</span>
                          </div>
                          {report.assignedTo !== 'unassigned' && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>Assigned to: {report.assignedTo}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Link to={`/admin/report/${report.id}`}>
                          <Button variant="outline" size="sm" className="hover:bg-primary/10 transition-colors">View Details</Button>
                        </Link>
                        
                        <div className="flex items-center gap-2">
                          {report.status === 'pending' && (
                            <>
                              <Select
                                onValueChange={(value) => 
                                  handleAssign(report.id, value as 'unassigned' | 'volunteer' | 'ndrf')
                                }
                                defaultValue="unassigned"
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Assign to..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="volunteer">Assign to Volunteers</SelectItem>
                                  <SelectItem value="ndrf">Assign to NDRF</SelectItem>
                                </SelectContent>
                              </Select>
                            </>
                          )}
                          
                          {report.status !== 'pending' && (
                            <Button variant="ghost" size="sm" className="hover:bg-primary/5 transition-colors">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border rounded-lg bg-slate-50 animate-fade-in">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium">No reports found</h3>
                  <p className="text-muted-foreground mt-1">
                    {activeTab === 'all' 
                      ? "No disaster reports have been submitted yet" 
                      : `No ${activeTab} reports available`}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AdminDashboard;
