import { GoogleGenerativeAI } from "@google/generative-ai";

import type {
  FunctionDeclarationsTool,
  GenerateContentResult,
  GenerateContentStreamResult,
  GenerativeModel,
  ModelParams,
  RequestOptions,
  ToolConfig,
} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(Bun.env.GOOGLE_GEMINI_AI_KEY);

type Model =
  | "gemini-1.5-flash"
  | "gemini-1.5-pro"
  | "gemini-1.0-pro"
  | "gemini-1.5-flash-latest";

export class AiAgent {
  private llm: GenerativeModel;
  private outputJson?: Record<string, any>;

  constructor({
    model,
    role,
    outputJson,
    tools,
    toolsConfig,
    requestOptions,
  }: {
    model: Model;
    role: ModelParams["systemInstruction"];
    outputJson?: Record<string, any>;
    tools?: FunctionDeclarationsTool[];
    toolsConfig?: ToolConfig;
    requestOptions?: RequestOptions;
  }) {
    this.llm = genAI.getGenerativeModel(
      {
        model: model,
        systemInstruction: role,
        tools: tools,
        toolConfig: toolsConfig,
      },
      outputJson
        ? {
            ...requestOptions,
            customHeaders: {
              response_mime_type: "application/json",
            },
          }
        : requestOptions
    );

    this.outputJson = outputJson;
  }

  runTaskAsync(task: string): Promise<GenerateContentResult> {
    let content = "";
    if (this.outputJson) {
      content += `Output format should be a JSON and the example should be structured in the following way:\n${JSON.stringify(
        this.outputJson
      )}\n`;
    }
    return this.llm.generateContent(content + task);
  }

  runTaskStream(task: string): Promise<GenerateContentStreamResult> {
    return this.llm.generateContentStream(task);
  }
}
