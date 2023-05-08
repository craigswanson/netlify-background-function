// generator-background.js
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.handler = async (event, context) => {
  if (!configuration.apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: {
          message: "OpenAI API key not configured, please follow instructions in README.md",
        }
      }),
    };
  }

  const data = JSON.parse(event.body);
  const animal = data.animal || '';
  if (animal.trim().length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: {
          message: "Please enter a valid animal",
        }
      }),
    };
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0.6,
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ result: completion.data.choices[0].text }),
    };
  } catch(error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      return {
        statusCode: error.response.status,
        body: JSON.stringify(error.response.data),
      };
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: {
            message: 'An error occurred during your request.',
          }
        }),
      };
    }
  }
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest three names for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}