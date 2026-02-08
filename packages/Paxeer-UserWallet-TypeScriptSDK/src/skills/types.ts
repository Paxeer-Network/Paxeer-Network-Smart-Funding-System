/**
 * AI Skill type definitions
 *
 * These types define the structure of skills that AI models can use
 * to interact with the Paxeer User Stats API API.
 */

export interface Skill {
  /** Unique identifier for the skill */
  id: string;
  /** Human-readable name */
  name: string;
  /** Detailed description for the AI model */
  description: string;
  /** API method */
  method: string;
  /** API path */
  path: string;
  /** Category/tag */
  category: string;
  /** Input parameter definitions */
  parameters: SkillParameter[];
  /** Expected output description */
  outputDescription: string;
  /** Example usage for the AI model */
  examples: SkillExample[];
  /** Whether this skill modifies data */
  isMutation: boolean;
  /** Whether this skill is deprecated */
  deprecated: boolean;
  /** Related skill IDs */
  relatedSkills: string[];
  /** When to use this skill (guidance for AI) */
  whenToUse: string;
  /** When NOT to use this skill (guidance for AI) */
  whenNotToUse: string;
}

export interface SkillParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  enum?: string[];
  default?: unknown;
  example?: unknown;
  in: 'path' | 'query' | 'header' | 'body';
}

export interface SkillExample {
  title: string;
  description: string;
  input: Record<string, unknown>;
  expectedBehavior: string;
}

export interface SkillExecutionResult {
  success: boolean;
  data?: unknown;
  error?: string;
  statusCode?: number;
}

export interface SkillManifest {
  apiName: string;
  apiVersion: string;
  apiDescription: string;
  baseUrl: string;
  totalSkills: number;
  categories: { name: string; skillCount: number; description: string }[];
  skills: Skill[];
}
