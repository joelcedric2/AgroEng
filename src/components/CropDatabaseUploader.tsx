import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Database, Loader2, Check, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface CropData {
  name: string;
  scientific_name: string;
  description: string;
  category: string;
  planting_season: string;
  harvest_season: string;
  growing_conditions: any;
  nutrition_info: any;
  market_info: any;
}

interface DiseaseData {
  name: string;
  scientific_name: string;
  description: string;
  symptoms: string;
  causes: string;
  prevention: string;
  treatment: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const CropDatabaseUploader: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadResults, setUploadResults] = useState<any>(null);
  const { toast } = useToast();

  // Single crop upload
  const [cropData, setCropData] = useState<CropData>({
    name: '',
    scientific_name: '',
    description: '',
    category: '',
    planting_season: '',
    harvest_season: '',
    growing_conditions: {},
    nutrition_info: {},
    market_info: {}
  });

  // Single disease upload
  const [diseaseData, setDiseaseData] = useState<DiseaseData>({
    name: '',
    scientific_name: '',
    description: '',
    symptoms: '',
    causes: '',
    prevention: '',
    treatment: '',
    severity: 'medium'
  });

  // Bulk upload state
  const [csvData, setCsvData] = useState<string>('');
  const [jsonData, setJsonData] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const handleSingleCropUpload = async () => {
    try {
      setIsUploading(true);
      setUploadStatus('uploading');

      const { data, error } = await supabase
        .from('crops')
        .insert([cropData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Crop Added",
        description: `${cropData.name} has been added to the database.`,
      });

      setCropData({
        name: '',
        scientific_name: '',
        description: '',
        category: '',
        planting_season: '',
        harvest_season: '',
        growing_conditions: {},
        nutrition_info: {},
        market_info: {}
      });

      setUploadStatus('success');
    } catch (error: any) {
      console.error('Error uploading crop:', error);
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive"
      });
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSingleDiseaseUpload = async () => {
    try {
      setIsUploading(true);
      setUploadStatus('uploading');

      const { data, error } = await supabase
        .from('diseases')
        .insert([diseaseData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Disease Added",
        description: `${diseaseData.name} has been added to the database.`,
      });

      setDiseaseData({
        name: '',
        scientific_name: '',
        description: '',
        symptoms: '',
        causes: '',
        prevention: '',
        treatment: '',
        severity: 'medium'
      });

      setUploadStatus('success');
    } catch (error: any) {
      console.error('Error uploading disease:', error);
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive"
      });
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBulkCsvUpload = async () => {
    try {
      setIsUploading(true);
      setUploadStatus('uploading');
      setUploadProgress(0);

      // Parse CSV data
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const crops = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const crop: any = {};
        
        headers.forEach((header, index) => {
          crop[header] = values[index] || '';
        });
        
        crops.push(crop);
        setUploadProgress((i / lines.length) * 100);
      }

      const { data, error } = await supabase
        .from('crops')
        .insert(crops)
        .select();

      if (error) throw error;

      setUploadResults({ crops: data?.length || 0, diseases: 0 });
      setUploadStatus('success');
      setCsvData('');

      toast({
        title: "Bulk Upload Complete",
        description: `Successfully uploaded ${data?.length || 0} crops.`,
      });

    } catch (error: any) {
      console.error('Error bulk uploading:', error);
      toast({
        title: "Bulk Upload Failed",
        description: error.message,
        variant: "destructive"
      });
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleJsonUpload = async () => {
    try {
      setIsUploading(true);
      setUploadStatus('uploading');

      const data = JSON.parse(jsonData);
      let cropsUploaded = 0;
      let diseasesUploaded = 0;

      if (data.crops) {
        const { data: cropData, error: cropError } = await supabase
          .from('crops')
          .insert(data.crops)
          .select();
        
        if (cropError) throw cropError;
        cropsUploaded = cropData?.length || 0;
      }

      if (data.diseases) {
        const { data: diseaseData, error: diseaseError } = await supabase
          .from('diseases')
          .insert(data.diseases)
          .select();
        
        if (diseaseError) throw diseaseError;
        diseasesUploaded = diseaseData?.length || 0;
      }

      setUploadResults({ crops: cropsUploaded, diseases: diseasesUploaded });
      setUploadStatus('success');
      setJsonData('');

      toast({
        title: "JSON Upload Complete",
        description: `Uploaded ${cropsUploaded} crops and ${diseasesUploaded} diseases.`,
      });

    } catch (error: any) {
      console.error('Error uploading JSON:', error);
      toast({
        title: "JSON Upload Failed",
        description: error.message,
        variant: "destructive"
      });
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async () => {
    if (selectedImages.length === 0) return;

    try {
      setIsUploading(true);
      setUploadStatus('uploading');
      let uploadedCount = 0;

      for (const image of selectedImages) {
        setUploadProgress((uploadedCount / selectedImages.length) * 100);

        // Upload to storage
        const fileName = `${Date.now()}-${image.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('crop-images')
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('crop-images')
          .getPublicUrl(fileName);

        // Analyze image with AI
        const { data: analysisData, error: analysisError } = await supabase.functions
          .invoke('crop-image-analysis', {
            body: {
              imageUrl: urlData.publicUrl,
              description: image.name
            }
          });

        if (analysisError) {
          console.error('Analysis failed:', analysisError);
        }

        uploadedCount++;
      }

      setUploadResults({ images: uploadedCount });
      setUploadStatus('success');
      setSelectedImages([]);

      toast({
        title: "Images Uploaded",
        description: `Successfully uploaded and analyzed ${uploadedCount} images.`,
      });

    } catch (error: any) {
      console.error('Error uploading images:', error);
      toast({
        title: "Image Upload Failed",
        description: error.message,
        variant: "destructive"
      });
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <Database className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h1 className="text-3xl font-bold">Crop Database Uploader</h1>
        <p className="text-muted-foreground">Upload your crop data, diseases, and images</p>
      </div>

      {/* Single Crop Upload */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Add Single Crop</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="crop-name">Crop Name *</Label>
            <Input
              id="crop-name"
              value={cropData.name}
              onChange={(e) => setCropData({...cropData, name: e.target.value})}
              placeholder="e.g., Tomato"
            />
          </div>
          <div>
            <Label htmlFor="scientific-name">Scientific Name</Label>
            <Input
              id="scientific-name"
              value={cropData.scientific_name}
              onChange={(e) => setCropData({...cropData, scientific_name: e.target.value})}
              placeholder="e.g., Solanum lycopersicum"
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={(value) => setCropData({...cropData, category: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vegetables">Vegetables</SelectItem>
                <SelectItem value="fruits">Fruits</SelectItem>
                <SelectItem value="grains">Grains</SelectItem>
                <SelectItem value="legumes">Legumes</SelectItem>
                <SelectItem value="herbs">Herbs</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="planting-season">Planting Season</Label>
            <Input
              id="planting-season"
              value={cropData.planting_season}
              onChange={(e) => setCropData({...cropData, planting_season: e.target.value})}
              placeholder="e.g., Spring"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={cropData.description}
              onChange={(e) => setCropData({...cropData, description: e.target.value})}
              placeholder="Detailed description of the crop"
              rows={3}
            />
          </div>
        </div>
        <Button 
          onClick={handleSingleCropUpload} 
          disabled={isUploading || !cropData.name}
          className="mt-4"
        >
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
          Add Crop
        </Button>
      </Card>

      {/* Single Disease Upload */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Add Single Disease</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="disease-name">Disease Name *</Label>
            <Input
              id="disease-name"
              value={diseaseData.name}
              onChange={(e) => setDiseaseData({...diseaseData, name: e.target.value})}
              placeholder="e.g., Late Blight"
            />
          </div>
          <div>
            <Label htmlFor="severity">Severity</Label>
            <Select onValueChange={(value: any) => setDiseaseData({...diseaseData, severity: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="symptoms">Symptoms</Label>
            <Textarea
              id="symptoms"
              value={diseaseData.symptoms}
              onChange={(e) => setDiseaseData({...diseaseData, symptoms: e.target.value})}
              placeholder="Describe the symptoms"
              rows={2}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="treatment">Treatment</Label>
            <Textarea
              id="treatment"
              value={diseaseData.treatment}
              onChange={(e) => setDiseaseData({...diseaseData, treatment: e.target.value})}
              placeholder="Treatment recommendations"
              rows={2}
            />
          </div>
        </div>
        <Button 
          onClick={handleSingleDiseaseUpload} 
          disabled={isUploading || !diseaseData.name}
          className="mt-4"
        >
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
          Add Disease
        </Button>
      </Card>

      {/* Bulk CSV Upload */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Bulk CSV Upload</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="csv-data">CSV Data</Label>
            <Textarea
              id="csv-data"
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              placeholder="Paste your CSV data here (name,scientific_name,description,category,...)"
              rows={8}
            />
          </div>
          <Button 
            onClick={handleBulkCsvUpload} 
            disabled={isUploading || !csvData.trim()}
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
            Upload CSV Data
          </Button>
        </div>
      </Card>

      {/* JSON Upload */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">JSON Data Upload</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="json-data">JSON Data</Label>
            <Textarea
              id="json-data"
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              placeholder='{"crops": [...], "diseases": [...]}'
              rows={8}
            />
          </div>
          <Button 
            onClick={handleJsonUpload} 
            disabled={isUploading || !jsonData.trim()}
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
            Upload JSON Data
          </Button>
        </div>
      </Card>

      {/* Image Upload */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Image Upload & AI Analysis</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="images">Select Images</Label>
            <Input
              id="images"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setSelectedImages(Array.from(e.target.files || []))}
            />
          </div>
          {selectedImages.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {selectedImages.length} image(s) selected
            </p>
          )}
          <Button 
            onClick={handleImageUpload} 
            disabled={isUploading || selectedImages.length === 0}
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
            Upload & Analyze Images
          </Button>
        </div>
      </Card>

      {/* Progress and Status */}
      {isUploading && uploadProgress > 0 && (
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Uploading... {Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="mt-2" />
        </Card>
      )}

      {uploadStatus === 'success' && uploadResults && (
        <Card className="p-4 border-green-200 bg-green-50">
          <div className="flex items-center space-x-2 text-green-800">
            <Check className="h-4 w-4" />
            <span>Upload Successful!</span>
          </div>
          {uploadResults.crops && <p>Crops uploaded: {uploadResults.crops}</p>}
          {uploadResults.diseases && <p>Diseases uploaded: {uploadResults.diseases}</p>}
          {uploadResults.images && <p>Images uploaded: {uploadResults.images}</p>}
        </Card>
      )}

      {uploadStatus === 'error' && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <span>Upload Failed. Please check your data and try again.</span>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CropDatabaseUploader;