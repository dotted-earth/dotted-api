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
        generationConfig: {
          temperature: 0.8,
          topP: 0.5,
          topK: 10,
        },
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

  get agent() {
    return this.llm;
  }

  runTaskAsync(task: string): Promise<GenerateContentResult> {
    let content = "";
    if (this.outputJson) {
      content += `Output format should ALWAYS be a JSON and the output should be structured like in the following JSON:
      \n${JSON.stringify(this.outputJson)}\n
      THIS EXAMPLE JSON SHOULD NEVER BE IN THE OUTPUT.
      `;
    }
    return this.llm.generateContent(content + task);
  }

  runTaskStream(task: string): Promise<GenerateContentStreamResult> {
    return this.llm.generateContentStream(task);
  }
}
