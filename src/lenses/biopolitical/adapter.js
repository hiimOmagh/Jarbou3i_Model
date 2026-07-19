import { defineLensAdapter } from "../../core/lens-registry.js";

export function createBiopoliticalLensAdapter(services) {
  return defineLensAdapter({
    id: "biopolitical",
    contractId: "biopolitical-training-map-v2",
    schemaVersion: "2.1.0",
    modelSectionCount: 9,
    accent: "biopolitical",
    ...services,
  });
}
