import { PineconeClient } from '@pinecone-database/pinecone'
import dotenv from 'dotenv'
import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { OpenAI } from 'langchain/llms/openai'
import { PineconeStore } from 'langchain/vectorstores/pinecone'

dotenv.config()

const model = new OpenAI({
  temperature: 0
})

const pinecone = new PineconeClient()
await pinecone.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT
})

const pineconeIndex = await pinecone.Index(process.env.PINECONE_INDEX)
const vectorStore = await PineconeStore.fromExistingIndex(
  new OpenAIEmbeddings(),
  {
    pineconeIndex,
    textKey: 'text',
    namespace: 'teach-vue3-document'
  }
)

const chains = ConversationalRetrievalQAChain.fromLLM(
  model,
  vectorStore.asRetriever(),
  {
    returnSourceDocuments: true
  }
)

export async function chat(ctx) {
  const { message, history } = ctx.request.body
  const res = await chains.call({
    question: message,
    chat_history: history || []
  })

  return res
}
