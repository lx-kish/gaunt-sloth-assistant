import { Command, Option } from 'commander';
import { askCommand } from '#src/commands/askCommand.js';
import { initCommand } from '#src/commands/initCommand.js';
import { reviewCommand } from '#src/commands/reviewCommand.js';
import { prCommand } from '#src/commands/prCommand.js';
import { chatCommand } from '#src/commands/chatCommand.js';
import { codeCommand } from '#src/commands/codeCommand.js';
import { getSlothVersion } from '#src/utils.js';
import { argv, readStdin } from '#src/systemUtils.js';
import { setVerbose } from '#src/llmUtils.js';
import { setCustomConfigPath } from '#src/config.js';

const program = new Command();

program
  .name('gsloth')
  .description('Gaunt Sloth Assistant reviewing your PRs')
  .version(getSlothVersion())
  .option('--verbose', 'Print entire prompt sent to LLM.')
  .option('-c, --config <path>', 'Path to custom configuration file')
  .addOption(new Option('--nopipe').hideHelp(true));

// Parse global options before binding any commands
program.parseOptions(argv);
if (program.getOptionValue('verbose')) {
  // Set global prompt debug
  setVerbose(true);
}
if (program.getOptionValue('config')) {
  // Set custom config path
  setCustomConfigPath(program.getOptionValue('config'));
}

// Initialize all commands - they will handle their own config loading
initCommand(program);
reviewCommand(program);
prCommand(program);
askCommand(program);
chatCommand(program);
codeCommand(program);

await readStdin(program);
