import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  
  const trip = req.body.trip;
  
  if (trip.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a destination, the number of days, and any special activities you'd like to do.",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct",
      prompt: generatePrompt(trip),
      temperature: 0.8,
      max_tokens : 500
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
      if (error.response) {
        console.error(error.response.status, error.response.data);
        res.status(error.response.status).json(error.response.data);
      }
      else {
        console.error(`Error with OpenAI API request: ${error.message}`);
        res.status(500).json({
          error: {
            message: 'An error occurred during your request.',
          }
        });
      }
  }
}

function generatePrompt(trip) {
  return `Given a destination, time length, and an activity all separated by semicolons,
  return me a detailed travel itinerary for ${trip}`;
}
