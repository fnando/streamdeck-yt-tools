import { PropertyInspector } from "@fnando/streamdeck";
import plugin from "./plugin";

class DefaultPropertyInspector extends PropertyInspector {
  override handleDidConnectToSocket(): void {
    // Set up your HTML event handlers here
  }
}

const propertyInspector = new DefaultPropertyInspector({ plugin });

propertyInspector.run();
