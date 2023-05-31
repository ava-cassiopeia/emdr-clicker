import {VisualizerController} from "./VisualizerController";
import {SiteSettingsManifest} from "../settings/SiteSettings";

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
  private intervalMS = 750;

  private readonly visualizerCtrl;

  constructor() {
    this.visualizerCtrl = new VisualizerController(this);
    this.visualizerCtrl.sync();

    this.updateFromSetting();

    SiteSettingsManifest.INTERVAL_TIME_MS.addListener(
        () => this.onSettingChanged());
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
    this.stopOne(this.leftAudio);
    this.stopOne(this.rightAudio);
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

  private async playOneClick() {
    if (this.playLeft) {
      await this.stopOne(this.leftAudio);
      this.leftAudio.play();
      this.visualizerCtrl.goRight();
    } else {
      await this.stopOne(this.rightAudio);
      this.rightAudio.play();
      this.visualizerCtrl.goLeft();
    }

    this.playLeft = !this.playLeft;
  }

  private onSettingChanged() {
    this.updateFromSetting();
  }

  private updateFromSetting() {
    const wasPlaying = this.isPlaying();
    const newSpeed = SiteSettingsManifest.INTERVAL_TIME_MS.get() as number;
    // If we were playing audio, stop. This is to make sure there's no
    // unintended playback side effects that might happen in edge cases.
    this.stop();

    this.intervalMS = newSpeed;
    this.visualizerCtrl.sync();

    if (wasPlaying) {
      this.start();
    }
  }

  private stopOne(element: HTMLAudioElement): Promise<void> {
    element.pause();
    element.currentTime = 0;

    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  }

}
