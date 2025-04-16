
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { db, storage } from "@/lib/firebase";
import { 
  collection, 
  query, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc, 
  Timestamp, 
  where 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { DisasterReport, ReportStatus, AssignedTo, DisasterType, ResponseNote } from "@/lib/types";
import { useAuth } from "./AuthContext";

interface DisasterReportContextProps {
  reports: DisasterReport[];
  userReports: DisasterReport[];
  loading: boolean;
  createReport: (
    disasterType: DisasterType,
    location: string,
    description: string,
    images: File[]
  ) => Promise<string>;
  updateReportStatus: (reportId: string, status: ReportStatus) => Promise<void>;
  assignReport: (reportId: string, assignTo: AssignedTo, userId?: string) => Promise<void>;
  addNote: (reportId: string, text: string) => Promise<void>;
  addResponseImage: (reportId: string, image: File) => Promise<void>;
  fetchReportDetails: (reportId: string) => Promise<DisasterReport | null>;
  reportNotes: ResponseNote[];
  fetchReportNotes: (reportId: string) => Promise<void>;
}

const DisasterReportContext = createContext<DisasterReportContextProps | undefined>(undefined);

export function useDisasterReports() {
  const context = useContext(DisasterReportContext);
  if (context === undefined) {
    throw new Error("useDisasterReports must be used within a DisasterReportProvider");
  }
  return context;
}

export function DisasterReportProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<DisasterReport[]>([]);
  const [userReports, setUserReports] = useState<DisasterReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportNotes, setReportNotes] = useState<ResponseNote[]>([]);
  const { userProfile } = useAuth();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const reportsRef = collection(db, "reports");
      const q = query(reportsRef);
      const querySnapshot = await getDocs(q);

      const fetchedReports: DisasterReport[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedReports.push({
          id: doc.id,
          disasterType: data.disasterType,
          location: data.location,
          description: data.description,
          imageUrls: data.imageUrls || [],
          status: data.status,
          assignedTo: data.assignedTo,
          assignedUserId: data.assignedUserId,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          notes: data.notes || [],
          responseImages: data.responseImages || []
        });
      });

      setReports(fetchedReports);
      
      // If user is logged in, filter for user-specific reports
      if (userProfile) {
        let userSpecificReports: DisasterReport[] = [];
        
        if (userProfile.role === 'admin') {
          userSpecificReports = fetchedReports;
        } else if (userProfile.role === 'volunteer') {
          userSpecificReports = fetchedReports.filter(
            report => report.assignedTo === 'volunteer' && 
                    (report.assignedUserId === userProfile.id || report.assignedUserId === undefined)
          );
        } else if (userProfile.role === 'ndrf') {
          userSpecificReports = fetchedReports.filter(
            report => report.assignedTo === 'ndrf'
          );
        }
        
        setUserReports(userSpecificReports);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [userProfile]);

  const createReport = async (
    disasterType: DisasterType,
    location: string,
    description: string,
    images: File[]
  ): Promise<string> => {
    try {
      // Upload images if any
      const imageUrls: string[] = [];
      
      if (images.length > 0) {
        for (const image of images) {
          const randomId = Math.random().toString(36).substring(2, 15);
          const filename = `${randomId}-${image.name}`;
          const storageRef = ref(storage, `disaster-images/${filename}`);
          await uploadBytes(storageRef, image);
          const downloadUrl = await getDownloadURL(storageRef);
          imageUrls.push(downloadUrl);
        }
      }
      
      // Create the report record
      const now = Timestamp.now();
      const reportData: Omit<DisasterReport, 'id'> = {
        disasterType,
        location,
        description,
        imageUrls,
        status: 'pending',
        assignedTo: 'unassigned',
        createdAt: now.toDate(),
        updatedAt: now.toDate()
      };
      
      const docRef = await addDoc(collection(db, "reports"), {
        ...reportData,
        createdAt: now,
        updatedAt: now
      });
      
      // Add the new report to state
      setReports(prev => [
        ...prev,
        { ...reportData, id: docRef.id }
      ]);
      
      return docRef.id;
    } catch (error) {
      console.error("Error creating report:", error);
      throw error;
    }
  };

  const updateReportStatus = async (reportId: string, status: ReportStatus) => {
    try {
      const reportRef = doc(db, "reports", reportId);
      await updateDoc(reportRef, {
        status,
        updatedAt: Timestamp.now()
      });
      
      // Update local state
      setReports(prev => 
        prev.map(report => 
          report.id === reportId 
            ? { ...report, status, updatedAt: new Date() } 
            : report
        )
      );
      
      setUserReports(prev => 
        prev.map(report => 
          report.id === reportId 
            ? { ...report, status, updatedAt: new Date() } 
            : report
        )
      );
    } catch (error) {
      console.error("Error updating report status:", error);
      throw error;
    }
  };

  const assignReport = async (reportId: string, assignTo: AssignedTo, userId?: string) => {
    try {
      const reportRef = doc(db, "reports", reportId);
      
      const updateData: any = {
        assignedTo: assignTo,
        updatedAt: Timestamp.now()
      };
      
      if (userId) {
        updateData.assignedUserId = userId;
      } else if (assignTo === 'unassigned') {
        // Remove assignedUserId if unassigning
        updateData.assignedUserId = null;
      }
      
      await updateDoc(reportRef, updateData);
      
      // Update local state
      const updateReportState = (reports: DisasterReport[]) =>
        reports.map(report => 
          report.id === reportId 
            ? { 
                ...report, 
                assignedTo: assignTo, 
                assignedUserId: userId,
                updatedAt: new Date() 
              } 
            : report
        );
        
      setReports(prev => updateReportState(prev));
      setUserReports(prev => updateReportState(prev));
    } catch (error) {
      console.error("Error assigning report:", error);
      throw error;
    }
  };

  const addNote = async (reportId: string, text: string) => {
    if (!userProfile) throw new Error("User must be logged in to add notes");
    
    try {
      // Create note in notes collection
      const noteData = {
        reportId,
        userId: userProfile.id,
        userName: userProfile.name,
        text,
        timestamp: Timestamp.now()
      };
      
      await addDoc(collection(db, "notes"), noteData);
      
      // Fetch the updated notes
      await fetchReportNotes(reportId);
    } catch (error) {
      console.error("Error adding note:", error);
      throw error;
    }
  };

  const addResponseImage = async (reportId: string, image: File) => {
    try {
      // Upload image
      const randomId = Math.random().toString(36).substring(2, 15);
      const filename = `${randomId}-${image.name}`;
      const storageRef = ref(storage, `response-images/${filename}`);
      await uploadBytes(storageRef, image);
      const downloadUrl = await getDownloadURL(storageRef);
      
      // Get current report
      const reportRef = doc(db, "reports", reportId);
      const reportDoc = await getDoc(reportRef);
      
      if (!reportDoc.exists()) {
        throw new Error("Report not found");
      }
      
      const reportData = reportDoc.data();
      const responseImages = reportData.responseImages || [];
      
      // Add new image URL
      await updateDoc(reportRef, {
        responseImages: [...responseImages, downloadUrl],
        updatedAt: Timestamp.now()
      });
      
      // Update local state
      const updateReportImages = (reports: DisasterReport[]) =>
        reports.map(report => 
          report.id === reportId 
            ? { 
                ...report, 
                responseImages: [...(report.responseImages || []), downloadUrl],
                updatedAt: new Date() 
              } 
            : report
        );
        
      setReports(prev => updateReportImages(prev));
      setUserReports(prev => updateReportImages(prev));
    } catch (error) {
      console.error("Error adding response image:", error);
      throw error;
    }
  };

  const fetchReportDetails = async (reportId: string): Promise<DisasterReport | null> => {
    try {
      const reportRef = doc(db, "reports", reportId);
      const reportDoc = await getDoc(reportRef);
      
      if (!reportDoc.exists()) {
        return null;
      }
      
      const data = reportDoc.data();
      return {
        id: reportDoc.id,
        disasterType: data.disasterType,
        location: data.location,
        description: data.description,
        imageUrls: data.imageUrls || [],
        status: data.status,
        assignedTo: data.assignedTo,
        assignedUserId: data.assignedUserId,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        notes: data.notes || [],
        responseImages: data.responseImages || []
      };
    } catch (error) {
      console.error("Error fetching report details:", error);
      return null;
    }
  };

  const fetchReportNotes = async (reportId: string) => {
    try {
      const notesRef = collection(db, "notes");
      const q = query(notesRef, where("reportId", "==", reportId));
      const querySnapshot = await getDocs(q);
      
      const notes: ResponseNote[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notes.push({
          id: doc.id,
          reportId: data.reportId,
          userId: data.userId,
          userName: data.userName,
          text: data.text,
          timestamp: data.timestamp.toDate()
        });
      });
      
      // Sort by timestamp, latest first
      notes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      setReportNotes(notes);
    } catch (error) {
      console.error("Error fetching report notes:", error);
    }
  };

  const value = {
    reports,
    userReports,
    loading,
    createReport,
    updateReportStatus,
    assignReport,
    addNote,
    addResponseImage,
    fetchReportDetails,
    reportNotes,
    fetchReportNotes
  };

  return (
    <DisasterReportContext.Provider value={value}>
      {children}
    </DisasterReportContext.Provider>
  );
}
