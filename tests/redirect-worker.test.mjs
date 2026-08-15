import assert from "node:assert/strict";
import test from "node:test";
import redirectWorker from "../cloudflare/redirect-worker.mjs";

test("old-domain worker permanently redirects path and query to the new apex", async () => {
  const response = await redirectWorker.fetch(
    new Request("https://www.sovet-nvrsk.ru/services/seo/?utm_source=old&x=1"),
  );

  assert.equal(response.status, 308);
  assert.equal(
    response.headers.get("location"),
    "https://sovet-novoross.ru/services/seo/?utm_source=old&x=1",
  );
});
