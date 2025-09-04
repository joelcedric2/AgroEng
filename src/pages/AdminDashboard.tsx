import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Activity, 
  Scan, 
  TrendingUp, 
  Database, 
  Bug, 
  MessageSquare, 
  CreditCard, 
  Volume2, 
  Brain, 
  Settings,
  Search,
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
  BarChart3,
  PieChart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  // Mock data - replace with real data from your backend
  const dashboardMetrics = {
    totalUsers: 2547,
    activeMonthlyUsers: 1823,
    dailyScans: 127,
    aiSuccessRate: 87.5,
    topCrops: ['Cassava', 'Maize', 'Rice', 'Yam', 'Beans']
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Badge variant="outline" className="text-primary">
          AgroEng AI Management
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 gap-1 h-auto p-1">
          <TabsTrigger value="overview" className="flex flex-col items-center gap-1 p-2">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="crops" className="flex flex-col items-center gap-1 p-2">
            <Database className="h-4 w-4" />
            <span className="text-xs">Crops</span>
          </TabsTrigger>
          <TabsTrigger value="diseases" className="flex flex-col items-center gap-1 p-2">
            <Bug className="h-4 w-4" />
            <span className="text-xs">Diseases</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex flex-col items-center gap-1 p-2">
            <Users className="h-4 w-4" />
            <span className="text-xs">Users</span>
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex flex-col items-center gap-1 p-2">
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs">Feedback</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex flex-col items-center gap-1 p-2">
            <CreditCard className="h-4 w-4" />
            <span className="text-xs">Billing</span>
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex flex-col items-center gap-1 p-2">
            <Volume2 className="h-4 w-4" />
            <span className="text-xs">Audio</span>
          </TabsTrigger>
          <TabsTrigger value="training" className="flex flex-col items-center gap-1 p-2">
            <Brain className="h-4 w-4" />
            <span className="text-xs">AI Training</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex flex-col items-center gap-1 p-2">
            <Settings className="h-4 w-4" />
            <span className="text-xs">Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* 1. Dashboard Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{dashboardMetrics.totalUsers.toLocaleString()}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Active</p>
                  <p className="text-2xl font-bold">{dashboardMetrics.activeMonthlyUsers.toLocaleString()}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-2">
                <Scan className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Daily Scans</p>
                  <p className="text-2xl font-bold">{dashboardMetrics.dailyScans}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">AI Success Rate</p>
                  <p className="text-2xl font-bold">{dashboardMetrics.aiSuccessRate}%</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top 5 Crops Scanned</h3>
            <div className="space-y-2">
              {dashboardMetrics.topCrops.map((crop, index) => (
                <div key={crop} className="flex items-center justify-between">
                  <span>{index + 1}. {crop}</span>
                  <Badge variant="secondary">{Math.floor(Math.random() * 100 + 50)} scans</Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* 2. Crop Database Management */}
        <TabsContent value="crops" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Crop Database Management</h2>
            <div className="flex gap-2">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Crop
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Upload
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <Input placeholder="Search crops..." className="max-w-sm" />
          </div>

          <Card className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Cassava', 'Maize', 'Rice', 'Yam', 'Beans', 'Cocoa'].map((crop) => (
                  <Card key={crop} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{crop}</h4>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Scientific name: Manihot esculenta</p>
                    <Badge variant="secondary" className="mt-2">5 diseases tracked</Badge>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 3. Disease Management */}
        <TabsContent value="diseases" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Disease & Diagnosis Management</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Disease
            </Button>
          </div>

          <Card className="p-6">
            <div className="space-y-4">
              {['Cassava Mosaic Disease', 'Maize Streak Virus', 'Rice Blast', 'Yam Anthracnose'].map((disease) => (
                <div key={disease} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{disease}</h4>
                    <p className="text-sm text-muted-foreground">Affects multiple crops</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">Viral</Badge>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* 4. User Management */}
        <TabsContent value="users" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">User Management</h2>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <Input placeholder="Search users..." className="max-w-sm" />
            </div>
          </div>

          <Card className="p-6">
            <div className="space-y-4">
              {[
                { name: 'John Farmer', email: 'john@example.com', scans: 45, region: 'Northern Nigeria' },
                { name: 'Mary Agric', email: 'mary@example.com', scans: 32, region: 'Southern Ghana' },
                { name: 'Ahmed Hassan', email: 'ahmed@example.com', scans: 67, region: 'Central Mali' }
              ].map((user) => (
                <div key={user.email} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{user.name}</h4>
                    <p className="text-sm text-muted-foreground">{user.email} • {user.region}</p>
                    <p className="text-sm">{user.scans} scans completed</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Active</Badge>
                    <Button size="sm" variant="outline">Manage</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* 5. Feedback & Crowdsourcing */}
        <TabsContent value="feedback" className="space-y-6">
          <h2 className="text-2xl font-bold">Feedback & Crowdsourcing Review</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Pending Reviews</h3>
              <p className="text-2xl font-bold">127</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Positive Feedback</h3>
              <p className="text-2xl font-bold text-green-600">89%</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Flagged Content</h3>
              <p className="text-2xl font-bold text-red-600">23</p>
            </Card>
          </div>

          <Card className="p-6">
            <div className="space-y-4">
              {[
                { crop: 'Cassava', confidence: 92, feedback: 'Helpful', region: 'Nigeria' },
                { crop: 'Maize', confidence: 78, feedback: 'Not helpful', region: 'Ghana' },
                { crop: 'Rice', confidence: 95, feedback: 'Very helpful', region: 'Mali' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{item.crop} diagnosis</h4>
                    <p className="text-sm text-muted-foreground">{item.region} • {item.confidence}% confidence</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={item.feedback === 'Helpful' || item.feedback === 'Very helpful' ? 'default' : 'destructive'}>
                      {item.feedback}
                    </Badge>
                    <Button size="sm" variant="outline">Review</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* 6. Premium & Billing */}
        <TabsContent value="billing" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Premium & Billing Management</h2>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Subscribers
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Active Subscribers</h3>
              <p className="text-2xl font-bold">342</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Monthly Revenue</h3>
              <p className="text-2xl font-bold">$2,850</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Churn Rate</h3>
              <p className="text-2xl font-bold">8.5%</p>
            </Card>
          </div>
        </TabsContent>

        {/* 7. Audio & Language */}
        <TabsContent value="audio" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Audio & Language Management</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Upload Audio
            </Button>
          </div>

          <Card className="p-6">
            <div className="space-y-4">
              {[
                { crop: 'Cassava', disease: 'Mosaic Disease', language: 'English', duration: '1:23' },
                { crop: 'Cassava', disease: 'Mosaic Disease', language: 'Hausa', duration: '1:18' },
                { crop: 'Maize', disease: 'Streak Virus', language: 'French', duration: '1:45' }
              ].map((audio, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{audio.crop} - {audio.disease}</h4>
                    <p className="text-sm text-muted-foreground">{audio.language} • {audio.duration}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Play</Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* 8. AI Training Data */}
        <TabsContent value="training" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">AI Training Data Manager</h2>
            <div className="flex gap-2">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload Dataset
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export Dataset
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Total Images</h3>
              <p className="text-2xl font-bold">15,847</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Labeled</h3>
              <p className="text-2xl font-bold text-green-600">12,963</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Pending Review</h3>
              <p className="text-2xl font-bold text-orange-600">2,884</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Model Accuracy</h3>
              <p className="text-2xl font-bold">87.5%</p>
            </Card>
          </div>
        </TabsContent>

        {/* 9. Settings */}
        <TabsContent value="settings" className="space-y-6">
          <h2 className="text-2xl font-bold">Admin Settings</h2>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Team Members</h3>
            <div className="space-y-4">
              {[
                { name: 'Joel Cedric', email: 'joelcedric237@gmail.com', role: 'Super Admin' },
                { name: 'Admin User', email: 'admin@agroeng.com', role: 'Admin' },
                { name: 'Content Editor', email: 'editor@agroeng.com', role: 'Content Editor' }
              ].map((member) => (
                <div key={member.email} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                  <Badge variant="outline">{member.role}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">System Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>AI Scan Limits (Free Tier)</span>
                <Input type="number" defaultValue="10" className="w-20" />
              </div>
              <div className="flex items-center justify-between">
                <span>AI Scan Limits (Premium Tier)</span>
                <Input type="number" defaultValue="100" className="w-20" />
              </div>
              <div className="flex items-center justify-between">
                <span>Enable Offline Mode</span>
                <Badge variant="secondary">Premium Only</Badge>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}