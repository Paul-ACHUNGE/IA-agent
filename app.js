import { ChatGroq } from '@langchain/groq';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { Document } from '@langchain/core/documents';
import { createStuffDocumentsChain } from '@langchain/classic/chains/combine_documents'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
// import { OpenAIEmbeddings } from '@langchain/openai';
import { OllamaEmbeddings } from '@langchain/ollama';
import { MemoryVectorStore } from '@langchain/classic/vectorstores/memory';
import { createRetrievalChain } from '@langchain/classic/chains/retrieval';
import 'dotenv/config'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import express from 'express';
const app = express();
const port = 3600;

const llm = new ChatGroq({
    model: 'openai/gpt-oss-120b',
    temperature: 0.5,
    maxTokens: 512,
    apikey: process.env.GROQ_API_KEY
});
app.use((req, res, next) => {
    res.Header('Access-Control-Allow-Origin', '*');
    res.Header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.Header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
app.use(express.json());
app.use(express.json());
const pdfLoader = new PDFLoader('test.pdf');
const pdfDocs = await pdfLoader.load();

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
});
const splittedDocs = await splitter.splitDocuments(pdfDocs);

const prompt = ChatPromptTemplate.fromTemplate(
    `Reponds à la question de l'utilisateur.
    context: {context}.
    Question: {input} `
);
const infoAnthony = new Document({
    pageContent: `Anthony Chunge est un développeur web et mobile passionné par la création d'applications innovantes. Il possède une solide expérience dans le développement front-end et back-end, ainsi que dans la conception d'interfaces utilisateur intuitives. Anthony est également un fervent défenseur de l'apprentissage continu et aime partager ses connaissances avec la communauté des développeurs.`,
    // metadata: { source: 'infoAnthony' },
});
const infoAnny = new Document({
    pageContent: `Anny V. est une artiste talentueuse spécialisée dans la peinture et la sculpture. Elle a exposé ses œuvres dans plusieurs galeries renommées et a reçu de nombreux prix pour sa créativité et son originalité. Anny est également impliquée dans des projets communautaires visant à promouvoir l'art et la culture dans sa région.`,
    // metadata: { source: 'infoAnny' },
});
const chain = await createStuffDocumentsChain({
    llm,
    prompt,
    document: [...pdfDocs],
});

// const response = await chain.invoke({
//     input: "Anthony mange quoi",
//     context: [...pdfDocs]
// });

// console.log(response)

app.post('/chat', async (req, res) => {
    const useMessage = req.body.message;
    const response = conversationChain.invoke({
        input: useMessage,
        context: [...pdfDocs]
    });
    res.json({ response: response.answer });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});