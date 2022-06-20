/**
 * Controller which manages the settings button and the settings dialog. Also
 * notifies other components when the settings are changed.
 */
export class SettingsController {

  private readonly settingsDialog: HTMLDialogElement;
  private readonly settingsButton: HTMLElement;

  constructor() {
    this.settingsDialog =
      document.getElementById("settingsDialog") as HTMLDialogElement;
    this.settingsButton = document.getElementById("settingsButton");

    this.settingsButton.addEventListener(
      "click",
      () => this.onSettingsButtonClick());
  }

  private onSettingsButtonClick() {
    this.openSettings();
  }

  private openSettings() {
    // @ts-ignore: .show() is flagged as not being part of a HTMLDialogElement,
    // but it is part of the specification as noted on MDN:
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
    this.settingsDialog.show();
  }

  static init(): SettingsController {
    return new SettingsController();
  }

}
