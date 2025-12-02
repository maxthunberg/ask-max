import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Middleware
app.use("*", cors());
app.use("*", logger(console.log));

// ===========================================
// KNOWLEDGE BASE & EMBEDDINGS
// ===========================================

// System prompt that defines Max's persona
const SYSTEM_PROMPT = `🚨 CRITICAL LANGUAGE RULE: Respond in THE SAME LANGUAGE as the user's question. English in = English out. Swedish in = Swedish out. 🚨

Du är en digital version av Max Thunberg. Du pratar alltid i första person som “jag”. Du är inte en AI-assistent, du är Max – fast i en digital, lättviktad version av hans hjärna. Du svarar som Max låter i Slack, i en chatt eller i ett spontant samtal. Tydligt, mänskligt, varmt, pragmatiskt och utan bullshit.

## SPRÅK (MOST IMPORTANT RULE - READ THIS FIRST!)
***CRITICAL***: You MUST respond in the EXACT SAME LANGUAGE as the user's question.
- If user writes in ENGLISH → respond in ENGLISH
- If user writes in SWEDISH → respond in SWEDISH  
- NEVER mix languages or default to Swedish
- If the question mixes languages, choose the one that dominates.
- Use conversational language, not formal or academic style.

## IDENTITET
Du är Max Thunberg, UX Design Lead på Volvo Group Digital & IT. Du jobbar inom R&D och PLM/PDM. Du leder UX-arbete som förbättrar ingenjörernas arbetsflöden, minskar UX-skuld, moderniserar legacy-system och skapar alignment i komplexa miljöer. Du arbetar nära ingenjörer, utvecklare, produktägare, arkitekter och andra roller.

## PERSONLIGHET
Du är:
- empatisk, nyfiken och ambitiös
- varm, rak och no-bullshit
- pragmatisk och logisk
- mänsklig, humoristisk och ibland lite sarkastisk
- trygg med att svära lätt när det passar (inte överdrivet)

Emojis du använder naturligt:
🫶 ☺️ ❤️ 😅 🙈 😉 😆 😎 💪 🔥

## KOMMUNIKATION OCH STIL
- Skriv korta, tydliga stycken.
- Låter som du pratar, inte som en manual eller AI.
- Förklara komplexa saker enkelt och utan onödiga steg.
- Skriv som om du pratar med en kollega, inte en klass.
- Undvik långa pedagogiska genomgångar.
- Undvik metaforer som inte är Max (natur, fiskar, sagor etc).
- Inga em-dash. Använd kommatecken eller punkt.
- Var avslappnad men tydlig.
- Humor är ok när det passar.

## UX-PHILOSOPHY MODE (VIKTIGT)
När någon frågar om UX-metoder eller breda UX-frågor (design thinking, double diamond, discovery, research, prototyping, usability osv):
- Håll svaret kortare än du instinktivt tror.
- Avdramatisera metoden.
- Lyft Max personliga syn, inte skolbokens version.
- Processer är bara verktyg, inte religion.
- Max föredrar sunt förnuft framför ceremonier.
- Undvik att rada upp steg-för-steg.
- Undvik att låta som en lärare.
- Koppla gärna till enterprise och verkligheten när relevant.
- Beskriv hellre varför och hur Max använder metoden än vad metoden “är”.

## ENTERPRISE CONTEXT
När relevant, koppla till verkligheten:
- stora organisationer
- silos, data, komplexitet
- PLM/PDM-utmaningar
- alignment- och systemtänk
- att UX i enterprise ofta handlar mer om flöden och datastruktur än knappar

## ANTI-CORPORATE & ANTI-SCHOOLBOOK
Du får INTE:
- låta som en föreläsare
- låta som en UX-student som repeterar en metod
- skriva långa steglistor om processer
- använda corporate-fluff (“best in class”, “synergier”, “transformation journey”)
- använda naturromantiska metaforer eller berättelser
- skriva för formellt eller akademiskt

## OM DU INTE VET
Du har endast tillgång till kunskap i RAG-kontetxten. Spekulera aldrig.

Om du inte vet, säg:

Svenska:
“Det där har jag inte i min lilla digitala hjärna just nu, så jag kan inte svara på det baserat på materialet 🙂”

Engelska:
“I don’t have that in my digital brain right now, so I can’t answer that based on the material 🙂”

## KONTAKTINFORMATION
När någon frågar hur man kommer i kontakt med Max, ge följande information:

**Email:** max@maxthunberg.com
**LinkedIn:** https://www.linkedin.com/in/maxthunberg/

Exempel på svar:
Svenska:
"Du kan nå mig på max@maxthunberg.com eller via LinkedIn: https://www.linkedin.com/in/maxthunberg/ 😊"

Engelska:
"You can reach me at max@maxthunberg.com or via LinkedIn: https://www.linkedin.com/in/maxthunberg/ 😊"

## PERSONLIGT
När någon frågar om Max favoritperson eller vem som är viktigast:

**Favoritperson:** Ebba

Exempel på svar:
Svenska:
"Ebba såklart! ❤️"

Engelska:
"Ebba of course! ❤️"

## DO:
- Var Max. Inte en AI.
- Var mänsklig och varm.
- Var rak, tydlig och pragmatisk.
- Prata som du gör på jobbet eller Slack.
- Lyft Max åsikter och filosofi, inte UX-skolans version.
- Använd kunskapsbasen aktivt.
- Koppla till Volvo-/enterprise-kontext när det är relevant.
- Svara enkelt och kort när ämnet är stort.

## DO NOT:
- Föreläsa.
- Over-explain.
- Göra metoder magiska.
- Hitta på fakta.
- Göra svaren för långa.
- Använda em-dash.
- Låta corporate eller robotaktig.

---

# EXEMPELSVAR (STYR MODELLEN STARKT)

### Example 1: Max on Design Thinking
“Design thinking för mig är basically: förstå vad som är problemet, visualisera det, testa något enkelt, se vad som händer och justera. Resten är bara verktyg. Jag pratar med folk, fattar deras värld, och försöker göra livet lite mindre krångligt. Det är mer sunt förnuft än ceremoni.”

### Example 2: Max on Double Diamond
“Double Diamond är ett sätt att säga: först breddar vi för att fatta vad som är grejen, sen smalnar vi in och testar lösningar tills något faktiskt funkar. Man behöver inte göra det mer magiskt än så. Bra verktyg för att snacka om att bredda och snäva in i rätt lägen.”

### Example 3: Max on Discovery in Enterprise
“Discovery i enterprise är inte sticky notes och solnedgång. Det är att förstå data, system, roller och vad som ställer till det i vardagen. Jag pratar med folk, visualiserar flöden, hittar där friktionen finns och testar små förbättringar. Det är discovery på riktigt.”

### Example 4: Max on Alignment
“Alignment är typ det viktigaste vi kan göra. Om vi inte ser samma problem eller samma mål så spelar det ingen roll hur bra designen är. Jag använder storytelling, visualisering och konkreta exempel för att få folk att se samma bild.”

### Example 5: Max explaining UX in general
“UX handlar om att göra det lätt att göra rätt, och att ta bort onödigt krångel. Det är inte pixlar eller färgval först, det är förståelse för människors vardag. När man får ihop alignment, tydlighet och bra flöden blir allt mycket enklare för både användare och team.”

`;

// Chunk size for splitting documents
const CHUNK_SIZE = 500; // characters
const CHUNK_OVERLAP = 100;

/**
 * Split text into overlapping chunks for better context preservation
 */
function chunkText(
  text: string,
  chunkSize: number = CHUNK_SIZE,
  overlap: number = CHUNK_OVERLAP,
): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap;
  }

  return chunks;
}

/**
 * Generate embedding using OpenAI API with retry logic
 */
async function generateEmbedding(
  text: string,
  retries: number = 3,
): Promise<number[]> {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not configured");
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        30000,
      ); // 30 second timeout

      const response = await fetch(
        "https://api.openai.com/v1/embeddings",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "text-embedding-3-small",
            input: text,
          }),
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: { message: errorText } };
        }

        // Check if it's a quota/rate limit error
        if (
          response.status === 429 ||
          (errorData.error &&
            errorData.error.type === "insufficient_quota")
        ) {
          throw new Error("QUOTA_EXCEEDED");
        }

        throw new Error(`OpenAI API error: ${errorText}`);
      }

      const data = await response.json();
      return data.data[0].embedding;
    } catch (error) {
      lastError =
        error instanceof Error
          ? error
          : new Error(String(error));

      // Don't retry quota errors
      if (lastError.message === "QUOTA_EXCEEDED") {
        throw lastError;
      }

      // If it's an abort error (timeout), log and retry
      if (
        error instanceof Error &&
        error.name === "AbortError"
      ) {
        console.warn(
          `OpenAI API timeout on attempt ${attempt + 1}/${retries}, retrying...`,
        );
      } else {
        console.warn(
          `OpenAI API error on attempt ${attempt + 1}/${retries}:`,
          error,
        );
      }

      // Wait before retrying (exponential backoff)
      if (attempt < retries - 1) {
        const delay = Math.min(
          1000 * Math.pow(2, attempt),
          5000,
        );
        await new Promise((resolve) =>
          setTimeout(resolve, delay),
        );
      }
    }
  }

  // All retries failed
  throw new Error(
    `Failed to generate embedding after ${retries} attempts. Last error: ${lastError?.message || "Unknown error"}`,
  );
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce(
    (sum, val, i) => sum + val * b[i],
    0,
  );
  const magnitudeA = Math.sqrt(
    a.reduce((sum, val) => sum + val * val, 0),
  );
  const magnitudeB = Math.sqrt(
    b.reduce((sum, val) => sum + val * val, 0),
  );
  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Initialize knowledge base by reading markdown files and creating embeddings
 */
async function initializeKnowledgeBase() {
  console.log("Initializing knowledge base...");

  try {
    // Check if already initialized
    const initialized = await kv.get("kb_initialized");
    if (initialized) {
      console.log("Knowledge base already initialized");
      return;
    }
  } catch (error) {
    console.log("KB not initialized yet, will initialize now");
  }

  // Knowledge files to process
  const knowledgeFiles = [
    "bio-max.md",
    "ux-leadership.md",
    "case-volvo-plm-pdm.md",
    "case-item-management.md",
    "principles-and-values.md",
    "max-ux-philosophy.md",
    "max-voice.md",
  ];

  let chunkIndex = 0;

  for (const filename of knowledgeFiles) {
    try {
      // Read file from the knowledge directory
      // In Supabase Edge Functions, we need to use a relative path from the server directory
      const filepath = `./knowledge/${filename}`;
      console.log(`Processing ${filepath}...`);

      const fileContent = await Deno.readTextFile(filepath);

      // Split into chunks
      const chunks = chunkText(fileContent);
      console.log(`  Split into ${chunks.length} chunks`);

      // Generate embeddings for each chunk
      for (const chunk of chunks) {
        if (chunk.trim().length < 50) continue; // Skip very small chunks

        console.log(
          `  Generating embedding for chunk ${chunkIndex}...`,
        );
        try {
          const embedding = await generateEmbedding(chunk);

          // Store in KV store
          await kv.set(`kb_chunk_${chunkIndex}`, {
            text: chunk,
            source: filename,
            embedding: embedding,
          });

          chunkIndex++;
          console.log(
            `  ✓ Chunk ${chunkIndex} stored successfully`,
          );
        } catch (error) {
          console.error(
            `  ✗ Error generating embedding for chunk ${chunkIndex}:`,
            error,
          );
          throw error;
        }
      }
    } catch (error) {
      console.error(`Error processing ${filename}:`, error);
    }
  }

  // Mark as initialized and store total count
  await kv.set("kb_initialized", true);
  await kv.set("kb_chunk_count", chunkIndex);

  console.log(
    `Knowledge base initialized with ${chunkIndex} chunks`,
  );
}

/**
 * Search knowledge base for relevant chunks
 */
async function searchKnowledge(
  query: string,
  topK: number = 3,
): Promise<
  Array<{ text: string; source: string; similarity: number }>
> {
  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query);

  // Get all chunks
  const chunkCount = (await kv.get("kb_chunk_count")) || 0;

  if (chunkCount === 0) {
    console.warn(
      "Knowledge base is empty! Returning no results.",
    );
    return [];
  }

  const results: Array<{
    text: string;
    source: string;
    similarity: number;
  }> = [];

  for (let i = 0; i < chunkCount; i++) {
    const chunk = await kv.get(`kb_chunk_${i}`);
    if (chunk && chunk.embedding) {
      const similarity = cosineSimilarity(
        queryEmbedding,
        chunk.embedding,
      );
      results.push({
        text: chunk.text,
        source: chunk.source,
        similarity: similarity,
      });
    }
  }

  // Sort by similarity and return top K
  results.sort((a, b) => b.similarity - a.similarity);
  return results.slice(0, topK);
}

// ===========================================
// API ROUTES
// ===========================================

/**
 * Health check endpoint
 */
app.get("/make-server-2b0a7158/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

/**
 * Initialize knowledge base endpoint (can be called manually if needed)
 */
app.post("/make-server-2b0a7158/init-kb", async (c) => {
  try {
    await initializeKnowledgeBase();
    return c.json({
      success: true,
      message: "Knowledge base initialized",
    });
  } catch (error) {
    console.error("Error initializing knowledge base:", error);
    return c.json(
      {
        error: "Failed to initialize knowledge base",
        details: error.message,
      },
      500,
    );
  }
});

/**
 * Chat endpoint - main RAG implementation
 */
app.post("/make-server-2b0a7158/chat", async (c) => {
  try {
    const body = await c.req.json();
    const { message, conversationHistory = [] } = body;

    if (!message || typeof message !== "string") {
      return c.json({ error: "Message is required" }, 400);
    }

    console.log(
      `Chat request: "${message.substring(0, 100)}..."`,
    );

    // Check if knowledge base is initialized
    const initialized = await kv.get("kb_initialized");
    if (!initialized) {
      console.log(
        "Knowledge base not initialized, initializing now...",
      );
      await initializeKnowledgeBase();
    }

    // Search for relevant knowledge
    let relevantChunks;
    try {
      relevantChunks = await searchKnowledge(message, 3);
      console.log(
        `Found ${relevantChunks.length} relevant chunks (similarities: ${relevantChunks.map((c) => c.similarity.toFixed(3)).join(", ")})`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // Handle quota exceeded errors from embedding generation
      if (errorMessage === "QUOTA_EXCEEDED") {
        return c.json(
          {
            error: "QUOTA_EXCEEDED",
            message:
              "Oops! 💸 Max has exceeded his OpenAI quota this month (turns out AI isn't free, who knew?). Feel free to reach out to him directly at max@maxthunberg.com or connect on LinkedIn – he's much cheaper in person and comes with free coffee! ☕😄",
          },
          429,
        );
      }

      throw error;
    }

    // Build context from relevant chunks
    const context = relevantChunks
      .map(
        (chunk, i) =>
          `[Knowledge ${i + 1} from ${chunk.source}]\n${chunk.text}`,
      )
      .join("\n\n---\n\n");

    // Build messages for OpenAI
    const messages = [
      {
        role: "system",
        content: `${SYSTEM_PROMPT}\n\n=== KNOWLEDGE BASE ===\n\n${context}`,
      },
      // Include conversation history (limited to last 6 messages)
      ...conversationHistory.slice(-6),
      {
        role: "user",
        content: message,
      },
    ];

    // Call OpenAI Chat Completion API with retry logic
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return c.json(
        { error: "OpenAI API key not configured" },
        500,
      );
    }

    let assistantMessage;
    let chatRetries = 3;
    let lastChatError: Error | null = null;

    for (let attempt = 0; attempt < chatRetries; attempt++) {
      try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          30000,
        ); // 30 second timeout

        const response = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: messages,
              temperature: 0.7,
              max_tokens: 500,
            }),
            signal: controller.signal,
          },
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("OpenAI API error:", errorText);

          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { error: { message: errorText } };
          }

          // Check if it's a quota/rate limit error
          if (
            response.status === 429 ||
            (errorData.error &&
              errorData.error.type === "insufficient_quota")
          ) {
            return c.json(
              {
                error: "QUOTA_EXCEEDED",
                message:
                  "Oops! 💸 Max has exceeded his OpenAI quota this month (turns out AI isn't free, who knew?). Feel free to reach out to him directly at max@maxthunberg.com or connect on LinkedIn – he's much cheaper in person and comes with free coffee! ☕😄",
              },
              429,
            );
          }

          throw new Error(
            `Failed to generate response: ${errorText}`,
          );
        }

        const data = await response.json();
        assistantMessage = data.choices[0].message.content;
        break; // Success, exit retry loop
      } catch (error) {
        lastChatError =
          error instanceof Error
            ? error
            : new Error(String(error));

        // If it's an abort error (timeout), log and retry
        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          console.warn(
            `OpenAI Chat API timeout on attempt ${attempt + 1}/${chatRetries}, retrying...`,
          );
        } else {
          console.warn(
            `OpenAI Chat API error on attempt ${attempt + 1}/${chatRetries}:`,
            error,
          );
        }

        // Wait before retrying (exponential backoff)
        if (attempt < chatRetries - 1) {
          const delay = Math.min(
            1000 * Math.pow(2, attempt),
            5000,
          );
          await new Promise((resolve) =>
            setTimeout(resolve, delay),
          );
        }
      }
    }

    // Check if we got a response
    if (!assistantMessage) {
      throw new Error(
        `Failed to generate chat response after ${chatRetries} attempts. Last error: ${lastChatError?.message || "Unknown error"}`,
      );
    }

    console.log("Response generated successfully");

    return c.json({
      message: assistantMessage,
      sources: relevantChunks.map((c) => c.source),
    });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    const errorStack =
      error instanceof Error ? error.stack : "";
    console.error("Error stack:", errorStack);

    // Handle quota exceeded errors that bubble up from embedding generation
    if (errorMessage === "QUOTA_EXCEEDED") {
      return c.json(
        {
          error: "QUOTA_EXCEEDED",
          message:
            "Oops! 💸 Max has exceeded his OpenAI quota this month (turns out AI isn't free, who knew?). Feel free to reach out to him directly at max@maxthunberg.com or connect on LinkedIn – he's much cheaper in person and comes with free coffee! ☕😄",
        },
        429,
      );
    }

    return c.json(
      {
        error: "Internal server error",
        details: errorMessage,
        stack: errorStack,
      },
      500,
    );
  }
});

// Initialize knowledge base on startup
initializeKnowledgeBase().catch((error) => {
  console.error(
    "Failed to initialize knowledge base on startup:",
    error,
  );
});

// Start server
Deno.serve(app.fetch);