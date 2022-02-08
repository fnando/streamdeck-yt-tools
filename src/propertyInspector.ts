import { PropertyInspector, SettingsEvent } from "@fnando/streamdeck";

import { Settings } from "./helpers/Settings";
import plugin from "./plugin";

class DefaultPropertyInspector extends PropertyInspector {
  public settings: Settings = { apiEndpoint: "", apiKey: "" };
  public apiEndpointInput: HTMLInputElement;
  public apiKeyInput: HTMLInputElement;
  public saveButton: HTMLButtonElement;

  override handleDidConnectToSocket(): void {
    this.apiEndpointInput = document.querySelector("#apiEndpoint");
    this.apiKeyInput = document.querySelector("#apiKey");
    this.saveButton = document.querySelector("#save");

    this.saveButton.disabled = false;

    this.saveButton.onclick = () => {
      if (!this.apiEndpointInput.value || !this.apiKeyInput.value) {
        alert("Please inform both the api endpoint and key.");
        return;
      }

      this.setGlobalSettings<Settings>({
        apiEndpoint: this.apiEndpointInput.value,
        apiKey: this.apiKeyInput.value,
      });
    };

    document.querySelectorAll<HTMLElement>("[data-url]").forEach(node => {
      node.onclick = () => {
        this.openUrl(node.dataset.url);
      }
    });
  }

  override handleDidReceiveGlobalSettings({
    settings,
  }: SettingsEvent<Settings>): void {
    this.settings = settings;

    this.fillInForm();
  }

  fillInForm() {
    this.apiEndpointInput.value = this.settings.apiEndpoint ?? "";
    this.apiKeyInput.value = this.settings.apiKey ?? "";
  }
}

const propertyInspector = new DefaultPropertyInspector({ plugin });

propertyInspector.run();
