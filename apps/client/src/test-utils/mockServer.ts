import { setupServer } from "msw/node";
import { HttpResponse, graphql as mswGraphql } from "msw";
import { addMocksToSchema, type IMocks } from "@graphql-tools/mock";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { graphql, buildClientSchema, printSchema } from "graphql";
import schemaJson from "../types/schema.json";
import * as fs from "fs";
import * as path from "path";

const logFile = path.join(__dirname, "../../../debug.log");
const log = (msg: string) => fs.appendFileSync(logFile, `${new Date().toISOString()} - ${msg}\n`);

type IMockServerMocks = IMocks;

const createMockHandlers = (mocks: IMockServerMocks = {}) => {
  log("Creating mock handlers...");
  const typeDefs = printSchema(buildClientSchema(schemaJson as any));
  const schema = makeExecutableSchema({ typeDefs });
  const schemaWithMocks = addMocksToSchema({
    schema,
    mocks: {
      DateTime: () => new Date().toISOString(),
      String: () => "Mock String",
      Int: () => 42,
      ID: () => "mock-id",
      Boolean: () => false,
      Job: () => ({
        id: "mock-id",
        title: "Mock Job",
        location: "Mock Location",
        type: "FULL_TIME",
        remote: true,
        salary: 50000,
        company: { id: "mock-company-id", name: "Mock Company" },
        createdAt: new Date().toISOString(),
        isApplied: false,
      }),
      ...mocks,
    },
    preserveResolvers: false,
  });

  const handlers = [
    mswGraphql.operation(async ({ query, variables }) => {
      const { data, errors } = await graphql({
        schema: schemaWithMocks,
        source: query,
        variableValues: variables,
      });

      return HttpResponse.json<any>({
        data,
        errors,
      });
    }),
  ];

  return handlers;
};

export const createMockServer = (mocks: IMockServerMocks = {}) => {
  const handlers = createMockHandlers(mocks);
  const server = setupServer(...handlers);

  server.events.on("request:start", ({ request }) => {
    log(`MSW seen request: ${request.method} ${request.url}`);
  });

  return {
    listen: (options?: any) => server.listen(options),
    resetHandlers: () => server.resetHandlers(),
    close: () => server.close(),
    addMocks: (nextMocks: IMockServerMocks = {}) => {
      const nextHandlers = createMockHandlers(nextMocks);
      server.use(...nextHandlers);
    },
  };
};
