export class PlaybackController {

  leftAudio: HTMLAudioElement;
  rightAudio: HTMLAudioElement;

  private isPlaying = false;
  private playLeft = true;
  private playingInterval: object|null = null;

  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    this.playingInterval = setInterval(() => {
      this.playOneClick();
    }, 500);
  }

  stop() {
    if (!this.isPlaying) return;
    
    clearInterval(this.playingInterval as any);
    this.isPlaying = false;
  }

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
