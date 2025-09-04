import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, MapPin, Sprout, User, Phone, Globe } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";

interface ProfileEditorProps {
  onClose: () => void;
}

const cropOptions = [
  "Maize", "Cassava", "Tomato", "Beans", "Rice", "Yam", "Plantain", "Cocoa", 
  "Coffee", "Cotton", "Groundnut", "Soybean", "Millet", "Sorghum", "Sweet Potato",
  "Pepper", "Onion", "Okra", "Cucumber", "Watermelon", "Pineapple", "Banana"
];

const experienceLevels = [
  { value: "beginner", label: "Beginner (0-2 years)" },
  { value: "intermediate", label: "Intermediate (3-7 years)" },
  { value: "advanced", label: "Advanced (8+ years)" }
];

const regions = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

const audioLanguages = [
  { value: "english", label: "English" },
  { value: "hausa", label: "Hausa" },
  { value: "yoruba", label: "Yoruba" },
  { value: "igbo", label: "Igbo" },
  { value: "french", label: "French" },
  { value: "fula", label: "Fula" },
  { value: "twi", label: "Twi" },
  { value: "akan", label: "Akan" }
];

export function ProfileEditor({ onClose }: ProfileEditorProps) {
  const { profile, updateProfile, loading } = useProfile();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    region: '',
    bio: '',
    farming_experience: '',
    primary_crops: [] as string[],
    farm_size_hectares: '',
    audio_language: 'english',
    notification_preferences: {
      tips: true,
      alerts: true,
      reminders: true
    }
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone_number: (profile as any).phone_number || '',
        region: (profile as any).region || '',
        bio: (profile as any).bio || '',
        farming_experience: (profile as any).farming_experience || '',
        primary_crops: (profile as any).primary_crops || [],
        farm_size_hectares: (profile as any).farm_size_hectares?.toString() || '',
        audio_language: (profile as any).audio_language || 'english',
        notification_preferences: (profile as any).notification_preferences || {
          tips: true,
          alerts: true,
          reminders: true
        }
      });
    }
  }, [profile]);

  const handleCropToggle = (crop: string) => {
    setFormData(prev => ({
      ...prev,
      primary_crops: prev.primary_crops.includes(crop)
        ? prev.primary_crops.filter(c => c !== crop)
        : [...prev.primary_crops, crop]
    }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      notification_preferences: {
        ...prev.notification_preferences,
        [key]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updateData = {
      full_name: formData.full_name,
      email: formData.email,
      phone_number: formData.phone_number,
      region: formData.region,
      bio: formData.bio,
      farming_experience: formData.farming_experience,
      primary_crops: formData.primary_crops,
      farm_size_hectares: formData.farm_size_hectares ? parseFloat(formData.farm_size_hectares) : null,
      audio_language: formData.audio_language,
      notification_preferences: formData.notification_preferences
    };

    const success = await updateProfile(updateData);
    setIsSaving(false);

    if (success) {
      toast({
        title: "Profile Updated",
        description: "Your farming profile has been successfully updated.",
      });
      onClose();
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <p className="text-muted-foreground">Update your farming profile and preferences</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <User className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Personal Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                placeholder="+234 xxx xxx xxxx"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="region">Region/State</Label>
              <Select value={formData.region} onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about yourself and your farming journey..."
                rows={3}
              />
            </div>
          </div>
        </Card>

        {/* Farming Information */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Sprout className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Farming Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="farming_experience">Experience Level</Label>
              <Select value={formData.farming_experience} onValueChange={(value) => setFormData(prev => ({ ...prev, farming_experience: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="farm_size">Farm Size (Hectares)</Label>
              <Input
                id="farm_size"
                type="number"
                step="0.1"
                min="0"
                value={formData.farm_size_hectares}
                onChange={(e) => setFormData(prev => ({ ...prev, farm_size_hectares: e.target.value }))}
                placeholder="e.g., 2.5"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label>Primary Crops</Label>
              <p className="text-sm text-muted-foreground mb-3">Select the crops you primarily grow</p>
              <div className="flex flex-wrap gap-2">
                {cropOptions.map((crop) => (
                  <Badge
                    key={crop}
                    variant={formData.primary_crops.includes(crop) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleCropToggle(crop)}
                  >
                    {crop}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Preferences</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="audio_language">Audio Language</Label>
              <Select value={formData.audio_language} onValueChange={(value) => setFormData(prev => ({ ...prev, audio_language: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {audioLanguages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              <Label>Notification Preferences</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Daily Tips</p>
                    <p className="text-sm text-muted-foreground">Receive farming tips and advice</p>
                  </div>
                  <Switch
                    checked={formData.notification_preferences.tips}
                    onCheckedChange={(checked) => handleNotificationChange('tips', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Alerts</p>
                    <p className="text-sm text-muted-foreground">Weather and seasonal alerts</p>
                  </div>
                  <Switch
                    checked={formData.notification_preferences.alerts}
                    onCheckedChange={(checked) => handleNotificationChange('alerts', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Reminders</p>
                    <p className="text-sm text-muted-foreground">Planting and care reminders</p>
                  </div>
                  <Switch
                    checked={formData.notification_preferences.reminders}
                    onCheckedChange={(checked) => handleNotificationChange('reminders', checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}