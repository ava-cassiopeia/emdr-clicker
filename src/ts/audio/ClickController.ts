import {AudioFiles, AudioFile} from "../config/AudioFiles";
import {PlaybackController} from "./PlaybackController";

/**
 * Manages the overall system for loading and playing the EMDR clicks.
 */
export class ClickController {

  loadingAudio = false;

  private clickFileId = "chime";
  private clickFile: AudioFile;
  private leftAudio: HTMLAudioElement|null = null;
  private rightAudio: HTMLAudioElement|null = null;
  private playbackController: PlaybackController;

  private startButton: HTMLElement;

  private constructor() {
    this.clickFile = ClickController.getAudioFileById(this.clickFileId);
    this.startButton = document.getElementById("startButton");

    this.startButton.addEventListener("click", () => {
      this.onStartButtonClick();
    });

    this.loadAudio();
  }

  private onStartButtonClick() {
    if (!this.hasAudio()) return;

    this.playbackController.toggle();
  }

  private hasAudio(): boolean {
    return this.rightAudio !== null && this.leftAudio !== null;
  }

  private async loadAudio() {
    this.loadingAudio = true;
    const leftFilePath = this.clickFile.sources.left;
    const rightFilePath = this.clickFile.sources.right;

    this.leftAudio = new Audio(leftFilePath);
    this.rightAudio = new Audio(rightFilePath);

    if (!this.playbackController) {
      this.playbackController = new PlaybackController();
    }
    this.playbackController.leftAudio = this.leftAudio;
    this.playbackController.rightAudio = this.rightAudio;

    this.leftAudio.load();
    this.rightAudio.load();

    await this.waitForAudioLoad();
    this.loadingAudio = false;
  }

  private async waitForAudioLoad() {
    await Promise.all([
      this.waitForLeftAudioLoad(),
      this.waitForRightAudioLoad(),
    ]);
  }

  private waitForLeftAudioLoad(): Promise<void> {
    return new Promise((resolve) => {
      this.leftAudio.addEventListener("canplaythrough", () => {
        resolve();
      });
    });
  }

  private waitForRightAudioLoad(): Promise<void> {
    return new Promise((resolve) => {
      this.rightAudio.addEventListener("canplaythrough", () => {
        resolve();
      });
    });
  }

  static init(): ClickController {
    return new ClickController();
  }

  private static getAudioFileById(id: string): AudioFile {
    for (const file of AudioFiles) {
      if (file.id === id) {
        return file;
      }
    }

    return null;
  }

}
