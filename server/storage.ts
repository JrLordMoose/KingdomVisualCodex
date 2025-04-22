import { users, type User, type InsertUser } from "@shared/schema";
import session from "express-session";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(userId: number): Promise<void>;
  sessionStore: any; // For session storage
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  sessionStore: any;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    
    // Create a simple in-memory session store
    const createMemoryStore = require('memorystore');
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      fullName: insertUser.fullName || null,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserLastLogin(userId: number): Promise<void> {
    // In a real implementation, we would update a lastLogin field
    // For this in-memory implementation, we'll do nothing
    return Promise.resolve();
  }
}

export const storage = new MemStorage();
