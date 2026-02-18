import { createWriteStream, existsSync, mkdirSync, rmSync } from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'

import { Innertube, Platform, Utils } from 'youtubei.js';
import { convert } from './src/cli/convert.js';

const streamPipeline = promisify(pipeline)

Platform.shim.eval = async (data, env) => {
  const properties = [];

  if (env.n) {
    properties.push(`n: exportedVars.nFunction("${env.n}")`)
  }

  if (env.sig) {
    properties.push(`sig: exportedVars.sigFunction("${env.sig}")`)
  }

  const code = `${data.output}\nreturn { ${properties.join(', ')} }`;

  return new Function(code)();
}

async function downloadVideo(videoId, format) {
  if (!videoId) {
    throw new Error('Video ID is required')
  }

  console.log(`Fetching video info for: ${videoId}`)
  const innertube = await Innertube.create({
    // generate_session_locally: false,
    client_type: 'ANDROID',
    // client_version: '16.0.1'
  });

  // const stream = await innertube.download(videoId, { type: 'video+audio' });
  const stream = await innertube.download(videoId, { type: 'video+audio' });

  const dir = `./downloaded`;

  if (!existsSync(dir)) {
    mkdirSync(dir);
  }

  const tempFile = `${dir}/${videoId}.m4a`
  const file = createWriteStream(tempFile);

  for await (const chunk of stream) {
    file.write(chunk)
  }

  file.end()

  // for await (const chunk of Utils.streamToIterable(stream)) {
  //   file.write(chunk);
  // }

  // // Properly close the stream and wait for it to finish
  // await new Promise((resolve, reject) => {
  //   file.end((err) => {
  //     if (err) reject(err);
  //     else resolve();
  //   });
  // });

  await convert(tempFile, format, `${dir}/${videoId}.${format}`)

  // rmSync(tempFile)

  console.log('Download complete')
}

// CLI usage: node download.js VIDEO_ID
const videoId = process.argv[2] ?? 'CajK3OPaN9A'
const format = process.argv[3] || 'flac'

downloadVideo(videoId, format).catch(err => {
  console.error(err)
  process.exit(1)
})
