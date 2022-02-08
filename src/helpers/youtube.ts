import { GlobalSettings } from "./Settings";

export type Broadcast = {
  id: string;
  startedAt: string;
  liveChatId: string;
};

export type Channel = {
  subscriberCount: number;
};

export async function getBroadcasts(
  settings: GlobalSettings,
): Promise<Broadcast[]> {
  const endpoint = settings.apiEndpoint.replace(/\/$/, "");
  const url = `${endpoint}/broadcasts?status=active&_key=camelcase`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${settings.apiKey}` },
  });
  const broadcasts = await response.json();

  return broadcasts;
}

export async function getChannel(settings: GlobalSettings): Promise<Channel> {
  const endpoint = settings.apiEndpoint.replace(/\/$/, "");
  const url = `${endpoint}/channel?_key=camelcase`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${settings.apiKey}` },
  });
  const channel = await response.json();

  return channel;
}
