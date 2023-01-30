import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { Configuration, OpenAIApi } from 'openai';
// import { writeFile } from 'fs';
// import { promisify } from 'util';
// import svgurt from 'svgurt';

dotenv.config();

const openAIConfiguration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(openAIConfiguration);

async function run(assetText: string) {
  const startTime = Date.now();

  const prompt = `A black and white posterized icon of a ${assetText}`;

  try {
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: '256x256' // Up to 1024x1024. 512x512
      // response_format: 'b64_json' // 'b64_json' or 'url' (defaults to url)
    });
    console.log('Got DALLE-2 response:');
    console.log(response.data.data[0].url);

    // console.log(response.data.data[0].b64_json);
    // const runWriteFile = promisify(writeFile);
    // await runWriteFile('image_b64_json', response.data.data[0].b64_json || 'empty');
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

run('coffee cup');
