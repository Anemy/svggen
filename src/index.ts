import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { Configuration, OpenAIApi } from 'openai';
// import { writeFile } from 'fs';
// import { promisify } from 'util';

// TODO: Once we're on node 17+ we can use the built in fetch api.
import fetch from 'node-fetch';

import svgurt from 'svgurt';

dotenv.config();

const openAIConfiguration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(openAIConfiguration);

async function run(assetText: string) {
  const startTime = Date.now();

  const prompt = `A black and white posterized icon of a ${assetText}`;

  let imageUrl: string;
  try {
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: '256x256' // Up to 1024x1024. 512x512
      // response_format: 'b64_json' // 'b64_json' or 'url' (defaults to url)
    });
    console.log('Got DALLE-2 response:');
    console.log(response.data.data[0].url);

    if (!response.data.data[0].url) {
      throw new Error('no image');
    }
    imageUrl = response.data.data[0].url;

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
    throw error;
  }

  const imageResponse = await fetch(imageUrl);
  const blob = await imageResponse.blob();
  const arrayBuffer = await (blob as any /* blob type not full in current node-fetch typings version */).arrayBuffer();
  const imageBuffer = Buffer.from(arrayBuffer);

  const outputImageName = 'svg_output';

  console.log('Running svgurt with a buffer from a url...');
  const bufferConfig = {
    imageBuffer,
    imageBufferType: 'image/png',
    output: `./${outputImageName}`,
    svgRenderType: 'CIRCLE'
  };

  try {
    await svgurt(bufferConfig);
  } catch (err) {
    console.log('Error trying buffer:', err);
  }

  console.log(`Created image "${outputImageName}"`);

  console.log('Done. Time elapsed (ms):', (Date.now() - startTime));
}

run('coffee cup');
