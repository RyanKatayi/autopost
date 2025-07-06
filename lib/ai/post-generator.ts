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
      content: generatedPost.content,
      hashtags: includeHashtags ? (generatedPost.hashtags || []) : []
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

  const lengthGuidelines = {
    short: '1-2 paragraphs, maximum 150 words',
    medium: '2-3 paragraphs, 150-300 words',
    long: '3-4 paragraphs, 300-600 words'
  }

  const toneGuidelines = {
    professional: 'Professional, formal, industry-focused',
    casual: 'Conversational, friendly, approachable',
    'thought-leadership': 'Authoritative, insightful, industry expertise',
    storytelling: 'Narrative-driven, personal experiences, relatable'
  }

  const systemPrompt = `You are a world-class LinkedIn content creator who writes posts that go viral and build authentic personal brands. Your writing style is conversational, relatable, and genuinely helpful - never corporate or salesy.

WRITING STYLE RULES:
- Write like you're talking to a friend over coffee
- Use personal experiences and real stories when possible
- Be vulnerable and authentic - share struggles and wins
- Use simple, clear language (avoid jargon and buzzwords)
- Start sentences with "I", "You", "We" to create connection
- Use contractions (don't, can't, won't) for natural flow
- Include specific details and numbers to build credibility
- Write in ${toneGuidelines[tone]} tone while maintaining authenticity

CONTENT STRUCTURE:
- Keep it ${lengthGuidelines[length]}
- Hook: Start with a bold statement, question, or surprising fact
- Story: Share a personal anecdote or specific example
- Insight: Extract the lesson or valuable takeaway
- Action: Give readers something concrete to do
- ${includeQuestion ? 'End with a thought-provoking question that sparks discussion' : 'End with a strong call-to-action or reflection'}

ENGAGEMENT TACTICS:
- Use "you" to speak directly to the reader
- Include specific examples with real numbers/results
- Share failures and lessons learned, not just successes
- Use short paragraphs (1-3 sentences max)
- Add strategic line breaks for visual appeal
- Use emojis sparingly but effectively (1-3 max)
- Create curiosity gaps that make people want to read more

AUDIENCE: ${targetAudience ? `Target specifically to ${targetAudience}` : 'Write for ambitious professionals who want to grow'}

AVOID:
- Generic motivational quotes
- Corporate speak or buzzwords
- Being overly promotional
- Vague statements without proof
- Long paragraphs that are hard to read

Format your response as JSON with the following structure:
{
  "title": "Brief, engaging title for the post",
  "content": "The main LinkedIn post content",
  "hashtags": ["relevant", "hashtags", "array"]
}`

  const userPrompt = `Create a highly engaging LinkedIn post about: "${topic}"

REQUIREMENTS:
- Tone: ${tone}
- Length: ${length}
- Include hashtags: ${includeHashtags}
- Include engaging question: ${includeQuestion}
${targetAudience ? `- Target audience: ${targetAudience}` : ''}

EXAMPLES OF GREAT HOOKS:
- "I made a $50K mistake last year. Here's what I learned..."
- "Everyone told me this was impossible. I did it anyway."
- "The best career advice I ever got came from a janitor."
- "I just analyzed 1,000 successful companies. Here's what they all have in common:"

EXAMPLES OF PERSONAL STORY OPENINGS:
- "Three years ago, I was terrified to speak up in meetings..."
- "I remember the exact moment I realized I was doing everything wrong..."
- "My biggest failure taught me my most valuable lesson..."
- "I used to think [common belief], until I discovered..."

Make this post feel like it's written by a real person with genuine insights, not by AI. Include specific details, personal experiences, and actionable advice that readers can immediately apply to their own lives or careers.

The post should feel authentic, vulnerable when appropriate, and provide real value that makes people want to save, share, and comment.`

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
      hashtags: includeHashtags ? ['LinkedIn', 'AI', 'PostMaster', topic.replace(/\s+/g, '')] : [],
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