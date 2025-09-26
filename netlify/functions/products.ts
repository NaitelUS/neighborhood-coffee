import type { Handler } from "@netlify/functions";

const handler: Handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      message: "Hello World from products.ts 🚀"
    }),
  };
};

export { handler };
