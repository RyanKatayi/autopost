import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key-for-development')

export interface PostGenerationRequest {
  topic: string
  tone: 'professional' | 'casual' | 'thought-leadership' | 'storytelling'
  length: 'short' | 'medium' | 'long'
  includeHashtags: boolean
  includeQuestion: boolean
  targetAudience?: string
}

export interface GeneratedPost {
  title: string
  content: string
  hashtags: string[]
  suggestedTime?: string
}

async function generateWithGemini(
  systemPrompt: string,
  userPrompt: string,
  includeHashtags: boolean
): Promise<GeneratedPost> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const prompt = `${systemPrompt}\n\nUser Request: ${userPrompt}\n\nPlease respond with valid JSON only, no other text.`
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Clean up response to ensure it's valid JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response')
    }
    
    const generatedPost = JSON.parse(jsonMatch[0])
    
    return {
      title: generatedPost.title,
      content: generatedPost.content.replace(/\*\*(.*?)\*\*/g, '$1'),
      hashtags: includeHashtags ? (generatedPost.hashtags || []).map((tag: string) => tag.replace(/^#+/, '')) : []
    }
  } catch (error) {
    console.error('Gemini generation error:', error)
    throw error
  }
}

export async function generateLinkedInPost(
  request: PostGenerationRequest
): Promise<GeneratedPost> {
  const { topic, tone, length, includeHashtags, includeQuestion, targetAudience } = request

  // Check if Gemini is configured
  const hasGemini = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key'
  
  if (!hasGemini) {
    const demoContent = tone === 'storytelling' 
      ? `I remember the exact moment everything changed for me with ${topic}.

It was 2 AM, and I was staring at my screen, completely overwhelmed. Everyone around me seemed to "get it" while I was struggling to even understand the basics.

But here's what I learned: the people who succeed aren't the ones who never struggle - they're the ones who embrace the struggle and learn from it.

Three key things that transformed my approach:

1. Stop comparing your chapter 1 to someone else's chapter 20
2. Ask questions even when you think they're "stupid" 
3. Celebrate small wins along the way

The truth? We're all figuring it out as we go. The difference is some people are brave enough to admit it.

${includeQuestion ? 'What\'s one struggle you\'ve turned into your biggest strength?' : 'Your struggle today is your strength tomorrow. Trust the process.'}`
      : `Here's what nobody tells you about ${topic}:

Everyone acts like they have it all figured out. But the reality? Most of us are making it up as we go - and that's actually a good thing.

I've spent the last few years diving deep into this, and here's what I've discovered:

The ${tone} approach to ${topic} isn't about perfection. It's about progress.

→ Start before you're ready
→ Learn from real examples, not theory  
→ Focus on one thing at a time
→ Get feedback early and often

The biggest mistake I see people make? Waiting for the "perfect moment" or the "perfect plan."

Spoiler alert: There isn't one.

${includeQuestion ? 'What\'s one area where you\'ve been waiting for the perfect moment?' : 'The best time to start was yesterday. The second best time is now.'}

💡 This is demo content - add your Gemini API key for AI-generated posts!`

    return {
      title: `The truth about ${topic} that nobody talks about`,
      content: demoContent,
      hashtags: includeHashtags ? ['Growth', 'Learning', 'RealTalk', topic.replace(/\s+/g, '')] : [],
      suggestedTime: getSuggestedPostingTime()
    }
  }

  const toneGuidelines = {
    professional: 'Professional, formal, industry-focused',
    casual: 'Conversational, friendly, approachable',
    'thought-leadership': 'Authoritative, insightful, industry expertise',
    storytelling: 'Narrative-driven, personal experiences, relatable'
  }

  const systemPrompt = `You are "ViralPostGPT," an expert LinkedIn content strategist specializing in creating posts that achieve massive reach and engagement. Your core mission is to build authentic personal brands by writing content that is emotionally resonant, intellectually stimulating, and incredibly valuable.

**Core Philosophy:** Never be boring. Every sentence must earn the reader's attention. Your style is a blend of a trusted mentor and a friend sharing a game-changing secret.

**WRITING STYLE & VOICE (The "Authentic Influencer" Model):**
- **Conversational & Intimate:** Write as if you're sharing a personal story with a close friend. Use "I," "you," and "we" to foster a direct connection.
- **Radical Authenticity:** Be brutally honest. Share not just wins, but specific, quantifiable struggles and what you learned from them. Vulnerability builds trust.
- **Simple & Profound:** Use clear, everyday language. Avoid jargon and corporate-speak like the plague. The goal is to make complex ideas feel simple and actionable.
- **Rhythmic & Readable:** Use contractions (e.g., "it's," "you're") for a natural, spoken-word feel. Vary sentence length to create a compelling rhythm.
- **Credibility Through Specificity:** Don't just say something worked; prove it. Use real numbers, specific examples, and concrete details (e.g., "grew my audience by 250% in 90 days," not "grew my audience a lot").
- **Maintain Core Tone:** Adhere to the requested tone (${toneGuidelines[tone]}) but infuse it with this core philosophy.

**VIRAL CONTENT STRUCTURE (The "Hook, Story, Insight, Action" Funnel):**
1.  **The Hook (First Sentence is Everything):**
    *   **Goal:** Stop the scroll. Instantly create a curiosity gap.
    *   **Formulas:**
        *   **Contrarian Take:** "Everyone thinks X is true. They're wrong. Here's why..."
        *   **High-Stakes Mistake:** "I lost $100,000 because of one simple mistake."
        *   **Surprising Revelation:** "The most valuable lesson of my career came from my worst boss."
        *   **Intriguing Statistic:** "9 out of 10 startups fail. The one that succeeds does this differently."
2.  **The Story (Connect Emotionally):**
    *   **Goal:** Make the reader feel seen. Share a relatable, personal anecdote or a compelling case study.
    *   **Technique:** Use the "And, But, Therefore" (ABT) framework to structure the narrative. "I wanted to achieve X, **but** I ran into Y problem, **therefore** I had to discover Z solution."
3.  **The Insight (Deliver the "Aha!" Moment):**
    *   **Goal:** Provide the core value. Extract the key lesson or takeaway that the reader can apply.
    *   **Format:** Often best presented as a short, punchy list (3-5 bullet points or numbered items) for maximum scannability.
4.  **The Action & Engagement (Spark Conversation):**
    *   **Goal:** Drive comments, shares, and saves.
    *   **Method:**
        *   If a question is requested (${includeQuestion}), make it open-ended and thought-provoking. Instead of "Do you agree?" ask "What's one mistake that taught you more than any success?"
        *   If no question, end with a powerful, reflective statement or a strong call-to-action that encourages readers to apply the insight.

**ADVANCED ENGAGEMENT & READABILITY HACKS:**
- **The "1-3-1" Paragraph Rule:** Sandwich a 3-line paragraph between two 1-line paragraphs to create visual variety and improve readability.
- **Strategic Line Breaks:** Use white space to emphasize key points and guide the reader's eye down the page.
- **Minimalist Emojis:** Use 1-3 emojis max to add a touch of personality, not to clutter the text.
- **Speak Directly:** Address the reader as "you" throughout the post to make it feel like a personal conversation.

**AUDIENCE FOCUS:**
- **Primary:** Ambitious professionals seeking growth, inspiration, and actionable advice.
- **Specific:** ${targetAudience ? `Tailor the language, examples, and pain points directly to ${targetAudience}.` : 'Focus on universal professional challenges and aspirations.'}

**ABSOLUTE NO-GOs (Things to AVOID at all costs):**
- Generic, clichéd motivational quotes.
- Buzzwords, corporate jargon, or overly academic language.
- Vague, unsupported claims. Be specific or be silent.
- Long, dense paragraphs that look like a wall of text.
- Being overly promotional or salesy. Give value, don't just ask for it.

**JSON OUTPUT FORMAT:**
- Your final output MUST be a single, valid JSON object. Do not include any text or markdown before or after the JSON.
- The structure must be:
{
  "title": "A brief, highly engaging title for the post (max 10 words)",
  "content": "The main LinkedIn post content, adhering to all rules above.",
  "hashtags": ["array", "of", "relevant", "hashtags"]
}`

  const userPrompt = `Generate a viral LinkedIn post based on the following core idea: "${topic}"

**POST REQUIREMENTS:**
- **Tone:** ${tone}
- **Length:** ${length}
- **Include Hashtags:** ${includeHashtags}
- **Include Engaging Question:** ${includeQuestion}
${targetAudience ? `- **Target Audience:** ${targetAudience}` : ''}

**INSPIRATIONAL EXAMPLES (Use these as a guide for structure and impact):**

**1. Contrarian Hook Example:**
*   **Idea:** "Career growth isn't about climbing the ladder."
*   **Post Opening:** "Stop trying to climb the corporate ladder. It's a trap. For years, I thought the only way up was to get the next promotion, the next title. I was wrong. Real growth isn't vertical; it's horizontal..."

**2. High-Stakes Mistake Example:**
*   **Idea:** "A small oversight in a contract cost me dearly."
*   **Post Opening:** "I made a $50,000 mistake by not reading one sentence. It was buried deep in a client contract, and my failure to catch it cost me big. Here's the full story and the lesson I'll never forget..."

**3. Personal Story / Vulnerability Example:**
*   **Idea:** "My fear of public speaking was holding back my career."
*   **Post Opening:** "Three years ago, my voice would shake just introducing myself in a meeting. Last week, I gave a keynote to 500 people. The journey from terror to confidence wasn't easy. It started with one small decision..."

**4. Surprising Revelation Example:**
*   **Idea:** "The best productivity hack is counter-intuitive."
*   **Post Opening:** "I spent a year trying every productivity hack in the book. Pomodoro, time-blocking, GTD... you name it. The technique that finally 10x'd my output? Doing less.

**INSTRUCTIONS FOR THE AI:**
- **Embody "ViralPostGPT":** Follow all rules from your system prompt.
- **Be Human:** Write with genuine emotion and personality. Avoid robotic or generic phrasing.
- **Create Value:** Ensure the post provides a tangible insight or lesson that the reader can use.
- **Drive Conversation:** The content should be so compelling that people feel an urge to comment, share, and save it.`

  try {
    const generatedPost = await generateWithGemini(systemPrompt, userPrompt, includeHashtags)
    
    // Add suggested posting time based on best practices
    const suggestedTime = getSuggestedPostingTime()
    
    return {
      ...generatedPost,
      suggestedTime
    }
  } catch (error) {
    console.error('Error generating post:', error)
    
    // Provide specific error messages for Gemini
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('API key')) {
        throw new Error('Gemini API key is invalid. Please check your configuration.')
      }
      
      if (error.message.includes('429')) {
        throw new Error('Gemini API rate limit exceeded. Please try again later.')
      }
    }
    
    // For any other error, fall back to demo content
    console.log('Falling back to demo content due to error:', error)
    return {
      title: `Demo Post: ${topic}`,
      content: `🚀 Here's a demo LinkedIn post about ${topic}!\n\nThis is what your ${tone} post would look like when generated with Google Gemini AI. The content would be tailored to your ${length} length preference and optimized for engagement.\n\n💡 There was an issue with Gemini generation, so this is demo content.\n\n${includeQuestion ? 'What are your thoughts on this topic?' : 'Ready to automate your LinkedIn content?'}`,
      hashtags: includeHashtags ? ['LinkedIn', 'AI', 'AutoPost AI', topic.replace(/\s+/g, '')] : [],
      suggestedTime: getSuggestedPostingTime()
    }
  }
}

function getSuggestedPostingTime(): string {
  // Based on LinkedIn best practices
  const now = new Date()
  const day = now.getDay() // 0 = Sunday, 1 = Monday, etc.
  
  // Best posting times for LinkedIn (Tuesday-Thursday, 8-10 AM or 12-2 PM)
  let suggestedDay = day
  let suggestedHour = 9 // 9 AM default
  
  // If it's Friday, Saturday, or Sunday, suggest Tuesday
  if (day === 5 || day === 6 || day === 0) {
    suggestedDay = 2 // Tuesday
  } else if (day === 1) {
    suggestedDay = 2 // Tuesday (avoid Monday)
  }
  
  // Suggest morning (9 AM) or afternoon (1 PM) posting
  const currentHour = now.getHours()
  if (currentHour >= 10 && currentHour < 15) {
    suggestedHour = 13 // 1 PM
  } else {
    suggestedHour = 9 // 9 AM
  }
  
  const suggestedDate = new Date(now)
  suggestedDate.setDate(now.getDate() + (suggestedDay - day + 7) % 7)
  suggestedDate.setHours(suggestedHour, 0, 0, 0)
  
  return suggestedDate.toISOString()
}