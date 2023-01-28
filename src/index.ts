import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { Configuration, OpenAIApi } from 'openai';
// import svgurt from 'svgurt';

dotenv.config();

const openAIConfiguration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(openAIConfiguration);

async function run() {
  const startTime = Date.now();

  try {
    const response = await openai.createImage({
      prompt: 'a white siamese cat',
      n: 1,
      size: '256x256'
    });
    console.log('Got DALLE-2 response:');
    console.log(response.data.data[0].url);
  } catch (error: any) {
    console.log('Error with DALLE-2 request:');
    if (error?.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }

  console.log('Done. Time elapsed (ms):', (Date.now() - startTime));
}

run();
