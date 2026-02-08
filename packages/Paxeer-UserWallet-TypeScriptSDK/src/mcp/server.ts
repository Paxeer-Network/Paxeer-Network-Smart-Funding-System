import { createInterface } from 'readline';
import { toolRegistry } from './tool-registry';
import { handleToolCall } from './tool-handlers';
import { MCPRequest, MCPResponse, MCPServerInfo, MCPToolResult } from './types';
import { httpClient } from '../lib/http-client';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Paxeer User Stats API — MCP Server
 *
 * Exposes all API endpoints as MCP tools that AI models can invoke.
 * Communicates over stdio using JSON-RPC 2.0 (MCP standard transport).
 *
 * Usage:
 *   node dist/mcp/server.js
 *
 * Environment variables:
 *   API_BASE_URL  — Base URL for the API (default: https://us-east-1.user-stats.sidiora.exchange)
 *   API_TOKEN     — Bearer token for authentication
 *   API_KEY       — API key for authentication
 */

const SERVER_INFO: MCPServerInfo = {
  name: 'paxeer-user-stats-api-mcp',
  version: '0.1.0',
  description: 'Portfolio tracking and analytics service for Paxeer Network wallets Provides real-time portfolio data token holdings transaction history PNL tracking and chart data for visualization ## Features description - **Portfolio Overview**: Complete wallet summary with native and token holdings - **Token Holdings**: Detailed token balances with USD values - **Transaction History**: Native transactions and ERC-20/721 transfers - **PNL Tracking**: Daily profit/loss calculations and history - **Chart Data**: Time-series data for portfolio analytics ## Authentication Currently no authentication required. Rate limiting applies.', 
};

// Configure HTTP client from environment
httpClient.configure({
  baseUrl: process.env.API_BASE_URL || 'https://us-east-1.user-stats.sidiora.exchange',
  token: process.env.API_TOKEN,
  apiKey: process.env.API_KEY,
});

const tools = toolRegistry;

function handleRequest(request: MCPRequest): MCPResponse {
  const { id, method, params } = request;

  switch (method) {
    case 'initialize':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {},
          },
          serverInfo: SERVER_INFO,
        },
      };

    case 'notifications/initialized':
      // No response needed for notifications
      return { jsonrpc: '2.0', id, result: {} };

    case 'tools/list':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          tools: tools.map((t) => ({
            name: t.name,
            description: t.description,
            inputSchema: t.inputSchema,
          })),
        },
      };

    case 'tools/call': {
      const toolParams = params as { name: string; arguments: Record<string, unknown> } | undefined;
      if (!toolParams) {
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32602, message: 'Missing tool call params' },
        };
      }
      // Return a placeholder — actual call is async, handled below
      return { jsonrpc: '2.0', id, result: { __async: true, toolParams } };
    }

    default:
      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `Method not found: ${method}` },
      };
  }
}

async function handleAsyncToolCall(
  id: string | number,
  toolName: string,
  args: Record<string, unknown>
): Promise<MCPResponse> {
  try {
    const result: MCPToolResult = await handleToolCall(toolName, args);
    return { jsonrpc: '2.0', id, result };
  } catch (error: any) {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        content: [{ type: 'text', text: `Error: ${error.message || 'Unknown error'}` }],
        isError: true,
      },
    };
  }
}

// stdio JSON-RPC transport
const rl = createInterface({ input: process.stdin, terminal: false });

function send(response: MCPResponse): void {
  const json = JSON.stringify(response);
  process.stdout.write(json + '\n');
}

rl.on('line', async (line: string) => {
  try {
    const request: MCPRequest = JSON.parse(line);
    const response = handleRequest(request);

    // Check if this is an async tool call
    const result = response.result as any;
    if (result?.__async) {
      const asyncResponse = await handleAsyncToolCall(
        response.id,
        result.toolParams.name,
        result.toolParams.arguments
      );
      send(asyncResponse);
    } else {
      send(response);
    }
  } catch (error: any) {
    send({
      jsonrpc: '2.0',
      id: 0,
      error: { code: -32700, message: `Parse error: ${error.message}` },
    });
  }
});

process.stderr.write(`[MCP] ${SERVER_INFO.name} v${SERVER_INFO.version} started\n`);
