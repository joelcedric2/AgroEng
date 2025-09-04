import { useState } from "react";
import { PageLayout } from "@/components/ui/page-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Camera, Calendar, Filter, Download, Wifi, WifiOff, MoreVertical, Trash2, BarChart3, CheckCircle, AlertTriangle } from "lucide-react";
import { useScans } from "@/hooks/useScans";
import { useToast } from "@/hooks/use-toast";

export default function History() {
  const navigate = useNavigate();
  const { scans, loading, deleteScan } = useScans();
  const { toast } = useToast();
  const [isOnline] = useState(navigator.onLine);

  const handleDeleteScan = async (scanId: string) => {
    const success = await deleteScan(scanId);
    if (success) {
      toast({
        title: "Scan deleted",
        description: "The plant diagnosis has been removed.",
      });
    }
  };

  const getSeverityColor = (severity: string | null) => {
    switch (severity) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      case "low": return "bg-success/10 text-success border-success/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getStatusIcon = (issue: string | null) => {
    if (!issue || issue.toLowerCase().includes('healthy')) return <CheckCircle className="h-5 w-5 text-success" />;
    if (issue.toLowerCase().includes('urgent') || issue.toLowerCase().includes('critical')) return <AlertTriangle className="h-5 w-5 text-destructive" />;
    return <AlertTriangle className="h-5 w-5 text-warning" />;
  };

  return (
    <PageLayout title="Diagnosis History" showNavigation={true}>
      <div className="p-4 space-y-6">
        {/* Offline Status Indicator */}
        <Card className={`p-4 ${isOnline ? 'bg-success/5 border-success/20' : 'bg-warning/5 border-warning/20'}`}>
          <div className="flex items-center space-x-3">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-success" />
            ) : (
              <WifiOff className="h-4 w-4 text-warning" />
            )}
            <div>
              <p className="text-sm font-medium">
                {isOnline ? 'Online' : 'Offline Mode'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isOnline 
                  ? 'All data synced'
                  : 'Viewing cached history. Some features may be limited.'
                }
              </p>
            </div>
          </div>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{scans.length}</div>
            <div className="text-xs text-muted-foreground">Total Scans</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-success">
              {scans.filter(scan => !scan.issue_detected || scan.issue_detected.toLowerCase().includes('healthy')).length}
            </div>
            <div className="text-xs text-muted-foreground">Healthy</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">
              {scans.filter(scan => scan.issue_detected && !scan.issue_detected.toLowerCase().includes('healthy')).length}
            </div>
            <div className="text-xs text-muted-foreground">Issues Found</div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-3">
          <Button 
            size="sm" 
            onClick={() => navigate('/camera')}
            className="flex-1"
          >
            <Camera className="mr-2 h-4 w-4" />
            New Scan
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* History List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Recent Diagnoses</h3>
          
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading your scan history...</p>
            </div>
          ) : scans.length === 0 ? (
            <Card className="p-8 text-center bg-muted/20 border-dashed">
              <div className="space-y-4">
                <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground" />
                <h3 className="font-semibold">No scans yet</h3>
                <p className="text-muted-foreground">
                  Start by taking a photo of your plants to build your diagnosis history
                </p>
                <Button onClick={() => navigate('/camera')}>
                  <Camera className="mr-2 h-4 w-4" />
                  Take First Scan
                </Button>
              </div>
            </Card>
          ) : (
            scans.map((scan) => (
              <Card key={scan.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  {scan.image_url ? (
                    <img 
                      src={scan.image_url} 
                      alt={scan.plant_type || 'Plant'}
                      className="w-16 h-16 rounded-lg object-cover border-2 border-border"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-muted/30 border-2 border-dashed border-muted flex items-center justify-center">
                      <Camera className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{scan.plant_type || 'Unknown Plant'}</h4>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteScan(scan.id)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(scan.issue_detected)}
                      <span className="text-sm font-medium">
                        {scan.issue_detected || 'Healthy'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(scan.created_at).toLocaleDateString()}</span>
                      </div>
                      {scan.severity && (
                        <Badge 
                          variant="outline" 
                          className={getSeverityColor(scan.severity)}
                        >
                          {scan.severity.charAt(0).toUpperCase() + scan.severity.slice(1)}
                        </Badge>
                      )}
                    </div>
                    
                    {scan.confidence_score && (
                      <div className="text-xs text-muted-foreground">
                        Confidence: {Math.round(scan.confidence_score * 100)}%
                      </div>
                    )}

                    {scan.recommendations && (
                      <div className="text-xs text-muted-foreground mt-2">
                        <strong>Recommendations:</strong> {scan.recommendations.substring(0, 100)}...
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Export Options */}
        <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="text-center space-y-3">
            <h4 className="font-semibold">Export Your Data</h4>
            <p className="text-sm text-muted-foreground">
              Download your diagnosis history for farm records
            </p>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export PDF Report
            </Button>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}