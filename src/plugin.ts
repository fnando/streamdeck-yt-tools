import { Plugin } from "@fnando/streamdeck";
import * as config from "./streamdeck.json";
import streamDuration from "./actions/StreamDuration";
import subscribers from "./actions/Subscribers";
import liveChat from "./actions/LiveChat";

const plugin = new Plugin({
  ...config,
  actions: [streamDuration, subscribers, liveChat],
});

export default plugin;
