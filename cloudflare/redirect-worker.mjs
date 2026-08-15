const canonicalOrigin = "https://sovet-novoross.ru";

export default {
  async fetch(request) {
    const source = new URL(request.url);
    const target = new URL(source.pathname + source.search, canonicalOrigin);
    return Response.redirect(target.toString(), 308);
  },
};
