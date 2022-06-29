import {PlaybackController} from "./PlaybackController";
import {SiteSettingsManifest} from "../settings/SiteSettings";

const SOUND_TRACKER_MOVE_RIGHT_CSS_CLASS = "right";
const HIDE_CSS_CLASS = "hide";

/**
 * Controller which manages state and animations for the visualization of the
 * playback at the top of the page.
 */
export class VisualizerController {

  private readonly element: HTMLElement;
  private readonly soundTrackerEl: HTMLElement;
  private readonly leftSplash: HTMLElement;
  private readonly rightSplash: HTMLElement;

  constructor(private readonly playbackController: PlaybackController) {
    this.element = document.getElementById("visualizer");
    this.soundTrackerEl = this.element.querySelector(".sound-tracker")!;
    this.leftSplash = this.element.querySelector(".splash.left");
    this.rightSplash = this.element.querySelector(".splash.right");

    // Sync settings on first load
    this.updateVisibilityFromSetting();

    // Subscribe to updates when the SHOW_VISUALIZATION setting is changed.
    SiteSettingsManifest.SHOW_VISUALIZATION.addListener(
      () => this.settingChanged());
  }

  hide() {
    this.element.classList.add(HIDE_CSS_CLASS);
  }

  show() {
    this.element.classList.remove(HIDE_CSS_CLASS);
  }

  /**
   * Move the visualization to the right.
   */
  goRight() {
    this.soundTrackerEl.classList.add(SOUND_TRACKER_MOVE_RIGHT_CSS_CLASS);
    this.doSplashOn(this.leftSplash);
  }

  /**
   * Move the visualization to the left.
   */
  goLeft() {
    this.soundTrackerEl.classList.remove(SOUND_TRACKER_MOVE_RIGHT_CSS_CLASS);
    this.doSplashOn(this.rightSplash);
  }

  /**
   * Syncronize the state of the visualization with the playback controller.
   * Sets the animation speed and position.
   */
  sync() {
    const animationSpeed = this.playbackController.getIntervalMS();
    this.soundTrackerEl.setAttribute("style", `transition: transform ${animationSpeed}ms ease`);
  }

  private doSplashOn(element: HTMLElement) {
    element.classList.add("once");

    element.addEventListener("animationend", () => {
      element.classList.remove("once");
    }, {once: true});
  }

  private settingChanged() {
    this.updateVisibilityFromSetting();
  }

  private updateVisibilityFromSetting() {
    const showSelf = SiteSettingsManifest.SHOW_VISUALIZATION.get();
    if (showSelf) {
      this.show();
      return;
    }

    this.hide();
  }

}
