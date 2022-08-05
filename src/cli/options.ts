import { program } from "commander";

export type CliOptions = {
  source: string;
};

export const cliOptions = (): CliOptions => {
  program.option("-s, --source <source>");
  program.parse(process.argv);

  return program.opts<CliOptions>();
};
