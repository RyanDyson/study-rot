import { ChatBedrockConverse } from "@langchain/aws";
import { retrieveDocuments, loadVectorStore } from "./createVectorStore";

export const converseWithChatBedrock = async (
  file_name: string,
  query: string,
  k: number,
) => {
  const chat_model = new ChatBedrockConverse({
    model: "amazon.nova-pro-v1:0",
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.SECRET_ACCESS_KEY!,
    },
  });

  const vectorStore = await loadVectorStore(file_name);

  const retrievedDocuments = await retrieveDocuments(vectorStore, query, k);
  const retrievedContents = retrievedDocuments.map((doc) => doc.pageContent);

  const context = retrievedContents.join("\n\n");

  const prompt = `You are a helpful study assistant. You are to summarize a lecture material into multiple subsections in twitter-like thread format.\n\nLecture materials:\n${context}\n\n Topic: ${query}\n\n Please provide a concise summary in twitter thread format, output in this json format: { "thread": [ { "title": "title of the subsection", "content": "content of the subsection", "level": "1 for main topic, 2 for subtopic, etc.", "main_thread": true/false, "main_section": "title of the main section if available" }, ... ] }`;

  const response = await chat_model.invoke([
    {
      role: "system",
      content: [
        {
          type: "text",
          text: systemPrompt,
        },
      ],
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: userPrompt,
        },
      ],
    },
  ]);

  return response;
};
