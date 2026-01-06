import Groq from "groq-sdk";

const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;

// Initialize the client
const groq = new Groq({
  apiKey: apiKey || "",
  dangerouslyAllowBrowser: true, // Required for Expo/Client-side usage
});

/**
 * Sends an image and a prompt to the Groq API.
 */
export async function sendImageToGroq(
  base64Image: string,
  prompt: string = 'Analyze the food items in the image. Return a JSON array where each object has a \'name\' (string) and \'quantity\' (number). Example: [{"name": "Apple", "quantity": 3}].'
) {
  if (!apiKey) {
    throw new Error(
      "Groq API key not found. Please set EXPO_PUBLIC_GROQ_API_KEY in your .env file."
    );
  }

  try {
    // Ensure the base64 has the correct Data URI prefix for Groq
    const imageUrl = base64Image.startsWith("data:image")
      ? base64Image
      : `data:image/jpeg;base64,${base64Image}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      // Use a vision-capable model.
      // Note: llama-3.2-11b-vision-preview is the standard for Groq Vision.
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 0.2, // Lower temperature for more consistent JSON
      response_format: { type: "json_object" },
    });

    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error sending to Groq:", error);
    throw error;
  }
}
