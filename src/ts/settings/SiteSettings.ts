export enum ColorModes {
  FOLLOW_SYSTEM = "follow-system",
  DARK_MODE = "dark",
  LIGHT_MODE = "light",
}

export class SiteSettingsManifest {

  static readonly SHOW_VISUALIZATION = new SiteSettingsManifest(
    "show-visualization",
    /* defaultValue= */ true,
    // Decoder
    (rawValue: string) => {
      return rawValue.trim().toLowerCase() === "true";
    },
    // Encoder
    (value: SiteSettingsValue) => {
      return value ? "true" : "false";
    },
  );

  static readonly INTERVAL_TIME_MS = new SiteSettingsManifest(
    "interval-time",
    /* defaultValue= */ 750,
    // Decoder
    (rawValue: string) => {
      return parseInt(rawValue);
    },
    // Encoder
    (value: SiteSettingsValue) => String(value),
  );

  static readonly CLICK_SOUND = new SiteSettingsManifest(
    "click-sound",
    /* defaultValue= */ "chime",
    // Decoder
    (rawValue: string) => rawValue,
    // Encoder
    (value: SiteSettingsValue) => String(value),
  );

  static readonly COLOR_MODE = new SiteSettingsManifest(
    "color-mode",
    /* defaultValue= */ ColorModes.FOLLOW_SYSTEM,
    // Decoder
    (rawValue: string): SiteSettingsValue => {
      switch (rawValue) {
        case ColorModes.DARK_MODE:
          return ColorModes.DARK_MODE;
        case ColorModes.FOLLOW_SYSTEM:
          ColorModes.FOLLOW_SYSTEM;
        case ColorModes.LIGHT_MODE:
          return ColorModes.LIGHT_MODE;
        default:
          return ColorModes.FOLLOW_SYSTEM;
      }
    },
    // Encoder
    (value: SiteSettingsValue) => String(value),
  );


  private value: SiteSettingsValue;

  private constructor(
      readonly id: string,
      readonly defaultValue: SiteSettingsValue,
      private readonly decoder: SiteSettingsManifestDecoder,
      private readonly encoder: SiteSettingsManifestEncoder) {
    this.value = defaultValue;
  }

  /**
   * Attempts to load a value from local storage.
   */
  load() {
    this.value = this.getFromLocalStorage();
  }

  get(): SiteSettingsValue {
    return this.value;
  }

  set(newValue: SiteSettingsValue) {
    this.value = newValue;
    this.sync();
  }

  reset() {
    this.set(this.defaultValue);
  }

  private sync() {
    localStorage.setItem(this.id, this.encoder(this.value));
  }

  private getFromLocalStorage(): SiteSettingsValue {
    if (!window.localStorage) return this.defaultValue;
    if (localStorage.getItem(this.id) == null) return this.defaultValue;
    return this.decoder(localStorage.getItem(this.id));
  }

}

export class SiteSettings {

  private constructor() {}

  /**
   * Loads all site settings from local storage if possible.
   */
  static loadAll() {
    SiteSettingsManifest.SHOW_VISUALIZATION.load();
    SiteSettingsManifest.INTERVAL_TIME_MS.load();
    SiteSettingsManifest.CLICK_SOUND.load();
    SiteSettingsManifest.COLOR_MODE.load();
  }

}

type SiteSettingsManifestDecoder = (rawValue: string) => SiteSettingsValue;
type SiteSettingsManifestEncoder = (value: SiteSettingsValue) => string;
type SiteSettingsValue = string|number|boolean|ColorModes;
