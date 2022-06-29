import {ColorModes, SiteSettingsManifest} from "./SiteSettings";

/**
 * Controller which manages the CSS class associated with the site theme.
 */
export class ThemeController {

  private readonly html: HTMLHtmlElement;

  private constructor() {
    this.html = document.getElementsByTagName("html")[0];

    this.updateFromSetting();

    SiteSettingsManifest.COLOR_MODE.addListener(() => this.updateFromSetting());
  }

  private updateFromSetting() {
    const settingValue = SiteSettingsManifest.COLOR_MODE.get() as ColorModes;
    const cssClass = this.getClassByMode(settingValue);
    
    this.clearHtmlClasses();
    this.html.classList.add(cssClass);
  }

  private clearHtmlClasses() {
    for (const className of this.html.classList) {
      this.html.classList.remove(className);
    }
  }

  private getClassByMode(mode: ColorModes): string {
    return `site-theme-${mode}`;
  }

  static init(): ThemeController {
    return new ThemeController();
  }

}
