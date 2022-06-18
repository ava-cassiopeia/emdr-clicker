/**
 * Controller that manages playing back the EMDR audio and switching between
 * the left and right ear.
 */
export class PlaybackController {

  leftAudio: HTMLAudioElement;
  rightAudio: HTMLAudioElement;

  private isPlaying = false;
  private playLeft = true;
  private playingInterval: object|null = null;

  /**
   * Starts playback. If playback is already started, does nothing.
   */
  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    this.playingInterval = setInterval(() => {
      this.playOneClick();
    }, 500);
  }

  /**
   * Stops playback. If playback hasn't started, does nothing.
   */
  stop() {
    if (!this.isPlaying) return;
    
    clearInterval(this.playingInterval as any);
    this.leftAudio.pause();
    this.rightAudio.pause();
    this.leftAudio.currentTime = 0;
    this.rightAudio.currentTime = 0;
    this.isPlaying = false;
  }

  /**
   * Toggles playback based on the current playback state.
   */
  toggle() {
    if (this.isPlaying) {
      this.stop();
      return;
    }

    this.start();
  }

  private playOneClick() {
    if (this.playLeft) {
      this.leftAudio.play();
    } else {
      this.rightAudio.play();
    }

    this.playLeft = !this.playLeft;
  }

}
