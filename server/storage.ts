import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // Storage methods will be implemented based on requirements
}

export class MemStorage implements IStorage {
  constructor() {
    // Storage implementation
  }
}

export const storage = new MemStorage();
