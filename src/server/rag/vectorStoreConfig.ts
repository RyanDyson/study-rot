import {
  PGVectorStore,
  DistanceStrategy,
} from "@langchain/community/vectorstores/pgvector";
import { BedrockEmbeddings, ChatBedrockConverse } from "@langchain/aws";
// import { BedrockChat } from "@langchain/community";
// import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { PoolConfig } from "pg";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

// const POSTGRES_USER = process.env.POSTGRES_USER;
// const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
// const POSTGRES_DB = process.env.POSTGRES_DB;
// const POSTGRES_PORT = process.env.POSTGRES_PORT;
const DATABASE_URL = process.env.DATABASE_URL;

const embeddings = new BedrockEmbeddings({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
  model: "amazon.titan-embed-text-v2:0",
});

const config = {
  postgresConnectionOptions: {
    connectionString: DATABASE_URL,
  } as PoolConfig,
  tableName: "testlangchainjs",
  collectionTableName: "collections",
  collectionName: "documents",
  columns: {
    idColumnName: "id",
    vectorColumnName: "vector",
    contentColumnName: "content",
    metadataColumnName: "metadata",
  },
  // supported distance strategies: cosine (default), innerProduct, or euclidean
  distanceStrategy: "cosine" as DistanceStrategy,
};

const vectorStore = await PGVectorStore.initialize(embeddings, config);

export default vectorStore;

const document1: Document = {
  pageContent: "The powerhouse of the cell is the mitochondria",
  metadata: { source: "https://example.com" },
};

const document2: Document = {
  pageContent: "Buildings are made out of brick",
  metadata: { source: "https://example.com" },
};

const document3: Document = {
  pageContent: "Mitochondria are made out of lipids",
  metadata: { source: "https://example.com" },
};

const document4: Document = {
  pageContent: "The 2024 Olympics are in Paris",
  metadata: { source: "https://example.com" },
};

const documents = [document1, document2, document3, document4];

const ids = [uuidv4(), uuidv4(), uuidv4(), uuidv4()];

await vectorStore.addDocuments(documents, { ids: ids });
const results = await vectorStore.similaritySearch(
  "What are mitochondria made out of?",
  2,
);
console.log(results);

const model = new ChatBedrockConverse({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
  model: "amazon.nova-pro-v1:0",
});

const response = await model.invoke([
  [
    "system",
    "You are a helpful assistant that answers questions about the content of documents.",
  ],
  ["user", "What are mitochondria made out of?"],
  ["assistant", "The following documents may contain relevant information"],
  ["assistant", results.map((result) => result.pageContent).join("\n")],
]);

console.log(response);
