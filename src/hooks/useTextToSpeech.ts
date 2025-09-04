import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useTextToSpeech = () => {
  const [loading, setLoading] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const speak = async (text: string, id?: string, voice: string = 'alloy') => {
    if (currentlyPlaying === id) {
      // Stop current audio
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      setCurrentlyPlaying(null);
      return;
    }

    setLoading(true);
    try {
      // Stop any currently playing audio
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }

      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice }
      });

      if (error) throw error;

      // Create audio from base64
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
        { type: 'audio/mpeg' }
      );
      
      const audioUrl = URL.createObjectURL(audioBlob);
      const newAudio = new Audio(audioUrl);
      
      newAudio.onended = () => {
        setCurrentlyPlaying(null);
        URL.revokeObjectURL(audioUrl);
      };

      newAudio.onerror = () => {
        toast({
          title: "Audio Error",
          description: "Failed to play audio",
          variant: "destructive",
        });
        setCurrentlyPlaying(null);
        URL.revokeObjectURL(audioUrl);
      };

      setAudio(newAudio);
      setCurrentlyPlaying(id || text.substring(0, 50));
      await newAudio.play();

    } catch (error) {
      console.error('Text-to-speech error:', error);
      toast({
        title: "Speech Error",
        description: "Failed to generate speech",
        variant: "destructive",
      });
      setCurrentlyPlaying(null);
    } finally {
      setLoading(false);
    }
  };

  const stop = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setCurrentlyPlaying(null);
  };

  return {
    speak,
    stop,
    loading,
    currentlyPlaying,
    isPlaying: (id: string) => currentlyPlaying === id,
  };
};