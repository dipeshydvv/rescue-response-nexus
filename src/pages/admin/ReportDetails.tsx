
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Check, 
  Clock, 
  FileText, 
  Image, 
  Info, 
  MapPin,
  MessageSquare,
  Send, 
  User, 
  UserCheck, 
  AlertCircle,
  ChevronLeft
} from "lucide-react";
import { useDisasterReports } from "@/contexts/DisasterReportContext";
import { DisasterReport, ResponseNote } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";

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

const ReportDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const { 
    fetchReportDetails, 
    updateReportStatus, 
    assignReport, 
    addNote,
    reportNotes,
    fetchReportNotes
  } = useDisasterReports();
  
  const [report, setReport] = useState<DisasterReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);
  
  useEffect(() => {
    const loadReportDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const reportData = await fetchReportDetails(id);
        if (reportData) {
          setReport(reportData);
          await fetchReportNotes(id);
        } else {
          toast({
            title: "Error",
            description: "Report not found",
            variant: "destructive"
          });
          navigate('/admin');
        }
      } catch (error) {
        console.error("Error fetching report:", error);
        toast({
          title: "Error",
          description: "Failed to load report details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadReportDetails();
  }, [id, fetchReportDetails, navigate, toast, fetchReportNotes]);
  
  const handleStatusChange = async (status: string) => {
    if (!report) return;
    
    try {
      await updateReportStatus(report.id, status as any);
      setReport(prev => prev ? { ...prev, status: status as any } : null);
      toast({
        title: "Status Updated",
        description: `Report status changed to ${status}`,
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
  
  const handleAssign = async (assignTo: string) => {
    if (!report) return;
    
    try {
      await assignReport(report.id, assignTo as any);
      if (report.status === 'pending') {
        await updateReportStatus(report.id, 'assigned');
      }
      
      setReport(prev => 
        prev ? { 
          ...prev, 
          assignedTo: assignTo as any,
          status: prev.status === 'pending' ? 'assigned' : prev.status
        } : null
      );
      
      toast({
        title: "Assignment Updated",
        description: `Report assigned to ${assignTo}`,
      });
    } catch (error) {
      console.error("Error assigning report:", error);
      toast({
        title: "Assignment Failed",
        description: "Failed to assign report",
        variant: "destructive"
      });
    }
  };
  
  const handleAddNote = async () => {
    if (!report || !noteText.trim()) return;
    
    try {
      setSubmittingNote(true);
      await addNote(report.id, noteText);
      setNoteText("");
      toast({
        title: "Note Added",
        description: "Your note has been added to the report",
      });
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        title: "Failed to Add Note",
        description: "There was a problem adding your note",
        variant: "destructive"
      });
    } finally {
      setSubmittingNote(false);
    }
  };
  
  if (loading) {
    return (
      <DashboardLayout title="Report Details">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!report) {
    return (
      <DashboardLayout title="Report Not Found">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
          <p className="text-muted-foreground mb-6">The report you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/admin">Return to Dashboard</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  const getDisasterIcon = (type: string) => {
    switch (type) {
      case 'fire':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>;
      case 'flood':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5.34a2 2 0 0 1 .23-.9l6-10.94a2 2 0 0 1 3.54 0l6 10.94a2 2 0 0 1 .23.9z"/><path d="M4.34 15h15.32"/></svg>;
      case 'earthquake':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m2 12 6-6v4h8V6l6 6-6 6v-4H8v4l-6-6Z"/></svg>;
      case 'hurricane':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18.7 3.4c-.9.9-2.5 1.1-3.8.3-1.5-.8-3.3-.4-4.5.8s-1.6 3-1 4.5c.5 1.3.3 2.9-.7 3.9s-2.6 1.2-3.9.7c-1.5-.6-3.3-.2-4.5 1s-1.6 3-.8 4.5c.8 1.3.6 2.9-.3 3.9M7 16h.01M11 16h.01M16 16h.01M16 20h.01M11 20h.01M7 20h.01"/></svg>;
      case 'tsunami':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 16h20M3 16c0-2.1 1.8-4 4-4s4.4 1.5 6 4c1.6-2.5 3.8-4 6-4s3 1.9 3 4"/></svg>;
      case 'landslide':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m19.7 10.7-16 10c-.3.2-.7 0-.7-.4V4.3c0-.4.4-.6.7-.4l16 8.9c.3.1.3.5 0 .6Z"/></svg>;
      default:
        return <AlertCircle className="h-6 w-6 text-yellow-500" />;
    }
  };
  
  return (
    <DashboardLayout title="Report Details">
      {/* Back button */}
      <div className="mb-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main report details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getDisasterIcon(report.disasterType)}
                  <div>
                    <CardTitle className="text-xl capitalize">{report.disasterType} Disaster Report</CardTitle>
                    <CardDescription>Report ID: {report.id.slice(0, 8)}</CardDescription>
                  </div>
                </div>
                <StatusBadge status={report.status} />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p>{report.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Description</h3>
                    <p className="text-gray-600">{report.description}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Reported: {formatDate(report.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Last Updated: {formatDate(report.updatedAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Assigned To: {report.assignedTo === 'unassigned' ? 'Not Assigned' : report.assignedTo}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Images */}
              {report.imageUrls && report.imageUrls.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    <span>Submitted Images</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {report.imageUrls.map((url, index) => (
                      <div key={index} className="aspect-square rounded-md overflow-hidden">
                        <img 
                          src={url} 
                          alt={`Disaster ${index + 1}`} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Notes and communication */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Response Notes
              </CardTitle>
              <CardDescription>
                Add notes and updates about this disaster report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Add new note */}
                <div className="space-y-3">
                  <Textarea 
                    placeholder="Add a note about this disaster case..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleAddNote} 
                      disabled={!noteText.trim() || submittingNote}
                      className="gap-1"
                    >
                      <Send className="h-4 w-4" />
                      {submittingNote ? "Sending..." : "Add Note"}
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                {/* Notes list */}
                <div className="space-y-4">
                  {reportNotes && reportNotes.length > 0 ? (
                    reportNotes.map((note) => (
                      <div key={note.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {note.userName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{note.userName}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(note.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm">{note.text}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No notes yet</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Action Panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Action Panel</CardTitle>
              <CardDescription>Manage disaster response</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Assignment */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Assign Report</h3>
                <Select
                  value={report.assignedTo}
                  onValueChange={handleAssign}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose assignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    <SelectItem value="volunteer">Volunteer Team</SelectItem>
                    <SelectItem value="ndrf">NDRF Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Status Update */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Update Status</h3>
                <Select
                  value={report.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="dispatched">Dispatched</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              {/* Status Timeline */}
              <div>
                <h3 className="font-medium text-sm mb-3">Status Timeline</h3>
                <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-3 space-y-2">
                  <li className="mb-6 ml-6">
                    <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-white
                      ${report.status !== 'pending' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {report.status !== 'pending' ? <Check className="w-3 h-3" /> : '1'}
                    </span>
                    <h3 className="flex items-center mb-1 text-sm font-semibold">
                      Reported
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded ml-3">
                        Initial
                      </span>
                    </h3>
                    <time className="block mb-2 text-xs font-normal leading-none text-gray-500">
                      {formatDate(report.createdAt)}
                    </time>
                  </li>
                  
                  <li className="mb-6 ml-6">
                    <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-white
                      ${report.status !== 'pending' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {report.status !== 'pending' ? <Check className="w-3 h-3" /> : '2'}
                    </span>
                    <h3 className="flex items-center mb-1 text-sm font-semibold text-gray-900">
                      Assigned
                    </h3>
                    {report.status !== 'pending' && (
                      <time className="block mb-2 text-xs font-normal leading-none text-gray-500">
                        {formatDate(report.updatedAt)}
                      </time>
                    )}
                  </li>
                  
                  <li className="mb-6 ml-6">
                    <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-white
                      ${report.status === 'dispatched' || report.status === 'in-progress' || report.status === 'resolved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'}`}>
                      {report.status === 'dispatched' || report.status === 'in-progress' || report.status === 'resolved' 
                          ? <Check className="w-3 h-3" /> 
                          : '3'}
                    </span>
                    <h3 className="mb-1 text-sm font-semibold text-gray-900">Response In Progress</h3>
                  </li>
                  
                  <li className="ml-6">
                    <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-white
                      ${report.status === 'resolved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'}`}>
                      {report.status === 'resolved' 
                          ? <Check className="w-3 h-3" /> 
                          : '4'}
                    </span>
                    <h3 className="mb-1 text-sm font-semibold text-gray-900">Resolved</h3>
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportDetails;
