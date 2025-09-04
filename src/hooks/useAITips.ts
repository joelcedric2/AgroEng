import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface DailyTip {
  id: number;
  title: string;
  category: string;
  content: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface CropGuide {
  name: string;
  icon: string;
  commonIssues: string[];
  tips: string;
}

export interface SeasonalAlert {
  title: string;
  message: string;
  urgency: 'high' | 'medium' | 'low';
}

export interface HowToGuide {
  title: string;
  steps: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  tools: string[];
}

// Fallback content for when AI generation fails
const getFallbackDailyTips = (): DailyTip[] => [
  {
    id: 1,
    title: "Morning Watering Best Practices",
    category: "watering",
    content: "Water your plants early in the morning (6-8 AM) to reduce evaporation and prevent fungal diseases. This gives plants time to absorb water before the heat of the day.",
    difficulty: "Beginner"
  },
  {
    id: 2,
    title: "Identifying Early Pest Signs",
    category: "pests", 
    content: "Check the underside of leaves weekly for small holes, discoloration, or tiny insects. Early detection allows for easier, more organic treatment options.",
    difficulty: "Intermediate"
  },
  {
    id: 3,
    title: "Crop Rotation Benefits",
    category: "soil",
    content: "Rotate plant families each season to prevent soil depletion and disease buildup. Follow heavy feeders with light feeders or nitrogen-fixing plants.",
    difficulty: "Advanced"
  }
];

const getFallbackCropGuides = (): CropGuide[] => [
  {
    name: "Tomato",
    icon: "cherry",
    commonIssues: ["Blight", "Aphids", "Fruit Rot"],
    tips: "Stake tall varieties, prune suckers, watch for early blight symptoms"
  },
  {
    name: "Maize",
    icon: "wheat",
    commonIssues: ["Armyworm", "Rust", "Poor Pollination"],
    tips: "Plant in blocks for better pollination, monitor for armyworm damage"
  },
  {
    name: "Cassava",
    icon: "carrot",
    commonIssues: ["Mosaic Virus", "Mealybugs", "Root Rot"],
    tips: "Use disease-free cuttings, avoid waterlogged soils"
  }
];

const getFallbackSeasonalAlerts = (): SeasonalAlert[] => [
  {
    title: "Rainy Season Alert",
    message: "Watch for increased fungal diseases. Ensure good drainage and air circulation around plants.",
    urgency: "high"
  },
  {
    title: "Dry Season Tips", 
    message: "Mulch around plants to retain moisture. Consider drip irrigation for water efficiency.",
    urgency: "medium"
  }
];

const getFallbackHowToGuides = (): HowToGuide[] => [
  {
    title: "How to Test Soil pH",
    steps: ["Collect soil samples from different areas", "Mix soil with distilled water", "Use pH strips or digital meter", "Record readings for each area"],
    difficulty: "Beginner",
    estimatedTime: "30 minutes",
    tools: ["pH test kit", "Clean containers", "Distilled water"]
  },
  {
    title: "Companion Planting Setup",
    steps: ["Research compatible plant pairs", "Plan garden layout", "Plant beneficial combinations", "Monitor plant interactions"],
    difficulty: "Intermediate", 
    estimatedTime: "2-3 hours",
    tools: ["Garden planner", "Seeds", "Measuring tape", "Garden tools"]
  }
];

export const useAITips = () => {
  const [dailyTips, setDailyTips] = useState<DailyTip[]>([]);
  const [cropGuides, setCropGuides] = useState<CropGuide[]>([]);
  const [seasonalAlerts, setSeasonalAlerts] = useState<SeasonalAlert[]>([]);
  const [howToGuides, setHowToGuides] = useState<HowToGuide[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateContent = async (type: 'daily-tips' | 'crop-guides' | 'seasonal-alerts' | 'how-to-guides', count = 3) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-tips', {
        body: { type, count }
      });

      if (error) throw error;

      const content = data.content;

      switch (type) {
        case 'daily-tips':
          setDailyTips(content);
          localStorage.setItem('ai-daily-tips', JSON.stringify({
            content,
            lastGenerated: new Date().toDateString()
          }));
          break;
        case 'crop-guides':
          setCropGuides(content);
          localStorage.setItem('ai-crop-guides', JSON.stringify({
            content,
            lastGenerated: new Date().toDateString()
          }));
          break;
        case 'seasonal-alerts':
          setSeasonalAlerts(content);
          localStorage.setItem('ai-seasonal-alerts', JSON.stringify({
            content,
            lastGenerated: new Date().toDateString()
          }));
          break;
        case 'how-to-guides':
          setHowToGuides(content);
          localStorage.setItem('ai-how-to-guides', JSON.stringify({
            content,
            lastGenerated: new Date().toDateString()
          }));
          break;
      }

      toast({
        title: "Content Updated",
        description: `New ${type.replace('-', ' ')} generated successfully!`,
      });

    } catch (error) {
      console.error(`Error generating ${type}:`, error);
      throw error; // Re-throw to be caught by fallback handler
    } finally {
      setLoading(false);
    }
  };

  const generateContentWithFallback = async (type: 'daily-tips' | 'crop-guides' | 'seasonal-alerts' | 'how-to-guides', count = 3) => {
    try {
      await generateContent(type, count);
    } catch (error) {
      console.warn(`Failed to generate ${type}, using fallback content:`, error);
      // Use fallback content based on type
      switch (type) {
        case 'daily-tips':
          setDailyTips(getFallbackDailyTips());
          break;
        case 'crop-guides':
          setCropGuides(getFallbackCropGuides());
          break;
        case 'seasonal-alerts':
          setSeasonalAlerts(getFallbackSeasonalAlerts());
          break;
        case 'how-to-guides':
          setHowToGuides(getFallbackHowToGuides());
          break;
      }
    }
  };

  const loadFallbackContent = () => {
    setDailyTips(getFallbackDailyTips());
    setCropGuides(getFallbackCropGuides());
    setSeasonalAlerts(getFallbackSeasonalAlerts());
    setHowToGuides(getFallbackHowToGuides());
  };

  const loadStoredContent = async () => {
    const today = new Date().toDateString();
    
    // Add delays between API calls to avoid rate limiting
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    try {
      // Load daily tips with fallback
      const storedTips = localStorage.getItem('ai-daily-tips');
      if (storedTips) {
        const parsed = JSON.parse(storedTips);
        if (parsed.lastGenerated === today) {
          setDailyTips(parsed.content);
        } else {
          await generateContentWithFallback('daily-tips');
        }
      } else {
        await generateContentWithFallback('daily-tips');
      }

      await delay(2000); // Wait 2 seconds between API calls

      // Load seasonal alerts with fallback
      const storedAlerts = localStorage.getItem('ai-seasonal-alerts');
      if (storedAlerts) {
        const parsed = JSON.parse(storedAlerts);
        if (parsed.lastGenerated === today) {
          setSeasonalAlerts(parsed.content);
        } else {
          await generateContentWithFallback('seasonal-alerts', 2);
        }
      } else {
        await generateContentWithFallback('seasonal-alerts', 2);
      }

      await delay(3000); // Wait 3 seconds between API calls

      // Load crop guides (update weekly)
      const storedGuides = localStorage.getItem('ai-crop-guides');
      if (storedGuides) {
        const parsed = JSON.parse(storedGuides);
        const lastGenerated = new Date(parsed.lastGenerated);
        const daysDiff = Math.floor((new Date().getTime() - lastGenerated.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff < 7) {
          setCropGuides(parsed.content);
        } else {
          await generateContentWithFallback('crop-guides');
        }
      } else {
        await generateContentWithFallback('crop-guides');
      }

      await delay(4000); // Wait 4 seconds between API calls

      // Load how-to guides (update weekly)
      const storedHowTo = localStorage.getItem('ai-how-to-guides');
      if (storedHowTo) {
        const parsed = JSON.parse(storedHowTo);
        const lastGenerated = new Date(parsed.lastGenerated);
        const daysDiff = Math.floor((new Date().getTime() - lastGenerated.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff < 7) {
          setHowToGuides(parsed.content);
        } else {
        await generateContentWithFallback('how-to-guides', 3);
        }
      } else {
        await generateContentWithFallback('how-to-guides', 3);
      }

    } catch (error) {
      console.error('Error loading content:', error);
      // Load all fallback content if there's an error
      loadFallbackContent();
    }
  };

  useEffect(() => {
    // Load fallback content immediately, then try to load AI content
    loadFallbackContent();
    // Delay the AI content loading to prevent rate limiting
    setTimeout(() => {
      loadStoredContent();
    }, 1000);
  }, []);

  return {
    dailyTips,
    cropGuides,
    seasonalAlerts,
    howToGuides,
    loading,
    regenerateContent: generateContentWithFallback,
  };
};