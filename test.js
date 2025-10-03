import $RefParser from "@apidevtools/json-schema-ref-parser";
import { inspect } from "util";

const schema = {
  title: "Person",
  type: "object",
  properties: {
    name: { $ref: "#/definitions/name", readOnly: true },
    age: { $ref: "#/definitions/age" },
  },
  definitions: {
    name: {
      type: "string",
      minLength: 1,
    },
    age: {
      type: "integer",
      minimum: 0,
    },
  },
};

// properties: {
//   name: { '$ref': '#/definitions/name', readOnly: true },
//   age: { '$ref': '#/definitions/age' }
// },
console.log(inspect(schema));

async function testRefParser() {
  let derefSchema = await $RefParser.dereference(schema);

  // properties: {
  //   name: { readOnly: true, type: 'string', minLength: 1 },
  //   age: { type: 'integer', minimum: 0 }
  // },
  console.log(inspect(derefSchema));
}

await testRefParser();
