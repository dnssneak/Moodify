import type { Track } from '../types/music';

class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private isPlaying: boolean = false;
  private currentTrack: Track | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Play ambient chord/melody preset for a given track
   */
  public playTrack(track: Track, volume: number = 0.5) {
    this.initCtx();
    this.stop();

    if (!this.ctx || !this.masterGain) return;

    this.currentTrack = track;
    this.isPlaying = true;
    this.masterGain.gain.setValueAtTime(volume * 0.4, this.ctx.currentTime);

    const { baseFreq, waveType, detune = 0 } = track.synthPreset;

    // Harmonic ratios for rich ambient chord sound
    const intervals = [1, 1.25, 1.5, 1.875]; // Root, major third, fifth, major seventh

    intervals.forEach((ratio, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = waveType;
      osc.frequency.setValueAtTime(baseFreq * ratio, this.ctx.currentTime);
      osc.detune.setValueAtTime(detune * (idx % 2 === 0 ? 1 : -1), this.ctx.currentTime);

      // Subtle LFO modulation for organic movement
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.value = 0.2 + idx * 0.1;
      lfoGain.gain.value = 3;
      lfo.connect(osc.frequency);
      lfo.start();

      gain.gain.setValueAtTime(0.15 / (idx + 1), this.ctx.currentTime);
      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      this.activeOscillators.push(osc);
    });
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(volume * 0.4, this.ctx.currentTime, 0.05);
    }
  }

  public stop() {
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore
      }
    });
    this.activeOscillators = [];
    this.isPlaying = false;
  }

  public getFrequencyData(dataArray: Uint8Array): void {
    if (this.analyser && this.isPlaying) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.analyser.getByteFrequencyData(dataArray as any);
    } else {
      // Return subtle synthetic rhythm when stopped/idle
      for (let i = 0; i < dataArray.length; i++) {
        dataArray[i] = Math.floor(Math.random() * 20) + 10;
      }
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTrack(): Track | null {
    return this.currentTrack;
  }
}

export const audioService = new AudioService();
