import {VisualizerController} from "./VisualizerController";

/**
 * Controller that manages playing back the EMDR audio and switching between
 * the left and right ear.
 */
export class PlaybackController {

  leftAudio: HTMLAudioElement;
  rightAudio: HTMLAudioElement;

  private isPlaying_ = false;
  private playLeft = true;
  private playingInterval: object|null = null;
  private intervalMS = 500;

  private readonly visualizerCtrl;

  constructor() {
    this.visualizerCtrl = new VisualizerController(this);
    this.visualizerCtrl.sync();
  }

  /**
   * Starts playback. If playback is already started, does nothing.
   */
  start() {
    if (this.isPlaying_) return;
    this.isPlaying_ = true;

    this.playingInterval = setInterval(() => {
      this.playOneClick();
    }, this.intervalMS);

    this.playOneClick();
  }

  /**
   * Stops playback. If playback hasn't started, does nothing.
   */
  stop() {
    if (!this.isPlaying_) return;
    
    clearInterval(this.playingInterval as any);
    this.leftAudio.pause();
    this.rightAudio.pause();
    this.leftAudio.currentTime = 0;
    this.rightAudio.currentTime = 0;
    this.isPlaying_ = false;
  }

  /**
   * Toggles playback based on the current playback state.
   */
  toggle() {
    if (this.isPlaying_) {
      this.stop();
      return;
    }

    this.start();
  }

  /**
   * Sets the interval of time between clicks, in milliseconds.
   */
  setInterval(intervalMS: number) {
    this.intervalMS = intervalMS;
  }

  isPlaying(): boolean {
    return this.isPlaying_;
  }

  getIntervalMS(): number {
    return this.intervalMS;
  }

  private playOneClick() {
    if (this.playLeft) {
      this.leftAudio.play();
      this.visualizerCtrl.goRight();
    } else {
      this.rightAudio.play();
      this.visualizerCtrl.goLeft();
    }

    this.playLeft = !this.playLeft;
  }

}
