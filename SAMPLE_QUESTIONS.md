# Sample Questions for Testing

Use these questions to test your Ask Max chatbot and verify it's working correctly.

## ✅ Should Work (Knowledge-Based)

### About Max

- "Who is Max Thunberg?"
- "What's Max's background?"
- "What is Max's experience with PLM systems?"
- "Tell me about Max's education"
- "What industries has Max worked in?"

### Leadership & Work Style

- "What's Max's leadership style?"
- "How does Max work with teams?"
- "What are Max's principles?"
- "How does Max approach stakeholder management?"
- "What does Max value in his work?"
- "How does Max handle design critiques?"

### Case Studies

- "Tell me about the Volvo case study"
- "What was the PLM/PDM redesign project?"
- "Describe the item management system Max designed"
- "What were the key challenges in the Volvo project?"
- "What impact did Max's work have?"
- "What did Max learn from the item management project?"

### Design Approach

- "What are Max's design principles?"
- "How does Max approach complex systems?"
- "What does Max think about design systems?"
- "How does Max handle user research?"
- "What's Max's approach to prototyping?"

### Specific Skills

- "What UX methods does Max use?"
- "How does Max think about enterprise software?"
- "What's Max's view on collaboration?"
- "How does Max balance user needs with business constraints?"

## ❌ Should NOT Work (Outside Knowledge)

The AI should respond with something like "I'm not sure about that based on the material Max has shared here" for these:

### Generic Questions

- "What's the weather today?"
- "Who won the World Series?"
- "What's the capital of France?"
- "How do I make spaghetti?"

### Personal Questions Beyond Knowledge

- "What's Max's phone number?"
- "Where does Max live?"
- "What's Max's salary?"
- "Is Max married?"

### Technical Questions Outside Expertise

- "How do I code a React app?"
- "What's the best database for my project?"
- "Should I use AWS or Google Cloud?"

### Opinions on Topics Not Covered

- "What does Max think about cryptocurrency?"
- "What's Max's favorite restaurant?"
- "What does Max think about the 2024 election?"

## 🧪 Edge Cases to Test

### Ambiguous Questions

- "Tell me about Max" (should provide a general overview)
- "What do you know?" (should explain it knows about Max's work)
- "Help me" (should ask what specifically they want to know)

### Follow-up Questions

- "Tell me about Max's work" → "Can you elaborate on the PLM experience?"
- "What are Max's principles?" → "Tell me more about the third one"
- "Describe the Volvo project" → "What was the impact?"

### Similar but Different Questions

- "What's Max's leadership approach?" vs "How does Max lead teams?" (should give similar answers)
- "Tell me about Max's case studies" vs "What projects has Max worked on?"

### Boundary Cases

- "Can Max help me with my UX problem?" (should clarify this is an AI, but might discuss Max's approach)
- "How can I hire Max?" (should suggest contacting him directly via portfolio)
- "Does Max do freelance work?" (likely outside knowledge scope)

## 📊 Quality Evaluation Criteria

When testing responses, check for:

### Accuracy
- [ ] Information matches the knowledge files
- [ ] No hallucinated details
- [ ] Specific examples are cited correctly

### Completeness
- [ ] Answers the question fully
- [ ] Provides relevant context
- [ ] Doesn't leave out important information

### Clarity
- [ ] Easy to understand
- [ ] Well-structured
- [ ] Appropriate length (not too short or too long)

### Tone
- [ ] Friendly but direct
- [ ] Professional
- [ ] Avoids buzzwords and hype
- [ ] Honest about limitations

### Boundaries
- [ ] Correctly identifies out-of-scope questions
- [ ] Doesn't make up information
- [ ] Suggests alternatives when can't answer

## 🎯 Recommended Testing Flow

1. **Basic Functionality** (5 questions)
   - Ask about Max's background
   - Ask about leadership style  
   - Ask about one case study
   - Ask an out-of-scope question
   - Follow up on a previous answer

2. **Edge Cases** (5 questions)
   - Ask ambiguous questions
   - Test conversation memory
   - Try rephrased questions
   - Ask boundary questions

3. **Stress Test** (optional)
   - Very long questions
   - Multiple questions in one message
   - Questions in different phrasings
   - Rapid-fire questions

## 💡 Tips for Writing Good Questions

**Good Questions**:
- "What was Max's approach to the Volvo PLM redesign?"
- "How does Max balance user needs with technical constraints?"
- "Can you explain Max's philosophy on design systems?"

**Less Effective Questions**:
- "Tell me everything" (too broad)
- "Why?" without context (ambiguous)
- Single words like "Leadership" (unclear intent)

## 🐛 Red Flags During Testing

Watch out for these issues:

- **Hallucination**: AI makes up facts not in knowledge base
- **Inconsistency**: Different answers to the same question
- **Off-topic**: Answers generic questions it shouldn't know
- **Too formal/casual**: Tone doesn't match the system prompt
- **Too long**: Responses that ramble or repeat
- **Too short**: One-sentence answers that could be more helpful

If you see these issues, you may need to:
- Adjust the system prompt
- Add more detail to knowledge files
- Change the temperature setting
- Modify the chunking strategy

---

Happy testing! 🧪
