# Google Gemini AI Setup Guide

AutoPost AI uses Google Gemini AI as the primary AI provider for post generation. Follow these steps to configure it:

## 🚀 **Step 1: Get Gemini API Key**

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API key"**
4. Select a Google Cloud project (or create a new one)
5. Copy the generated API key

## 🔧 **Step 2: Add API Key to Environment**

1. Open your `.env.local` file
2. Update the Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

## ✨ **Step 3: Test Gemini Integration**

1. Restart your development server:
   ```bash
   npm run dev
   ```
2. Go to the **Create Post** page
3. Try generating a post!

## 🎯 **Tips for Best Results with Gemini**

### **Gemini excels at:**
- Professional LinkedIn content
- Structured list-based posts
- Industry insights and commentary
- Engaging storytelling
- Quick turnaround content

## 🔄 **Automatic Fallback**

If Gemini generation fails:
- The system shows helpful demo content
- No interruption to your workflow
- Clear error messages to help troubleshoot

## 🆘 **Troubleshooting**

### **"API key is invalid" error:**
1. Check that your API key is correct in `.env.local`
2. Ensure there are no extra spaces or quotes
3. Verify the key is active in Google AI Studio

### **"Rate limit exceeded" error:**
1. Wait a few minutes before trying again
2. Consider upgrading your Gemini plan for higher quotas

### **Generation fails:**
1. Simplify your topic or prompt
2. Check the browser console for detailed errors
3. Ensure your Gemini API key is valid and has quota available

---

## 🎉 **You're All Set!**

You now have Google Gemini configured for AI-powered post generation!

**Pro Tip:** Experiment with different tones and styles to see how Gemini adapts to your content needs! 🚀