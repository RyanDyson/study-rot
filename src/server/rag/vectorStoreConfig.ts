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
  collectionName: "GROUND_TRUTH",
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
  pageContent: "Hans likes to eat pizza",
  metadata: { source: "https://example.com" },
};

const document2: Document = {
  pageContent: "Ryan likes to jerk off to anime",
  metadata: { source: "https://example.com" },
};

const document3: Document = {
  pageContent: "Leon likes to eat pasta",
  metadata: { source: "https://example.com" },
};

const document4: Document = {
  pageContent:
    "Mitochondria are made out of two membranes, an outer membrane and a highly folded inner membrane. The inner membrane contains proteins that are responsible for the production of ATP, the energy currency of the cell. The space between the two membranes is called the intermembrane space, and the space inside the inner membrane is called the mitochondrial matrix. The outer membrane is smooth and allows small molecules to pass through, while the inner membrane is impermeable to most molecules and contains transport proteins that regulate the movement of molecules in and out of the mitochondria. The inner membrane also contains enzymes that are involved in the electron transport chain, which is a series of reactions that generate ATP through oxidative phosphorylation.",
  metadata: { source: "https://example.com" },
};

const documents = [document1, document2, document3, document4];

const ids = [uuidv4(), uuidv4(), uuidv4(), uuidv4()];

await vectorStore.addDocuments(documents, { ids: ids });
const results = await vectorStore.similaritySearch(
  "What does Ryan like to do?",
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
  ["user", "What does Ryan like to do?"],
  ["assistant", "The following documents may contain relevant information"],
  ["assistant", results.map((result) => result.pageContent).join("\n")],
]);

console.log(response);
