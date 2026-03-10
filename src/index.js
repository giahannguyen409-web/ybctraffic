export default {
  async fetch(request) {
    return new Response("Worker OK", {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  },
};
