import { program } from "commander";

const defaultOptions = {
  port: 3000,
  includeOnly: undefined,
  exclude: ["node_modules", "spec", "test"],
  maxDepth: 10,
  tsConfig: "tsconfig.json",
};

export type CliOptions = {
  source: string;
  port: number;
  includeOnly?: string[];
  exclude?: string[];
  maxDepth?: number;
  tsConfig?: string;
};

const toNumber = (value: string) => Number(value);

export const getOptions = (): CliOptions => {
  program
    .requiredOption("-s, --source <source>", "path of root directory to scan")
    .option<number>(
      "-p, --port <number>",
      "sever port number (default: 3000)",
      toNumber,
      defaultOptions.port
    )
    .option(
      "--include-only <expressions...>",
      "included files expression in result",
      defaultOptions.includeOnly
    )
    .option(
      "--exclude <expressions...>",
      "excluded files expression from result (default: node_modules test spec)",
      defaultOptions.exclude
    )
    .option<number>(
      "--max-depth <depth>",
      "the maximum depth to scan dependency (default: 10)",
      toNumber,
      defaultOptions.maxDepth
    )
    .option(
      "--ts-config <file>",
      "use a TypeScript configuration (default: tsconfig.json)",
      defaultOptions.tsConfig
    );

  program.parse(process.argv);

  return program.opts<CliOptions>();
};
