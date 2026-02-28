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

  const prompt = `You are a helpful study assistant. Use the provided context to answer the user's question. If the context does not contain the answer, say you don't know.\n\nContext:\n${context}\n\nQuestion: ${query}`;

  const response = await chat_model.invoke([
    {
      role: "user",
      content: [
        {
          type: "text",
          text: prompt,
        },
      ],
    },
  ]);

  return response;
};
