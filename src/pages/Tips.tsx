import { useState } from "react";
import { PageLayout } from "@/components/ui/page-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Lightbulb, Bug, Droplets, Sun, Volume2, Mic, MicOff, Loader2, RefreshCw, Cherry, Wheat, Carrot, Leaf } from "lucide-react";
import { useAITips } from "@/hooks/useAITips";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useSpeechToText } from "@/hooks/useSpeechToText";

const getIconForCategory = (category: string) => {
  switch (category.toLowerCase()) {
    case 'watering': return Droplets;
    case 'pests': return Bug;
    case 'soil': return Sun;
    case 'planting': return BookOpen;
    default: return Lightbulb;
  }
};

export default function Tips() {
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<number | null>(null);
  
  const { dailyTips, cropGuides, seasonalAlerts, howToGuides, loading: aiLoading, regenerateContent } = useAITips();
  const { speak, loading: ttsLoading, isPlaying } = useTextToSpeech();
  const { isRecording, loading: sttLoading, startRecording, stopRecording } = useSpeechToText();

  const handleAudioPlay = (text: string, id: string) => {
    speak(text, id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-success/10 text-success";
      case "Intermediate": return "bg-warning/10 text-warning";
      case "Advanced": return "bg-destructive/10 text-destructive";
      default: return "bg-muted/10 text-muted-foreground";
    }
  };

  return (
    <PageLayout title="Tips & Education" showNavigation={true}>
      <div className="p-4 space-y-6">
        {/* Voice Assistant */}
        <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/20 rounded-full">
                <Mic className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Voice Assistant</p>
                <p className="text-xs text-muted-foreground">
                  Ask about your crops or describe what you see
                </p>
              </div>
            </div>
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={sttLoading}
              className={`${isRecording ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'}`}
            >
              {sttLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isRecording ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          </div>
        </Card>

        {/* Seasonal Alerts */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center">
              <Lightbulb className="mr-2 h-5 w-5 text-warning" />
              Seasonal Alerts
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => regenerateContent('seasonal-alerts', 2)}
              disabled={aiLoading}
            >
              {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </div>
          {seasonalAlerts.map((alert, index) => (
            <Card key={index} className={`p-4 ${
              alert.urgency === "high" 
                ? "bg-destructive/5 border-destructive/20" 
                : "bg-warning/5 border-warning/20"
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">{alert.title}</h4>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAudioPlay(`${alert.title}. ${alert.message}`, `alert-${index}`)}
                  className={isPlaying(`alert-${index}`) ? "text-primary" : ""}
                  disabled={ttsLoading}
                >
                  {ttsLoading && isPlaying(`alert-${index}`) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Daily Tips</TabsTrigger>
            <TabsTrigger value="crops">Crop Guides</TabsTrigger>
            <TabsTrigger value="guides">How-To</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">AI-Generated Daily Tips</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => regenerateContent('daily-tips')}
                disabled={aiLoading}
              >
                {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                New Tips
              </Button>
            </div>
            
            {dailyTips.map((tip) => {
              const Icon = getIconForCategory(tip.category);
              const tipId = `tip-${tip.id}`;
              return (
                <Card key={tip.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{tip.title}</h4>
                        <Badge className={getDifficultyColor(tip.difficulty)}>
                          {tip.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAudioPlay(`${tip.title}. ${tip.content}`, tipId)}
                      className={isPlaying(tipId) ? "text-primary" : ""}
                      disabled={ttsLoading}
                    >
                      {ttsLoading && isPlaying(tipId) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tip.content}
                  </p>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => setSelectedTip(selectedTip === tip.id ? null : tip.id)}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    {selectedTip === tip.id ? "Show Less" : "Learn More"}
                  </Button>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="crops" className="space-y-4 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">AI-Generated Crop Guides</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => regenerateContent('crop-guides')}
                disabled={aiLoading}
              >
                {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                New Guides
              </Button>
            </div>
            
            {cropGuides.map((crop, index) => {
              const guideId = `guide-${index}`;
              return (
                <Card key={index} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        {crop.icon === 'cherry' ? <Cherry className="h-6 w-6 text-primary" /> :
                         crop.icon === 'wheat' ? <Wheat className="h-6 w-6 text-primary" /> :
                         crop.icon === 'carrot' ? <Carrot className="h-6 w-6 text-primary" /> :
                         <Leaf className="h-6 w-6 text-primary" />}
                      </div>
                      <h4 className="font-semibold text-lg">{crop.name}</h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAudioPlay(`${crop.name} guide. Common issues: ${crop.commonIssues.join(', ')}. Tips: ${crop.tips}`, guideId)}
                      className={isPlaying(guideId) ? "text-primary" : ""}
                      disabled={ttsLoading}
                    >
                      {ttsLoading && isPlaying(guideId) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Common Issues:</p>
                      <div className="flex flex-wrap gap-2">
                        {crop.commonIssues.map((issue, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {issue}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Key Tips:</p>
                      <p className="text-sm text-muted-foreground">{crop.tips}</p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedGuide(selectedGuide === index ? null : index)}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      {selectedGuide === index ? "Show Less" : "Learn More"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="guides" className="space-y-4 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">AI-Generated How-To Guides</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => regenerateContent('how-to-guides', 4)}
                disabled={aiLoading}
              >
                {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                New Guides
              </Button>
            </div>
            
            {howToGuides.map((guide, index) => {
              const howToId = `howto-${index}`;
              const fullText = `${guide.title}. This ${guide.difficulty} level guide takes ${guide.estimatedTime}. Tools needed: ${guide.tools.join(', ')}. Steps: ${guide.steps.join('. ')}`;
              
              return (
                <Card key={index} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold">{guide.title}</h4>
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge className={getDifficultyColor(guide.difficulty)}>
                          {guide.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {guide.estimatedTime}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAudioPlay(fullText, howToId)}
                      className={isPlaying(howToId) ? "text-primary" : ""}
                      disabled={ttsLoading}
                    >
                      {ttsLoading && isPlaying(howToId) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Tools Required:</p>
                      <div className="flex flex-wrap gap-2">
                        {guide.tools.map((tool, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Steps:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        {guide.steps.map((step, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>

        {/* Voice Features Info */}
        <Card className="p-4 bg-gradient-to-r from-accent/5 to-primary/5 border-accent/20">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Volume2 className="h-5 w-5 text-accent" />
              <div>
                <p className="font-semibold text-sm">Voice Reading</p>
                <p className="text-xs text-muted-foreground">
                  Tap speaker icons to hear content
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mic className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-sm">Voice Assistant</p>
                <p className="text-xs text-muted-foreground">
                  Ask questions or describe issues
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}