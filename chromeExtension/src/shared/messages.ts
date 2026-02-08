import type { ExtensionRequest, ExtensionResponse, InternalMethod } from "./types";

let counter = 0;
function nextId(): string {
  return `px_${Date.now()}_${++counter}`;
}

export function sendToBackground(
  method: ExtensionRequest["method"],
  params: unknown[] = [],
  origin = "popup",
): Promise<ExtensionResponse> {
  const request: ExtensionRequest = { id: nextId(), method, params, origin };
  return chrome.runtime.sendMessage(request);
}

export function createRequest(
  method: InternalMethod,
  ...params: unknown[]
): ExtensionRequest {
  return { id: nextId(), method, params, origin: "popup" };
}
