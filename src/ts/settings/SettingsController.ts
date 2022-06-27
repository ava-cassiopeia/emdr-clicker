import {SiteSettings, SiteSettingsManifest} from "./SiteSettings";

/**
 * Controller which manages the settings button and the settings dialog. Also
 * notifies other components when the settings are changed.
 */
export class SettingsController {

  private readonly settingsDialog: HTMLDialogElement;
  private readonly settingsButton: HTMLElement;
  private readonly settingsDialogForm: HTMLFormElement;
  // Settings elements and inputs
  private readonly showVisualizationCheckbox: HTMLInputElement;

  constructor() {
    this.settingsDialog =
      document.getElementById("settingsDialog") as HTMLDialogElement;
    this.settingsButton = document.getElementById("settingsButton");
    this.showVisualizationCheckbox =
        document.getElementById("showVisualizationCheckbox") as HTMLInputElement;
    this.settingsDialogForm =
        document.getElementById("settingsDialogForm") as HTMLFormElement;

    this.settingsButton.addEventListener(
      "click",
      () => this.onSettingsButtonClick(),
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

  private syncSettingsToDOM() {
    this.showVisualizationCheckbox.checked =
        Boolean(SiteSettingsManifest.SHOW_VISUALIZATION.get());
  }

  private syncSettingsFromDOM() {
    const formData = new FormData(this.settingsDialogForm);
    
    // Checkbox values only show up if they are checked, so we can simply ask
    // if the value was even provided at all.
    SiteSettingsManifest.SHOW_VISUALIZATION.set(
      formData.has("showVisualization"));
  }

  static init(): SettingsController {
    return new SettingsController();
  }

}
