/**
 * Example: Using skills with an AI agent
 *
 * This file demonstrates how to wire up the generated skills
 * with various AI frameworks.
 */

import { executeSkill } from '../src/skills/executor';
import { skills, skillsByCategory } from '../src/skills/definitions';
import { skillManifest } from '../src/skills/manifest';
import { openAITools } from '../src/skills/openai-functions';
import { langChainToolDefs } from '../src/skills/langchain-tools';
import { httpClient } from '../src/lib/http-client';

// ============================================
// 1. Configure the SDK
// ============================================

httpClient.configure({
  baseUrl: 'https://us-east-1.user-stats.sidiora.exchange',
  token: 'your-auth-token',
});

// ============================================
// 2. Direct skill execution
// ============================================

async function directExecution() {
  // Execute a skill by ID
  const result = await executeSkill('healthCheck', {});

  if (result.success) {
    console.log('Result:', result.data);
  } else {
    console.error('Error:', result.error);
  }
}

// ============================================
// 3. Browse available skills
// ============================================

function browseSkills() {
  console.log(`API: ${skillManifest.apiName} v${skillManifest.apiVersion}`);
  console.log(`Total skills: ${skillManifest.totalSkills}`);
  console.log();

  for (const [category, categorySkills] of Object.entries(skillsByCategory)) {
    console.log(`[\x1b[36m${category}\x1b[0m] (${categorySkills.length} skills)`);
    for (const skill of categorySkills) {
      const mutation = skill.isMutation ? ' (mutation)' : '';
      console.log(`  - ${skill.id}: ${skill.name}${mutation}`);
    }
    console.log();
  }
}

// ============================================
// 4. OpenAI Function Calling
// ============================================

/*
import OpenAI from 'openai';

const openai = new OpenAI();

async function chatWithTools() {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: 'List all available pets' }],
    tools: openAITools,
  });

  const toolCall = response.choices[0].message.tool_calls?.[0];
  if (toolCall) {
    const args = JSON.parse(toolCall.function.arguments);
    const result = await executeSkill(toolCall.function.name, args);
    console.log(result);
  }
}
*/

// ============================================
// 5. LangChain Agent
// ============================================

/*
import { ChatOpenAI } from '@langchain/openai';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';

async function langchainAgent() {
  const llm = new ChatOpenAI({ model: 'gpt-4' });
  const tools = langChainToolDefs.map(def => new DynamicStructuredTool(def));
  // ... create agent and executor
}
*/
