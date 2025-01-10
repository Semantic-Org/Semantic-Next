#!/usr/bin/env node
import { intro, outro } from '@clack/prompts';
import { colors } from 'nanocolor';
import arg from 'arg';
import { detectBuildTool } from './detect.js';
import { config } from './config.js';
import { installCore, setupExamples, setupTheme } from './phases.js';

async function main() {
  intro(colors.blue('Semantic UI Web Components'));

  // Phase 1: Detection & Setup
  const config = await detectBuildTool({
    testFixture: args['--test-fixture']
  });

  // Phase 2: Core Installation
  await installCore(config);

  // Phase 3: Framework Examples
  await setupExamples(config);

  // Phase 4: Theme Setup
  await setupTheme(config);

  outro(colors.green('Successfully installed Semantic UI! 🎉'));
}
