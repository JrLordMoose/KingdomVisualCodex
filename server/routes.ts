import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { brands } from "@shared/schema";
import { insertBrandSchema } from "@shared/schema";
import { z } from "zod";

// Schema for updating a brand
const updateBrandSchema = insertBrandSchema.partial().extend({
  id: z.number()
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes (/api/register, /api/login, /api/logout, /api/user)
  setupAuth(app);
  
  // Brand management routes
  
  // Get all brands for the current user
  app.get("/api/brands", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user.id;
      const userBrands = await db.select().from(brands).where(eq(brands.userId, userId));
      res.json(userBrands);
    } catch (error) {
      console.error("Error fetching brands:", error);
      res.status(500).json({ message: "Failed to fetch brands" });
    }
  });
  
  // Get the current active brand
  app.get("/api/brands/current", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user.id;
      // Get the most recently updated brand for the user
      const [currentBrand] = await db.select()
        .from(brands)
        .where(eq(brands.userId, userId))
        .orderBy(brands.updatedAt)
        .limit(1);
      
      if (!currentBrand) {
        return res.status(404).json({ message: "No brand found for user" });
      }
      
      res.json(currentBrand);
    } catch (error) {
      console.error("Error fetching current brand:", error);
      res.status(500).json({ message: "Failed to fetch current brand" });
    }
  });
  
  // Get a specific brand by ID
  app.get("/api/brands/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const brandId = parseInt(req.params.id);
      const userId = req.user.id;
      
      if (isNaN(brandId)) {
        return res.status(400).json({ message: "Invalid brand ID" });
      }
      
      // Make sure the brand belongs to the current user
      const [brand] = await db.select()
        .from(brands)
        .where(and(eq(brands.id, brandId), eq(brands.userId, userId)));
      
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      
      res.json(brand);
    } catch (error) {
      console.error("Error fetching brand:", error);
      res.status(500).json({ message: "Failed to fetch brand" });
    }
  });
  
  // Create a new brand
  app.post("/api/brands", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user.id;
      const brandData = req.body;
      
      // Validate the input
      const validatedData = insertBrandSchema.parse({
        ...brandData,
        userId
      });
      
      // Insert the brand
      const [newBrand] = await db.insert(brands)
        .values(validatedData)
        .returning();
      
      res.status(200).json(newBrand);
    } catch (error) {
      console.error("Error creating brand:", error);
      res.status(400).json({ message: "Failed to create brand" });
    }
  });
  
  // Update a brand by ID
  app.put("/api/brands/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const brandId = parseInt(req.params.id);
      const userId = req.user.id;
      
      if (isNaN(brandId)) {
        return res.status(400).json({ message: "Invalid brand ID" });
      }
      
      // Verify the brand exists and belongs to the user
      const [existingBrand] = await db.select()
        .from(brands)
        .where(and(eq(brands.id, brandId), eq(brands.userId, userId)));
      
      if (!existingBrand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      
      // Validate the input (partial validation allows updating only some fields)
      const brandData = req.body;
      const validatedData = updateBrandSchema.partial().parse({
        ...brandData,
        id: brandId
      });
      
      // Remove id from update data
      const { id, ...updateData } = validatedData;
      
      // Update the brand
      const [updatedBrand] = await db.update(brands)
        .set({
          ...updateData,
          updatedAt: new Date()
        })
        .where(eq(brands.id, brandId))
        .returning();
      
      res.json(updatedBrand);
    } catch (error) {
      console.error("Error updating brand:", error);
      res.status(400).json({ message: "Failed to update brand" });
    }
  });
  
  // Delete a brand by ID
  app.delete("/api/brands/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const brandId = parseInt(req.params.id);
      const userId = req.user.id;
      
      if (isNaN(brandId)) {
        return res.status(400).json({ message: "Invalid brand ID" });
      }
      
      // Verify the brand exists and belongs to the user
      const [existingBrand] = await db.select()
        .from(brands)
        .where(and(eq(brands.id, brandId), eq(brands.userId, userId)));
      
      if (!existingBrand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      
      // Delete the brand
      await db.delete(brands)
        .where(eq(brands.id, brandId));
      
      res.status(200).json({ message: "Brand deleted successfully" });
    } catch (error) {
      console.error("Error deleting brand:", error);
      res.status(500).json({ message: "Failed to delete brand" });
    }
  });
  
  // Add routes for typography management
  app.get("/api/typography", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      // This is a placeholder implementation - add proper typography fetching here
      // You would typically get typography data for the current user's active brand
      res.json([]);
    } catch (error) {
      console.error("Error fetching typography:", error);
      res.status(500).json({ message: "Failed to fetch typography data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
