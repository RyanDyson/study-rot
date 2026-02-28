import dotenv from "dotenv";
import {
  PGVectorStore,
  DistanceStrategy,
} from "@langchain/community/vectorstores/pgvector";
import { BedrockEmbeddings } from "@langchain/aws";
import { Document } from "@langchain/core/documents";
import { PoolConfig } from "pg";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

const embeddings = new BedrockEmbeddings({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
  model: "amazon.titan-embed-text-v2:0",
});

export const generateVectorStore = async (file_name: string) => {
  const config = {
    postgresConnectionOptions: {
      connectionString: DATABASE_URL,
    } as PoolConfig,
    tableName: "vectors",
    collectionTableName: "collections",
    collectionName: file_name,
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

  return vectorStore;
};

export const loadVectorStore = async (file_name: string) => {
  const config = {
    postgresConnectionOptions: {
      connectionString: DATABASE_URL,
    } as PoolConfig,
    tableName: "vectors",
    collectionTableName: "collections",
    collectionName: file_name,
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

  return vectorStore;
};

export const embedDocuments = async (
  vectorStore: PGVectorStore,
  documents: Document[],
) => {
  const ids = documents.map(() => uuidv4());

  await vectorStore.addDocuments(documents, { ids: ids });
};

export const retrieveDocuments = async (
  vectorStore: PGVectorStore,
  query: string,
  k: number,
) => {
  if (!vectorStore) {
    throw new Error("Vector store is not initialized");
  }
  const results = await vectorStore
    .asRetriever({ k: k, searchType: "similarity" })
    .invoke(query);
  return results;
};
