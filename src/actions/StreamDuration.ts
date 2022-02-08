import {
  Action,
  KeyDownEvent,
  DidReceiveGlobalSettingsEvent,
} from "@fnando/streamdeck";

import { elapsed } from "../helpers/elapsed";
import { Settings, GlobalSettings } from "../helpers/Settings";
import { Broadcast, getBroadcasts } from "../helpers/youtube";
import * as images from "../images.json";

class StreamDuration extends Action<Settings, GlobalSettings> {
  public settings: GlobalSettings = {
    apiEndpoint: "",
    apiKey: "",
  };

  public broadcast?: Broadcast;

  public tid = 0;

  handleDidReceiveGlobalSettings({
    settings,
  }: DidReceiveGlobalSettingsEvent<GlobalSettings>): void {
    this.settings = settings;

    if (this.validate()) {
      this.refresh();
    }
  }

  handleKeyDown(event: KeyDownEvent<Settings>): void {
    if (!this.validate()) {
      return;
    }

    this.refresh();
  }

  validate(): boolean {
    if (this.settings.apiEndpoint && this.settings.apiKey) {
      return true;
    }

    this.setImage(images.plugin);
    this.showAlert();

    return false;
  }

  async refresh() {
    this.setImage(images.Loading);
    const broadcasts = await getBroadcasts(this.settings);
    this.broadcast = broadcasts[0];
    clearInterval(this.tid);

    if (!this.broadcast) {
      this.setTitle("");
      this.setImage(images.streamOffline);
      return;
    }

    this.tid = setInterval(() => {
      const now = Date.now();
      const seconds = (now - Date.parse(this.broadcast.startedAt)) / 1000;

      this.setTitle(elapsed(seconds));
      this.setImage(images.streamReady);
    }, 500);
  }
}

const streamDuration = new StreamDuration({
  name: "Stream Duration",
  states: [{ image: "Loading", align: "middle" }],
});

export default streamDuration;
