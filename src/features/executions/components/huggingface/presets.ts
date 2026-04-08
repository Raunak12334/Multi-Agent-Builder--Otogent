export type HuggingFaceModelPreset = {
  id: string;
  label: string;
  description: string;
  model: string;
};

export const huggingFaceModelPresets: HuggingFaceModelPreset[] = [
  {
    id: "general-chat",
    label: "General Chat",
    description: "Flexible everyday assistant for general work.",
    model: "meta-llama/Llama-3.3-70B-Instruct",
  },
  {
    id: "reasoning",
    label: "Reasoning",
    description: "Stronger for step-by-step thinking and analysis.",
    model: "deepseek-ai/DeepSeek-R1",
  },
  {
    id: "coding",
    label: "Coding",
    description: "Better for code generation and technical tasks.",
    model: "Qwen/Qwen3-Coder-480B-A35B-Instruct",
  },
  {
    id: "summaries",
    label: "Summaries",
    description: "Good default for short business-ready summaries.",
    model: "moonshotai/Kimi-K2-Instruct",
  },
  {
    id: "support",
    label: "Support",
    description: "Solid open model for support and ops replies.",
    model: "google/gemma-3-27b-it",
  },
];

export const defaultHuggingFaceModel =
  huggingFaceModelPresets[0]?.model ?? "meta-llama/Llama-3.3-70B-Instruct";
