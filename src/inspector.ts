import { Inspector, DidReceiveGlobalSettingsEvent } from "@fnando/streamdeck";

import { GlobalSettings } from "./helpers/Settings";
import plugin from "./plugin";

class DefaultInspector extends Inspector {
  public settings: GlobalSettings = { apiEndpoint: "", apiKey: "" };
  public apiEndpointInput: HTMLInputElement;
  public apiKeyInput: HTMLInputElement;
  public saveButton: HTMLButtonElement;

  handleDidConnectToSocket(): void {
    this.apiEndpointInput = document.querySelector("#apiEndpoint");
    this.apiKeyInput = document.querySelector("#apiKey");
    this.saveButton = document.querySelector("#save");

    this.saveButton.disabled = false;

    this.saveButton.onclick = () => {
      if (!this.apiEndpointInput.value || !this.apiKeyInput.value) {
        alert("Please inform both the api endpoint and key.");
        return;
      }

      this.setGlobalSettings({
        apiEndpoint: this.apiEndpointInput.value,
        apiKey: this.apiKeyInput.value,
      });
    };

    document.querySelectorAll<HTMLElement>("[data-url]").forEach((node) => {
      node.onclick = () => {
        this.openURL(node.dataset.url);
      };
    });
  }

  handleDidReceiveGlobalSettings({
    settings,
  }: DidReceiveGlobalSettingsEvent<GlobalSettings>): void {
    this.settings = settings;

    this.fillInForm();
  }

  fillInForm() {
    this.apiEndpointInput.value = this.settings.apiEndpoint ?? "";
    this.apiKeyInput.value = this.settings.apiKey ?? "";
  }
}

const inspector = new DefaultInspector({ plugin });

inspector.run();
