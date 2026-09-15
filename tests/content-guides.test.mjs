import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const out=path.resolve('out');
const urls=[...readFileSync(path.join(out,'sitemap.xml'),'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]));

test('guide tables have captions, header scopes and consistent row widths in exported HTML',()=>{
 let count=0;
 for(const url of urls){
  const html=readFileSync(path.join(out,url.pathname,'index.html'),'utf8');
  for(const match of html.matchAll(/<table\b[^>]*class="guide-table"[^>]*>([\s\S]*?)<\/table>/g)){
   count++; const table=match[1];
   assert.match(table,/<caption>[^<]+<\/caption>/,url.pathname);
   const headers=[...table.matchAll(/scope="col"/g)].length;
   assert.ok(headers>=3,url.pathname);
   for(const row of table.matchAll(/<tr>([\s\S]*?)<\/tr>/g)) assert.equal([...row[1].matchAll(/<(?:th|td)\b/g)].length,headers,url.pathname);
   assert.match(table,/scope="row"/,url.pathname);
  }
 }
 assert.ok(count>=15,'expected the service, article, case and region guides to be exported');
});

test('every case illustration and new internal guide link resolves in the static export',()=>{
 for(const url of urls){
  const html=readFileSync(path.join(out,url.pathname,'index.html'),'utf8');
  for(const [,src] of html.matchAll(/<img\b[^>]*src="(\/cases\/[^"?]+)"/g))assert.ok(existsSync(path.join(out,src)),`${url.pathname}: ${src}`);
  for(const [,href] of html.matchAll(/href="(\/(?:services|cases|blog|regions)\/[^"?#]*)"/g)){
   assert.ok(existsSync(path.join(out,href,'index.html')),`${url.pathname}: ${href}`);
  }
 }
});
