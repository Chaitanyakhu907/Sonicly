// Demo audio generator for YouTube tracks

export class DemoAudioGenerator {
  private static instance: DemoAudioGenerator;
  
  static getInstance(): DemoAudioGenerator {
    if (!DemoAudioGenerator.instance) {
      DemoAudioGenerator.instance = new DemoAudioGenerator();
    }
    return DemoAudioGenerator.instance;
  }

  // Generate a simple audio tone using Web Audio API
  generateTone(frequency: number = 440, duration: number = 2): Promise<string> {
    return new Promise((resolve) => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const sampleRate = audioContext.sampleRate;
        const numChannels = 1;
        const length = sampleRate * duration;
        
        const buffer = audioContext.createBuffer(numChannels, length, sampleRate);
        const channelData = buffer.getChannelData(0);
        
        // Generate a pleasant sine wave with fade in/out
        for (let i = 0; i < length; i++) {
          const t = i / sampleRate;
          let amplitude = 0.1; // Base amplitude
          
          // Fade in (first 0.1 seconds)
          if (t < 0.1) {
            amplitude *= t / 0.1;
          }
          // Fade out (last 0.1 seconds)
          else if (t > duration - 0.1) {
            amplitude *= (duration - t) / 0.1;
          }
          
          // Create a pleasant musical tone (major chord)
          const fundamental = Math.sin(2 * Math.PI * frequency * t);
          const harmonic1 = Math.sin(2 * Math.PI * frequency * 1.25 * t) * 0.5; // Major third
          const harmonic2 = Math.sin(2 * Math.PI * frequency * 1.5 * t) * 0.3; // Perfect fifth
          
          channelData[i] = (fundamental + harmonic1 + harmonic2) * amplitude;
        }
        
        // Convert to WAV blob
        const wavData = this.bufferToWav(buffer);
        const blob = new Blob([wavData], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        
        resolve(url);
      } catch (error) {
        console.error('Failed to generate demo audio:', error);
        // Fallback to a minimal WAV file
        resolve(this.createSilentWav());
      }
    });
  }

  // Convert AudioBuffer to WAV format
  private bufferToWav(buffer: AudioBuffer): ArrayBuffer {
    const length = buffer.length;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);
    const channelData = buffer.getChannelData(0);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);
    
    // PCM data
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, channelData[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
    
    return arrayBuffer;
  }

  // Create a minimal silent WAV file as absolute fallback
  private createSilentWav(): string {
    const arrayBuffer = new ArrayBuffer(44);
    const view = new DataView(arrayBuffer);
    
    // Minimal WAV header for 1 second of silence
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, 44100, true);
    view.setUint32(28, 88200, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, 0, true);
    
    const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  }

  // Get a demo audio URL for a specific track (creates variety)
  async getDemoAudioForTrack(trackId: string, trackTitle: string): Promise<string> {
    // Create different tones based on track characteristics
    const baseFrequency = 220; // A3
    const frequencies = [
      baseFrequency,      // A3
      baseFrequency * 1.125, // C4
      baseFrequency * 1.25,  // D4
      baseFrequency * 1.5,   // E4
      baseFrequency * 1.667, // F4
    ];
    
    // Use track ID to determine frequency for consistency
    const frequencyIndex = parseInt(trackId, 36) % frequencies.length;
    const frequency = frequencies[frequencyIndex];
    
    // Vary duration slightly based on track
    const duration = 3 + (parseInt(trackId.slice(-1), 36) % 3);
    
    return this.generateTone(frequency, duration);
  }
}

export const demoAudioGenerator = DemoAudioGenerator.getInstance();
