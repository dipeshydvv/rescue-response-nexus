
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarLayout from "@/components/layouts/NavbarLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { AlertTriangle, Upload, CheckCircle2 } from "lucide-react";
import { DisasterType } from "@/lib/types";
import { useDisasterReports } from "@/contexts/DisasterReportContext";

const ReportDisaster = () => {
  const navigate = useNavigate();
  const { createReport } = useDisasterReports();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    disasterType: "flood" as DisasterType,
    location: "",
    description: "",
    images: [] as File[]
  });
  
  const handleDisasterTypeChange = (value: string) => {
    setFormData({
      ...formData,
      disasterType: value as DisasterType
    });
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...selectedFiles]
      }));
    }
  };
  
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.location) {
      toast({
        title: "Location is required",
        description: "Please provide the location of the disaster",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.description) {
      toast({
        title: "Description is required",
        description: "Please provide details about the disaster",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const reportId = await createReport(
        formData.disasterType,
        formData.location,
        formData.description,
        formData.images
      );
      
      setSuccess(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: "Submission Error",
        description: "There was a problem submitting your report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (success) {
    return (
      <NavbarLayout title="Report a Disaster">
        <div className="max-w-2xl mx-auto mt-8 p-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Report Submitted Successfully</h2>
            <p className="text-gray-600 mb-6">
              Thank you for reporting this disaster. Your information has been received and will be processed by our team.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              You will be redirected to the home page in a few seconds...
            </p>
            <Button onClick={() => navigate('/')}>Return to Home</Button>
          </div>
        </div>
      </NavbarLayout>
    );
  }
  
  return (
    <NavbarLayout title="Report a Disaster">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-primary p-6 text-white">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Report a Disaster</h1>
          </div>
          <p className="mt-2 text-primary-foreground">
            Fill out this form to report a disaster situation that needs attention
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Disaster Type */}
          <div>
            <Label className="text-lg font-medium mb-2 block">Disaster Type</Label>
            <RadioGroup 
              defaultValue="flood" 
              value={formData.disasterType}
              onValueChange={handleDisasterTypeChange}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="flood" id="flood" />
                <Label htmlFor="flood">Flood</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fire" id="fire" />
                <Label htmlFor="fire">Fire</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="earthquake" id="earthquake" />
                <Label htmlFor="earthquake">Earthquake</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hurricane" id="hurricane" />
                <Label htmlFor="hurricane">Hurricane/Cyclone</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tsunami" id="tsunami" />
                <Label htmlFor="tsunami">Tsunami</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="landslide" id="landslide" />
                <Label htmlFor="landslide">Landslide</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Location */}
          <div>
            <Label htmlFor="location" className="text-lg font-medium mb-2 block">Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="Enter the disaster location (area, city, landmark)"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
          
          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-lg font-medium mb-2 block">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the disaster situation, severity, and any immediate needs"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
              className="w-full"
            />
          </div>
          
          {/* Image Upload */}
          <div>
            <Label htmlFor="images" className="text-lg font-medium mb-2 block">Upload Images (Optional)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-2">Drag and drop images or click to browse</p>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('images')?.click()}
              >
                Browse Files
              </Button>
            </div>
            
            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="mt-4">
                <Label className="text-sm font-medium block mb-2">Selected Images</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        className="h-24 w-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </div>
    </NavbarLayout>
  );
};

export default ReportDisaster;
