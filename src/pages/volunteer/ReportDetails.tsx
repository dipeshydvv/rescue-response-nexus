
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  Upload, 
  AlertCircle,
  ChevronLeft,
  Phone
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

const VolunteerReportDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const { 
    fetchReportDetails, 
    updateReportStatus, 
    addNote,
    addResponseImage,
    reportNotes,
    fetchReportNotes
  } = useDisasterReports();
  
  const [report, setReport] = useState<DisasterReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  
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
          navigate('/volunteer');
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
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!report || !e.target.files?.length) return;
    
    try {
      setUploadingImage(true);
      const file = e.target.files[0];
      await addResponseImage(report.id, file);
      
      toast({
        title: "Image Uploaded",
        description: "Your image has been added to the report",
      });
      
      // Reload report to get updated images
      const updatedReport = await fetchReportDetails(report.id);
      if (updatedReport) {
        setReport(updatedReport);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your image",
        variant: "destructive"
      });
    } finally {
      setUploadingImage(false);
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
            <Link to="/volunteer">Return to Dashboard</Link>
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
      default:
        return <AlertCircle className="h-6 w-6 text-yellow-500" />;
    }
  };
  
  return (
    <DashboardLayout title="Disaster Report Details">
      {/* Back button */}
      <div className="mb-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/volunteer')}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            {getDisasterIcon(report.disasterType)}
            <div>
              <h1 className="text-2xl font-bold capitalize">{report.disasterType} Disaster</h1>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{report.location}</span>
                <StatusBadge status={report.status} />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {report.status === 'assigned' && (
              <Button onClick={() => handleStatusChange('in-progress')}>
                Take Responsibility
              </Button>
            )}
            
            {report.status === 'in-progress' && (
              <Button onClick={() => handleStatusChange('resolved')}>
                Mark as Resolved
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="notes">Response Notes</TabsTrigger>
                  {report.imageUrls && report.imageUrls.length > 0 && (
                    <TabsTrigger value="images">Images</TabsTrigger>
                  )}
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent className="pt-6">
              <TabsContent value="details" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                    <p className="text-gray-700">{report.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Reported On</h3>
                      <p className="text-gray-700">{formatDate(report.createdAt)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h3>
                      <p className="text-gray-700">{formatDate(report.updatedAt)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Emergency Contacts */}
                <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg">
                  <h3 className="text-lg font-medium text-red-800 flex items-center gap-2 mb-2">
                    <Phone className="h-5 w-5" />
                    Emergency Contacts
                  </h3>
                  <div className="grid md:grid-cols-3 gap-3 text-sm">
                    <div className="p-3 bg-white rounded shadow-sm">
                      <p className="font-medium mb-1">National Emergency</p>
                      <p className="text-red-600 font-bold">112</p>
                    </div>
                    <div className="p-3 bg-white rounded shadow-sm">
                      <p className="font-medium mb-1">NDRF Helpline</p>
                      <p className="text-red-600 font-bold">1078</p>
                    </div>
                    <div className="p-3 bg-white rounded shadow-sm">
                      <p className="font-medium mb-1">Medical Emergency</p>
                      <p className="text-red-600 font-bold">108</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="notes">
                <div className="space-y-6">
                  {/* Add new note */}
                  <div className="space-y-3">
                    <Textarea 
                      placeholder="Add updates, observations, or requests for assistance..."
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
                  
                  {/* Response Image Upload */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Add Response Image</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Input
                        id="response-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-2">Upload photos from the disaster site</p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('response-image')?.click()}
                        disabled={uploadingImage}
                      >
                        {uploadingImage ? "Uploading..." : "Select Image"}
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Notes list */}
                  <div>
                    <h3 className="text-sm font-medium mb-4">Response Timeline</h3>
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
                </div>
              </TabsContent>
              
              <TabsContent value="images">
                <div className="space-y-6">
                  {/* Disaster Images */}
                  {report.imageUrls && report.imageUrls.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-3">Disaster Images</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {report.imageUrls.map((url, index) => (
                          <div key={index} className="aspect-video rounded-md overflow-hidden">
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
                  
                  {/* Response Images */}
                  {report.responseImages && report.responseImages.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-3">Response Images</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {report.responseImages.map((url, index) => (
                          <div key={index} className="aspect-video rounded-md overflow-hidden">
                            <img 
                              src={url} 
                              alt={`Response ${index + 1}`} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </div>
        
        <div>
          {/* Action Panel */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Status Update</CardTitle>
              <CardDescription>Update the status of this disaster</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select
                  value={report.status}
                  onValueChange={handleStatusChange}
                  disabled={report.status === 'pending'}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="text-xs text-muted-foreground">
                  {report.status === 'assigned' && 
                    "Take responsibility to start working on this disaster response"
                  }
                  {report.status === 'in-progress' && 
                    "Mark as resolved once the situation is handled"
                  }
                  {report.status === 'resolved' && 
                    "This disaster case has been marked as resolved"
                  }
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Response Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative border-l border-gray-200 ml-3 space-y-6">
                <li className="ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
                    <Check className="w-3 h-3 text-green-800" />
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
                
                <li className="ml-6">
                  <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-white
                    ${report.status !== 'pending' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {report.status !== 'pending' ? <Check className="w-3 h-3 text-green-800" /> : '2'}
                  </span>
                  <h3 className="mb-1 text-sm font-semibold text-gray-900">Assigned</h3>
                  {report.status !== 'pending' && (
                    <p className="text-xs text-gray-500">
                      Assigned to volunteer team
                    </p>
                  )}
                </li>
                
                <li className="ml-6">
                  <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-white
                    ${report.status === 'in-progress' || report.status === 'resolved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'}`}>
                    {report.status === 'in-progress' || report.status === 'resolved' 
                        ? <Check className="w-3 h-3 text-green-800" /> 
                        : '3'}
                  </span>
                  <h3 className="mb-1 text-sm font-semibold text-gray-900">In Progress</h3>
                  {(report.status === 'in-progress' || report.status === 'resolved') && (
                    <p className="text-xs text-gray-500">
                      Response team working on site
                    </p>
                  )}
                </li>
                
                <li className="ml-6">
                  <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-white
                    ${report.status === 'resolved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'}`}>
                    {report.status === 'resolved' 
                        ? <Check className="w-3 h-3 text-green-800" /> 
                        : '4'}
                  </span>
                  <h3 className="mb-1 text-sm font-semibold text-gray-900">Resolved</h3>
                  {report.status === 'resolved' && (
                    <p className="text-xs text-gray-500">
                      Disaster response completed
                    </p>
                  )}
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VolunteerReportDetails;
