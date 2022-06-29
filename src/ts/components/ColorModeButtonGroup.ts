import {ColorModes, SiteSettingsManifest} from "../settings/SiteSettings";

const SELECTED_CSS_CLASS = "selected";

/**
 * Manages a group of buttons that behaves like a radio group, ie. only one
 * button is "selected" at any given time.
 */
export class ColorModeButtonGroup {

  private selectedMode: ColorModes;
  private readonly element: HTMLElement;
  private readonly buttons: HTMLButtonElement[] = [];

  constructor(id: string) {
    this.element = document.getElementById(id);
    this.element.querySelectorAll("button")
        .forEach((e) => this.buttons.push(e));

    for (const button of this.buttons) {
      button.addEventListener("click", (e) => this.onButtonClick(e));
    }
    
    this.set(this.getModeFromSetting());
  }

  set(mode: ColorModes) {
    this.selectedMode = mode;
    this.selectByValue(mode);
  }

  value(): ColorModes {
    return this.selectedMode;
  }

  private onButtonClick(event: MouseEvent) {
    const value = this.getValueFromEvent(event);
    
    switch (value) {
      case ColorModes.DARK_MODE:
        this.set(ColorModes.DARK_MODE);
        break;
      case ColorModes.LIGHT_MODE:
        this.set(ColorModes.LIGHT_MODE);
        break;
      case ColorModes.FOLLOW_SYSTEM:
        this.set(ColorModes.FOLLOW_SYSTEM);
        break;
      default:
        this.set(SiteSettingsManifest.COLOR_MODE.defaultValue as ColorModes);
    }
  }

  private getValueFromEvent(event: MouseEvent): string {
    let currentElement = event.target as HTMLElement;

    for (let x = 0; x < 10; x++) {
      if (currentElement.hasAttribute("value")) {
        return currentElement.getAttribute("value").trim();
      }

      currentElement = currentElement.parentElement;
    }

    return "";
  }

  private selectByValue(value: string) {
    for (const button of this.buttons) {
      if (button.value === value) {
        button.classList.add(SELECTED_CSS_CLASS);
      } else {
        button.classList.remove(SELECTED_CSS_CLASS);
      }
    }
  }

  private getModeFromSetting(): ColorModes {
    return SiteSettingsManifest.COLOR_MODE.get() as ColorModes;
  }

}
