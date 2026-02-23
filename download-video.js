import {
  createWriteStream,
  existsSync,
  mkdirSync,
  rmSync
} from 'node:fs'
import { join } from 'node:path';
import { parseArgs, styleText } from 'node:util'

import { Innertube, Platform } from 'youtubei.js';

import { convert } from './src/cli/convert.js';
import { sanitizeString } from './src/utils/sanitizeString.js';
import { toTitleCase } from './src/utils/toTitleCase.js';

export const DEFAULT_OUTPUT_DIRECTORY = `./downloads`;

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

const downloadVideo = async ({
  video,
  format,
  output = DEFAULT_OUTPUT_DIRECTORY,
  artist,
  title
}) => {
  if (!video) {
    throw new Error('Video ID is required')
  }

  const innertube = await Innertube.create({
    client_type: 'ANDROID'
  })

  const tempFile = join(output, `${video}.m4a`)
  const songName =  toTitleCase(sanitizeString(`${artist} - ${title}.${format}`))
  const outputFile = join(output, songName)

  console.log(styleText('yellow', `Downloading - ${songName}`))

  const stream = await innertube.download(video, { type: 'video+audio' });

  if (!existsSync(output)) {
    mkdirSync(output);
  }

  const file = createWriteStream(tempFile);

  for await (const chunk of stream) {
    file.write(chunk)
  }

  file.end()

  await convert(tempFile, format, outputFile)

  rmSync(tempFile)

  return outputFile
}

const main = async () => {
  const options = {
    output: {
      type: 'string',
      short: 'o',
    },
    format: {
      type: 'string',
      short: 'f',
    },
    video: {
      type: 'string',
      short: 'v',
    },
    artist: {
      type: 'string',
      short: 'a',
    },
    title: {
      type: 'string',
      short: 't',
    },
  };

  const { values } = parseArgs({
    options,
  })

  values.format = values.format ?? 'flac'
  values.output = values.output ?? DEFAULT_OUTPUT_DIRECTORY
  values.video = values.video ?? 'cHcVU5cGUNE'
  values.artist = values.artist ?? 'Italobrothers'
  values.title = values.title ?? 'Stamp On The Ground'

  if (!values.video) {
    console.error(styleText('red', 'Error: Video ID is required'))
    console.error('Usage: node download-video.js --video VIDEO_ID [options]')
    console.error('Use --help for more information')
    process.exit(1)
  }

  console.log(styleText('cyan', '\nDownloading video...'));

  const outputFile = await downloadVideo(values)

  console.log(styleText('green', `Download complete: ${outputFile}`))
}

main().catch(err => {
  console.error(styleText('red', `Error: ${err.message}`))
  process.exit(1)
})
