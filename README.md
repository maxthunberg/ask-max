# Ask Max (Light)

A lightweight AI chatbot widget that represents Max Thunberg, UX Design Lead. Built to be embedded on portfolio sites, it answers questions based only on curated public material.

## 🎯 What It Does

Visitors can chat with an AI version of Max and get answers about:
- Max's background and UX leadership style
- Case studies and example projects
- Design principles and how Max works with teams
- His approach to complex enterprise systems (PLM/PDM)

**Important:** The AI only knows what's in the `/knowledge` folder. It won't answer generic questions about the world.

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase Edge Functions (Hono server)
- **AI**: OpenAI GPT-4o-mini with Retrieval Augmented Generation (RAG)
- **Embeddings**: OpenAI text-embedding-3-small
- **Storage**: Supabase KV Store for vector embeddings

### How It Works

1. **Knowledge Base**: Markdown files in `/knowledge` are split into chunks on server startup
2. **Embeddings**: Each chunk is converted to a vector embedding using OpenAI
3. **Storage**: Embeddings are stored in Supabase KV store
4. **Chat Flow**:
   - User sends a message
   - Server generates an embedding for the question
   - Finds top 3 most relevant knowledge chunks using cosine similarity
   - Sends chunks + question + system prompt to OpenAI
   - Returns AI response to user

## 📁 Project Structure

```
/knowledge/               # Knowledge base (edit these!)
  bio-max.md             # Max's background
  ux-leadership.md       # Leadership principles
  case-volvo-plm-pdm.md  # Case study 1
  case-item-management.md # Case study 2
  principles-and-values.md # Design principles

/components/
  ChatInterface.tsx      # Main chat UI component
  ChatWidget.tsx         # Floating widget version
  InfoModal.tsx          # "How it works" modal

/utils/
  chat-api.ts           # API client functions
  supabase/             # Supabase configuration

/supabase/functions/server/
  index.tsx             # Backend server with RAG implementation
  kv_store.tsx          # KV store utilities (protected)

App.tsx                 # Main demo page
```

## 🚀 Setup & Deployment

### 1. Prerequisites

- Supabase project (automatically configured in Figma Make)
- OpenAI API key

### 2. Add Your OpenAI API Key

The app will prompt you to add your OpenAI API key as an environment variable called `OPENAI_API_KEY`.

You can get an API key from: https://platform.openai.com/api-keys

### 3. Initialize Knowledge Base

The knowledge base is automatically initialized when the server starts. If you need to manually reinitialize (after updating knowledge files), you can call:

```bash
POST https://your-project.supabase.co/functions/v1/make-server-2b0a7158/init-kb
```

Or use the browser console:
```javascript
await fetch('https://your-project.supabase.co/functions/v1/make-server-2b0a7158/init-kb', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_ANON_KEY' }
});
```

## ✏️ Customizing the Knowledge Base

### Adding or Editing Knowledge

1. **Edit existing files** in `/knowledge/` or **create new markdown files**
2. Write clear, structured content (the AI will use this verbatim)
3. Use headings, lists, and paragraphs for better chunking
4. **Redeploy** or call the `/init-kb` endpoint to reindex

### Knowledge File Tips

- **Keep it focused**: Each file should cover one topic
- **Be specific**: Include concrete examples and details
- **Use clear language**: The AI will mirror your writing style
- **Chunk-friendly**: Use headings and short paragraphs (helps with chunking)
- **No sensitive data**: Only include public information

### Example Knowledge Structure

```markdown
# Topic Title

## Section 1

Clear, specific information here. Use real examples.

## Section 2

- Bullet points work well
- They're easy to chunk
- And easy for the AI to reference

## Section 3

More detailed paragraphs when needed, but keep them focused.
```

## 🎨 Customizing the Persona

The AI's personality is defined in `/supabase/functions/server/index.tsx` in the `SYSTEM_PROMPT` constant.

To change how Max "sounds":

1. Open `/supabase/functions/server/index.tsx`
2. Find the `SYSTEM_PROMPT` constant (around line 18)
3. Edit the prompt to adjust:
   - Tone (friendly, formal, casual, etc.)
   - Response style (concise, detailed, technical, etc.)
   - Personality traits
   - How to handle unknown questions
4. Redeploy the server

**Current tone**: Friendly but direct, clarity over hype, avoids buzzwords

## 🌐 Embedding the Widget

### Option 1: React Component (Recommended)

If your portfolio is built with React, import the widget directly:

```tsx
import { ChatWidget } from './components/ChatWidget';

function MyPortfolio() {
  return (
    <div>
      {/* Your portfolio content */}
      <ChatWidget theme="light" />
    </div>
  );
}
```

### Option 2: Standalone Script (Future)

For non-React sites, you'll need to:

1. Build a standalone bundle of the widget
2. Host it on your domain
3. Add the embed script

**Note**: The standalone script requires additional build configuration not included in this prototype. Contact your developer to set this up.

### Widget Customization

The widget accepts these props:

```tsx
<ChatWidget 
  theme="light"  // or "dark" (future feature)
/>
```

## 🔒 Privacy & Security

### What's Private

- ✅ No conversation history stored long-term
- ✅ API keys kept server-side only
- ✅ Minimal logging (errors only)
- ✅ No connection to private data sources

### What's Logged

- Server errors (for debugging)
- Knowledge base initialization status
- Chat request metadata (timestamp, chunk count)

### User Guidance

The chat includes a privacy notice:
> "This is a light AI version of Max based only on selected public material. Do not share sensitive or confidential information in this chat."

## 🔧 Configuration

### Environment Variables

Set in Supabase (automatically managed in Figma Make):

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `SUPABASE_URL`: Your Supabase project URL (auto-configured)
- `SUPABASE_ANON_KEY`: Public anon key (auto-configured)
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (auto-configured)

### Tuning Parameters

In `/supabase/functions/server/index.tsx`, you can adjust:

```typescript
// Chunking
const CHUNK_SIZE = 500;        // Characters per chunk
const CHUNK_OVERLAP = 100;     // Overlap between chunks

// Search
const topK = 3;                // Number of relevant chunks to include

// OpenAI
model: 'gpt-4o-mini',          // Model to use
temperature: 0.7,              // Response creativity (0-1)
max_tokens: 500,               // Max response length
```

## 📊 Testing

### Test the Chat Locally

1. Open the app in your browser
2. Click "Full Page Demo" tab
3. Try these test questions:
   - "Who is Max?"
   - "What's Max's leadership style?"
   - "Tell me about the Volvo case study"
   - "What are Max's design principles?"
   - "What's the weather today?" (should say it doesn't know)

### Test the Widget

1. Click "Widget Demo" tab
2. Click the "Ask Max" button in the bottom-right
3. Verify the chat opens in a floating panel
4. Test that it closes properly

## 🐛 Troubleshooting

### "OpenAI API key not configured"

- Make sure you've added your OpenAI API key using the prompt
- Check that the environment variable `OPENAI_API_KEY` is set

### "Knowledge base not initialized"

- The server should initialize automatically on startup
- Manually call the `/init-kb` endpoint (see Setup section)
- Check server logs for initialization errors

### Responses are generic or wrong

- Check that your knowledge files contain enough specific information
- Make sure the knowledge base was reindexed after updating files
- Try adjusting the `topK` parameter to include more context chunks

### Chat is slow

- OpenAI API calls can take 2-5 seconds
- Consider upgrading to a faster model (but more expensive)
- Check your internet connection

### Widget doesn't appear

- Make sure you're on the "Widget Demo" tab
- Check browser console for errors
- Verify the ChatWidget component is imported correctly

## 🔮 Future Enhancements

Ideas for extending this prototype:

- [ ] Standalone JavaScript embed script for non-React sites
- [ ] Dark theme support
- [ ] Conversation export feature
- [ ] Analytics dashboard (question frequency, topics, etc.)
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Integration with calendar for booking calls
- [ ] A/B testing different personas

## 📝 Code Comments

Key sections are well-commented:

- **Embedding generation**: `/supabase/functions/server/index.tsx` line 40
- **Vector search**: `/supabase/functions/server/index.tsx` line 126
- **System prompt**: `/supabase/functions/server/index.tsx` line 18
- **Chat API route**: `/supabase/functions/server/index.tsx` line 167

## 💡 Tips

1. **Keep knowledge files up-to-date**: Old information = bad experience
2. **Test thoroughly**: Try asking questions in different ways
3. **Monitor usage**: Check server logs occasionally for errors
4. **Iterate on the prompt**: Small changes to the system prompt can significantly affect responses
5. **Don't over-engineer**: This is a "light" version - keep it simple!

## 📬 Support

For issues or questions about this implementation:
1. Check the troubleshooting section above
2. Review server logs for error messages
3. Verify your OpenAI API key has sufficient credits
4. Test with simple questions first to isolate the issue

---

Built with Figma Make for Max Thunberg's portfolio.
