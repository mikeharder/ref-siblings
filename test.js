import $RefParser from "@apidevtools/json-schema-ref-parser";
import Ajv from "ajv";
import { inspect } from "util";

function getSchema() {
  return {
    title: "Person",
    type: "object",
    properties: {
      name: { $ref: "#/definitions/name", minLength: 2 },
      age: { $ref: "#/definitions/age" },
    },
    definitions: {
      name: {
        type: "string",
        minLength: 0,
      },
      age: {
        type: "integer",
        minimum: 0,
      },
    },
  };
}

// properties: {
//   name: { '$ref': '#/definitions/name', readOnly: true },
//   age: { '$ref': '#/definitions/age' }
// },
console.log("# Schema");
console.log(JSON.stringify(getSchema()) + "\n");

async function testRefParser() {
  console.log("# @apidevtools/json-schema-ref-parser");

  let derefSchema = await $RefParser.dereference(getSchema());

  // properties: {
  //   name: { readOnly: true, type: 'string', minLength: 1 },
  //   age: { type: 'integer', minimum: 0 }
  // },
  console.log(inspect(derefSchema) + "\n");
}

async function testAjv() {
  // # ajv({ extendRefs: true})
  // valid: false
  // errors: [
  //   {
  //     keyword: 'minLength',
  //     dataPath: '.name',
  //     schemaPath: '#/properties/name/minLength',
  //     params: { limit: 2 },
  //     message: 'should NOT be shorter than 2 characters'
  //   }
  // ]

  // # ajv({ extendRefs: ignore})
  // $ref: keywords ignored in schema at path "#/properties/name"
  // valid: true
  // errors: null

  // # ajv({ extendRefs: fail})
  // Error: $ref: validation keywords used in schema at path "#/properties/name" (see option extendRefs)

  for (const extendRefs of [true, "ignore", "fail"]) {
    try {
      console.log(`# ajv({ extendRefs: ${extendRefs}})`);

      const ajv = new Ajv({ extendRefs });
      const validate = ajv.compile(getSchema());

      const data = { name: "T", age: 1 };
      const valid = validate(data);

      console.log(`valid: ${valid}`);
      console.log(`errors: ${inspect(validate.errors)}\n`);
    } catch (error) {
      console.log(error);
    }
  }
}

await testRefParser();
await testAjv();
