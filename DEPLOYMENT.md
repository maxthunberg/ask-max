# Deployment Checklist

Follow these steps to deploy Ask Max (Light) to production.

## ✅ Pre-Deployment Checklist

### 1. Update Knowledge Base

- [ ] Edit `/supabase/functions/server/knowledge-data.ts` with real information
- [ ] Add Max's actual bio, case studies, and principles to the `KNOWLEDGE_BASE` array
- [ ] Review each entry for accuracy and clarity
- [ ] Remove any "placeholder" or "Note: This is a placeholder" text

### 2. Configure Environment Variables

- [ ] Add your OpenAI API key (the app will prompt you)
- [ ] Verify Supabase credentials are set (auto-configured in Figma Make)

### 3. Customize the Persona

- [ ] Review the `SYSTEM_PROMPT` in `/supabase/functions/server/index.tsx`
- [ ] Adjust tone and personality to match Max's style
- [ ] Test the prompt with various questions

### 4. Test Thoroughly

- [ ] Initialize the knowledge base
- [ ] Ask at least 10 different questions
- [ ] Test edge cases (irrelevant questions, unclear questions)
- [ ] Verify error handling works
- [ ] Test both desktop and mobile views
- [ ] Test the widget version

### 5. Privacy & Security Review

- [ ] Confirm no sensitive data in knowledge base
- [ ] Verify no PII is logged
- [ ] Check that API keys are server-side only
- [ ] Review privacy notice text

## 🚀 Deployment Steps

### Step 1: Deploy to Figma Make / Supabase

1. This app is already configured for Figma Make deployment
2. Supabase backend functions are automatically deployed
3. Frontend is served from the Figma Make environment

### Step 2: Initialize Knowledge Base

After deployment, initialize the knowledge base:

**Option A: Automatic (on first server start)**
- The server will automatically initialize on startup
- Check logs to confirm: "Knowledge base initialized with X chunks"

**Option B: Manual (if needed)**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/make-server-2b0a7158/init-kb \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

Or use the UI button on the main page.

### Step 3: Verify Deployment

- [ ] Visit your deployed URL
- [ ] Check that the setup instructions show "System Ready"
- [ ] Send a test message
- [ ] Verify you get a response
- [ ] Check browser console for errors
- [ ] Check Supabase logs for errors

## 🔗 Embedding on Portfolio Site

### For React-Based Portfolio

1. Copy the `/components/ChatWidget.tsx` file to your portfolio
2. Copy the chat-related dependencies
3. Import and use:

```tsx
import { ChatWidget } from './components/ChatWidget';

function Portfolio() {
  return (
    <>
      {/* Your portfolio content */}
      <ChatWidget theme="light" />
    </>
  );
}
```

### For Static HTML Portfolio

The standalone widget embed requires additional setup:

1. **Build a widget bundle** (requires build tools like Vite/Webpack)
   - Bundle React + all chat components
   - Create an entry point that mounts the widget
   - Export to a single JS file

2. **Host the bundle** on your domain

3. **Add embed script** to your portfolio:
   ```html
   <script src="https://your-domain.com/ask-max-widget.js"></script>
   <script>
     AskMaxWidget.init({ theme: 'light' });
   </script>
   ```

**Note**: Building a standalone bundle is beyond the scope of this prototype. Consider:
- Using iframe-based embedding (easier but less integrated)
- Hiring a developer to create the bundled version
- Keeping the widget on the same domain as your portfolio

## 📊 Post-Deployment Monitoring

### Week 1: Active Monitoring

- [ ] Check server logs daily for errors
- [ ] Monitor OpenAI API usage and costs
- [ ] Collect user feedback
- [ ] Track common questions

### Ongoing

- [ ] Review logs weekly
- [ ] Update knowledge base as needed
- [ ] Monitor API costs
- [ ] Iterate on system prompt based on quality of responses

## 🐛 Common Deployment Issues

### "OpenAI API key not configured"

**Cause**: Environment variable not set
**Fix**: Use the in-app prompt to add your OpenAI API key

### "Knowledge base not initialized"

**Cause**: Server hasn't read the markdown files yet
**Fix**: Call the `/init-kb` endpoint or restart the server

### Slow responses

**Cause**: OpenAI API calls can be slow
**Fix**: This is expected (2-5 seconds). Consider upgrading to gpt-3.5-turbo for speed (less quality).

### Widget doesn't appear on portfolio

**Cause**: Different domain or build issues
**Fix**: Ensure your portfolio can access the widget code, or use iframe approach

### High API costs

**Cause**: Each chat message makes 2 OpenAI API calls (1 for embedding, 1 for completion)
**Fix**: 
- Switch to cheaper models
- Implement rate limiting
- Add usage caps in OpenAI dashboard

## 💰 Cost Estimation

Approximate costs (as of 2024):

**Per chat interaction**:
- Embedding (text-embedding-3-small): ~$0.00002
- Completion (gpt-4o-mini): ~$0.001-0.003 depending on length
- **Total per message: ~$0.001-0.003**

**Monthly estimate**:
- 100 conversations/month (~500 messages): $0.50-1.50
- 500 conversations/month (~2,500 messages): $2.50-7.50
- 1,000 conversations/month (~5,000 messages): $5-15

These are estimates. Monitor your actual usage in the OpenAI dashboard.

## 🔄 Updating Content

To update the knowledge base after deployment:

1. Edit the `KNOWLEDGE_BASE` array in `/supabase/functions/server/knowledge-data.ts`
2. Redeploy (changes to server code require redeployment)
3. The knowledge base will automatically reinitialize on server startup
4. Or manually call the `/init-kb` endpoint to force reindexing

**Tip**: Keep a local test version to verify changes before deploying to production.

## 📈 Measuring Success

Track these metrics to evaluate effectiveness:

- **Usage**: How many conversations per week?
- **Quality**: Are responses accurate and helpful?
- **Coverage**: What questions can't it answer? (add to knowledge base)
- **Engagement**: Do visitors have multi-turn conversations?
- **Conversion**: Does it lead to more contact form submissions?

## 🎯 Next Steps After Launch

1. **Week 1**: Monitor closely, fix any immediate issues
2. **Week 2-4**: Collect feedback, identify knowledge gaps
3. **Month 2**: Iterate on content and prompt based on learnings
4. **Month 3+**: Consider advanced features (analytics, A/B testing, etc.)

---

Good luck with your deployment! 🚀