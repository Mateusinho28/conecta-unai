/* Service worker do Conecta Unai.
   Guarda as paginas no proprio aparelho para que o portal continue abrindo
   com internet ruim ou sem internet, situacao comum no publico atendido. */

var CACHE = "conecta-unai-v1";

var ARQUIVOS = [
  "index.html",
  "servicos.html",
  "trilha.html",
  "voluntarios.html",
  "roteiro-oficina.html",
  "assets/estilo.css",
  "assets/app.js",
  "assets/icone.svg",
  "manifest.webmanifest"
];

self.addEventListener("install", function (evento) {
  evento.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(ARQUIVOS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (evento) {
  evento.waitUntil(
    caches.keys().then(function (nomes) {
      return Promise.all(nomes.map(function (nome) {
        if (nome !== CACHE) { return caches.delete(nome); }
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

/* Estrategia: tenta a rede primeiro para trazer conteudo atualizado.
   Se a rede falhar ou demorar, entrega a copia guardada. */
self.addEventListener("fetch", function (evento) {
  if (evento.request.method !== "GET") { return; }
  if (new URL(evento.request.url).origin !== self.location.origin) { return; }

  evento.respondWith(
    fetch(evento.request).then(function (resposta) {
      var copia = resposta.clone();
      caches.open(CACHE).then(function (cache) { cache.put(evento.request, copia); });
      return resposta;
    }).catch(function () {
      return caches.match(evento.request).then(function (guardada) {
        return guardada || caches.match("index.html");
      });
    })
  );
});
