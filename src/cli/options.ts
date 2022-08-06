import { program } from "commander";

const defaultOptions = {
  port: 3000,
  includeOnly: undefined,
  exclude: ["node_modules", "spec", "test"],
  maxDepth: 10,
};

export type CliOptions = {
  source: string;
  port: number;
  includeOnly?: string[];
  exclude?: string[];
  maxDepth?: number;
};

const toNumber = (value: string) => Number(value);

export const getOptions = (): CliOptions => {
  program
    .requiredOption("-s, --source <source>", "path of root directory to scan")
    .option<number>(
      "-p, --port <number>",
      "sever port number (default 3000)",
      toNumber,
      defaultOptions.port
    )
    .option(
      "--include-only <expressions...>",
      "included files expression in result (default undefined)",
      defaultOptions.includeOnly
    )
    .option(
      "--exclude <expressions...>",
      "excluded files expression from result (default node_modules test spec)",
      defaultOptions.exclude
    )
    .option<number>(
      "--max-depth <depth>",
      "the maximum depth to scan (default 10)",
      toNumber,
      defaultOptions.maxDepth
    );

  program.parse(process.argv);

  return program.opts<CliOptions>();
};
