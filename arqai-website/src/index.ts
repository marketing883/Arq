/**
 * ArqAI Source Module
 *
 * Main entry point for the improved architecture.
 * This module re-exports all core, services, API, and utility modules.
 *
 * Architecture Overview:
 * - core/     - Domain models, interfaces, and events (framework-agnostic)
 * - services/ - Business logic services with dependency injection
 * - api/      - External API adapters (AI, email, database, notifications)
 * - utils/    - Shared utilities (validation, security, formatting, errors)
 *
 * Usage:
 *   import { User, LeadService, AnthropicAdapter } from "@/src";
 */

// Core domain models and interfaces
export * from "./core";

// Business logic services
export * from "./services";

// External API adapters
export * from "./api";

// Shared utilities
export * from "./utils";
