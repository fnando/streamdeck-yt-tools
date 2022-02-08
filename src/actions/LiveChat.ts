import { Action, DidReceiveGlobalSettingsEvent } from "@fnando/streamdeck";

import { Settings, GlobalSettings } from "../helpers/Settings";
import { Broadcast, getBroadcasts } from "../helpers/youtube";
import * as images from "../images.json";

class LiveChat extends Action<Settings, GlobalSettings> {
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

  handleKeyDown(): void {
    if (!this.validate()) {
      return;
    }

    if (!this.broadcast) {
      this.setImage(images.chatOffline);
      return;
    }

    this.openURL(
      `${this.settings.apiEndpoint}/open-chat?id=${this.broadcast.id}`,
    );

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

    clearTimeout(this.tid);
    this.tid = setTimeout(this.refresh, 1000 * 60 * 3);

    if (this.broadcast) {
      this.setImage(images.liveChat);
    } else {
      this.setTitle("");
      this.setImage(images.chatOffline);
    }
  }
}

const liveChat = new LiveChat({
  name: "Live Chat",
  states: [{ image: "Loading", align: "middle" }],
});

export default liveChat;
