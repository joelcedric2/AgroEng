import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useSpeechToText = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);

      toast({
        title: "Recording Started",
        description: "Speak your question or describe what you see",
      });

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setLoading(true);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Convert blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      const { data, error } = await supabase.functions.invoke('speech-to-text', {
        body: { audio: base64Audio }
      });

      if (error) throw error;

      const transcribedText = data.text;
      
      if (transcribedText) {
        // Generate AI response for the spoken input
        await generateAIResponse(transcribedText);
      } else {
        toast({
          title: "No Speech Detected",
          description: "Please try speaking again",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process audio",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAIResponse = async (userInput: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-tips', {
        body: { 
          type: 'voice-response',
          userInput: userInput
        }
      });

      if (error) throw error;

      // Use text-to-speech to respond
      const { data: ttsData, error: ttsError } = await supabase.functions.invoke('text-to-speech', {
        body: { text: data.response, voice: 'nova' }
      });

      if (ttsError) throw ttsError;

      // Play the response
      const audioBlob = new Blob(
        [Uint8Array.from(atob(ttsData.audioContent), c => c.charCodeAt(0))],
        { type: 'audio/mpeg' }
      );
      
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => URL.revokeObjectURL(audioUrl);
      await audio.play();

      toast({
        title: "Voice Response",
        description: `You said: "${userInput}"`,
      });

    } catch (error) {
      console.error('Error generating AI response:', error);
      toast({
        title: "Response Error",
        description: "Failed to generate voice response",
        variant: "destructive",
      });
    }
  };

  return {
    isRecording,
    loading,
    startRecording,
    stopRecording,
  };
};