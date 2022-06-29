import {SiteSettings, SiteSettingsManifest} from "./SiteSettings";

/**
 * Controller which manages the settings button and the settings dialog. Also
 * notifies other components when the settings are changed.
 */
export class SettingsController {

  private readonly settingsDialog: HTMLDialogElement;
  private readonly settingsButton: HTMLElement;
  private readonly cancelSettingsButton: HTMLElement;
  private readonly settingsDialogForm: HTMLFormElement;
  // Settings elements and inputs
  private readonly showVisualizationCheckbox: HTMLInputElement;
  private readonly intervalInput: HTMLInputElement;

  constructor() {
    this.settingsDialog =
      document.getElementById("settingsDialog") as HTMLDialogElement;
    this.settingsButton = document.getElementById("settingsButton");
    this.cancelSettingsButton = document.getElementById("cancelSettingsButton");
    this.showVisualizationCheckbox =
        document.getElementById("showVisualizationCheckbox") as HTMLInputElement;
    this.settingsDialogForm =
        document.getElementById("settingsDialogForm") as HTMLFormElement;
    this.intervalInput =
        document.getElementById("intervalInput") as HTMLInputElement;

    this.settingsButton.addEventListener(
      "click",
      () => this.onSettingsButtonClick(),
    );
    this.cancelSettingsButton.addEventListener(
      "click",
      () => this.oncancelSettingsButtonClick(),
    );
    this.settingsDialogForm.addEventListener(
      "submit",
      () => this.onSettingsFormSubmitted(),
    );

    // Initially load all settings
    SiteSettings.loadAll();
  }

  private onSettingsButtonClick() {
    this.openSettings();
  }

  private oncancelSettingsButtonClick() {
    this.cancelSettings();
  }

  private onSettingsFormSubmitted() {
    this.syncSettingsFromDOM();
  }

  private openSettings() {
    this.syncSettingsToDOM();
    // @ts-ignore: .show() is flagged as not being part of a HTMLDialogElement,
    // but it is part of the specification as noted on MDN:
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
    this.settingsDialog.show();
  }

  private cancelSettings() {
    this.settingsDialog.removeAttribute("open");
  }

  private syncSettingsToDOM() {
    this.showVisualizationCheckbox.checked =
        Boolean(SiteSettingsManifest.SHOW_VISUALIZATION.get());
    this.intervalInput.value =
        String(SiteSettingsManifest.INTERVAL_TIME_MS.get());
  }

  private syncSettingsFromDOM() {
    const formData = new FormData(this.settingsDialogForm);
    
    // Checkbox values only show up if they are checked, so we can simply ask
    // if the value was even provided at all.
    SiteSettingsManifest.SHOW_VISUALIZATION.set(
      formData.has("showVisualization"));

    const rawIntervalValue = formData.get("intervalTime") as string;
    if (rawIntervalValue.trim() !== "") {
      const newIntervalValue = parseInt(rawIntervalValue.trim());

      // If a reasonable value was set, update the speed.
      if (newIntervalValue > 0) {
        SiteSettingsManifest.INTERVAL_TIME_MS.set(newIntervalValue);
      }
    }
  }

  static init(): SettingsController {
    return new SettingsController();
  }

}
