import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

// Initialize the Bedrock Runtime client
const client = new BedrockRuntimeClient({
  region: "us-east-1", // Choose your preferred region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

// Function to generate embeddings
async function generateEmbedding(inputText: string): Promise<{
  embedding: number[];
  inputTokenCount: number;
}> {
  try {
    // Set the model ID for Titan Text Embeddings V2
    const modelId = "amazon.titan-embed-text-v2:0";

    // Create the request payload
    const requestBody = {
      inputText: inputText,
    };

    // Create the command
    const command = new InvokeModelCommand({
      modelId: modelId,
      body: JSON.stringify(requestBody),
      contentType: "application/json",
      accept: "application/json",
    });

    // Invoke the model
    const response = await client.send(command);

    // Parse the response
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    return {
      embedding: responseBody.embedding,
      inputTokenCount: responseBody.inputTextTokenCount,
    };
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}

// Example usage
async function main() {
  const inputText =
    "Please recommend books with a theme similar to the movie 'Inception'.";

  try {
    const result = await generateEmbedding(inputText);

    console.log(`Input text: ${inputText}`);
    console.log(`Number of input tokens: ${result.inputTokenCount}`);
    console.log(`Size of the generated embedding: ${result.embedding.length}`);
    console.log(
      `Embedding (first 10 values): ${result.embedding.slice(0, 10)}`,
    );
  } catch (error) {
    console.error("Failed to generate embedding:", error);
  }
}

main();
