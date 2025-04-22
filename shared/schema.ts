import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  missionStatement: text("mission_statement"),
  keywords: text("keywords").array(),
  tone: text("tone"),
  narrative: json("narrative"),
  demographics: text("demographics").array(),
  psychographics: text("psychographics").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const colors = pgTable("colors", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id").notNull(),
  name: text("name").notNull(),
  hexValue: text("hex_value").notNull(),
  rgbValue: text("rgb_value"),
  category: text("category"), // primary, secondary, accent, etc.
});

export const typography = pgTable("typography", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id").notNull(),
  fontFamily: text("font_family").notNull(),
  category: text("category"), // headings, body, etc.
  weights: text("weights").array(),
  styles: text("styles").array(),
});

export const logoAssets = pgTable("logo_assets", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id").notNull(),
  url: text("url").notNull(),
  type: text("type"), // primary, secondary, monochrome, etc.
  format: text("format"), // svg, png, etc.
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
});

export const insertBrandSchema = createInsertSchema(brands).pick({
  userId: true,
  name: true,
  tagline: true,
  missionStatement: true,
  keywords: true,
  tone: true,
  narrative: true,
  demographics: true,
  psychographics: true,
});

export const insertColorSchema = createInsertSchema(colors).pick({
  brandId: true,
  name: true,
  hexValue: true,
  rgbValue: true,
  category: true,
});

export const insertTypographySchema = createInsertSchema(typography).pick({
  brandId: true,
  fontFamily: true,
  category: true,
  weights: true,
  styles: true,
});

export const insertLogoAssetSchema = createInsertSchema(logoAssets).pick({
  brandId: true,
  url: true,
  type: true,
  format: true,
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type Brand = typeof brands.$inferSelect;

export type InsertColor = z.infer<typeof insertColorSchema>;
export type Color = typeof colors.$inferSelect;

export type InsertTypography = z.infer<typeof insertTypographySchema>;
export type Typography = typeof typography.$inferSelect;

export type InsertLogoAsset = z.infer<typeof insertLogoAssetSchema>;
export type LogoAsset = typeof logoAssets.$inferSelect;

// Form schemas
export const brandProfileFormSchema = z.object({
  name: z.string().min(2, { message: "Brand name must be at least 2 characters long" }),
  tagline: z.string().optional(),
  missionStatement: z.string().max(250, { message: "Mission statement should be less than 250 characters" }).optional(),
  keywords: z.array(z.string()).optional(),
  tone: z.string().optional(),
  demographics: z.array(z.string()).optional(),
  psychographics: z.array(z.string()).optional(),
});

export type BrandProfileFormValues = z.infer<typeof brandProfileFormSchema>;
