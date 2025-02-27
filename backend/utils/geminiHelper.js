const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function getExpenseInsights(expenses) {
  try {
    const prompt = `Analyze these expenses and provide financial insights:
      ${JSON.stringify(expenses)}
      Also give suggestions on savings and spending habits in one line.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    return "Error in fetching insights.";
  }
}

module.exports = { getExpenseInsights };
