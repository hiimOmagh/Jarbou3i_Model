import { defineLensAdapter } from "../../core/lens-registry.js";

export function createStrategicLensAdapter(services) {
  return defineLensAdapter({
    id: "strategic",
    contractId: "strategic-analysis-v1",
    schemaVersion: "1.1.0",
    modelSectionCount: 6,
    accent: "strategic",
    ...services,
  });
}
