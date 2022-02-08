import { Action, SettingsEvent } from "@fnando/streamdeck";

import { Settings } from "../helpers/Settings";
import { getChannel } from "../helpers/youtube";
import { i18n } from "../helpers/i18n";
import * as images from "../images.json";

class Subscribers extends Action {
  public settings: Settings = {
    apiEndpoint: "",
    apiKey: "",
  };

  public tid = 0;

  handleDidReceiveGlobalSettings({ settings }: SettingsEvent<Settings>): void {
    this.settings = settings;

    if (this.validate()) {
      this.refresh();
    }
  }

  override handleKeyDown(): void {
    if (this.validate()) {
      this.refresh();
    }
  }

  validate(): boolean {
    if (this.settings.apiEndpoint && this.settings.apiKey) {
      return true;
    }

    this.setImage(images.plugin);
    this.showAlert();

    return false;
  }

  refresh() {
    clearInterval(this.tid);
    this.setImage(images.Loading);
    this.setTitle("");

    const update = async () => {
      const channel = await getChannel(this.settings);

      this.setTitle(
        i18n.numberToHuman(channel.subscriberCount, {
          format: "%n%u",
          units: {
            million: "M",
            thousand: "K",
            unit: "",
          },
        })
      );
      this.setImage(images.subscribersReady);
    };

    this.tid = setInterval(update, 1000 * 60 * 10);
    update();
  }
}

const subscribers = new Subscribers({
  name: "Subscribers",
  states: [{ image: "Loading", align: "middle" }],
});

export default subscribers;
