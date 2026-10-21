/* Conecta Unai - comportamento das paginas
   Tudo em JavaScript puro, sem biblioteca externa, para o portal
   carregar rapido em celular simples e em conexao lenta. */

(function () {
  "use strict";

  var ESCALAS = [1, 1.15, 1.3, 1.5];
  var CHAVE_ESCALA = "conecta-unai:escala";
  var CHAVE_CONTRASTE = "conecta-unai:contraste";
  var CHAVE_TRILHA = "conecta-unai:trilha";

  /* localStorage pode estar bloqueado (aba anonima, navegador antigo).
     Nesse caso o portal continua funcionando, so nao guarda a preferencia. */
  function ler(chave) {
    try { return window.localStorage.getItem(chave); } catch (e) { return null; }
  }
  function gravar(chave, valor) {
    try { window.localStorage.setItem(chave, valor); } catch (e) { /* segue sem salvar */ }
  }

  /* ---------- tamanho da letra ---------- */
  var indiceEscala = parseInt(ler(CHAVE_ESCALA), 10);
  if (isNaN(indiceEscala) || indiceEscala < 0 || indiceEscala >= ESCALAS.length) {
    indiceEscala = 0;
  }

  function aplicarEscala() {
    document.documentElement.style.setProperty("--escala", ESCALAS[indiceEscala]);
    gravar(CHAVE_ESCALA, String(indiceEscala));
  }

  /* ---------- alto contraste ---------- */
  function aplicarContraste(ligado) {
    document.body.classList.toggle("contraste", ligado);
    var botao = document.getElementById("btn-contraste");
    if (botao) {
      botao.setAttribute("aria-pressed", ligado ? "true" : "false");
    }
    gravar(CHAVE_CONTRASTE, ligado ? "1" : "0");
  }

  /* ---------- progresso da trilha ---------- */
  function lerTrilha() {
    try { return JSON.parse(ler(CHAVE_TRILHA) || "{}"); } catch (e) { return {}; }
  }

  function atualizarProgresso() {
    var caixas = document.querySelectorAll(".concluir input[type=checkbox]");
    if (!caixas.length) { return; }
    var feitas = 0;
    for (var i = 0; i < caixas.length; i++) {
      if (caixas[i].checked) { feitas++; }
    }
    var pct = Math.round((feitas / caixas.length) * 100);
    var texto = document.getElementById("progresso-texto");
    var barra = document.getElementById("progresso-barra");
    if (texto) {
      texto.textContent = feitas + " de " + caixas.length + " passos concluídos (" + pct + "%)";
    }
    if (barra) {
      barra.style.width = pct + "%";
      barra.parentNode.setAttribute("aria-valuenow", String(pct));
    }
  }

  function iniciarTrilha() {
    var salvo = lerTrilha();
    var caixas = document.querySelectorAll(".concluir input[type=checkbox]");
    for (var i = 0; i < caixas.length; i++) {
      (function (caixa) {
        if (salvo[caixa.id]) { caixa.checked = true; }
        caixa.addEventListener("change", function () {
          var estado = lerTrilha();
          if (caixa.checked) { estado[caixa.id] = 1; } else { delete estado[caixa.id]; }
          gravar(CHAVE_TRILHA, JSON.stringify(estado));
          atualizarProgresso();
        });
      })(caixas[i]);
    }
    atualizarProgresso();

    var limpar = document.getElementById("btn-limpar-trilha");
    if (limpar) {
      limpar.addEventListener("click", function () {
        gravar(CHAVE_TRILHA, "{}");
        var todas = document.querySelectorAll(".concluir input[type=checkbox]");
        for (var j = 0; j < todas.length; j++) { todas[j].checked = false; }
        atualizarProgresso();
      });
    }
  }

  /* ---------- marca a pagina atual no menu ---------- */
  function marcarMenu() {
    var atual = location.pathname.split("/").pop() || "index.html";
    var itens = document.querySelectorAll(".menu a");
    for (var i = 0; i < itens.length; i++) {
      if (itens[i].getAttribute("href") === atual) {
        itens[i].setAttribute("aria-current", "page");
      }
    }
  }

  /* ---------- inicializacao ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    aplicarEscala();
    aplicarContraste(ler(CHAVE_CONTRASTE) === "1");
    marcarMenu();
    iniciarTrilha();

    var maior = document.getElementById("btn-aumentar");
    if (maior) {
      maior.addEventListener("click", function () {
        if (indiceEscala < ESCALAS.length - 1) { indiceEscala++; aplicarEscala(); }
      });
    }
    var menor = document.getElementById("btn-diminuir");
    if (menor) {
      menor.addEventListener("click", function () {
        if (indiceEscala > 0) { indiceEscala--; aplicarEscala(); }
      });
    }
    var contraste = document.getElementById("btn-contraste");
    if (contraste) {
      contraste.addEventListener("click", function () {
        aplicarContraste(!document.body.classList.contains("contraste"));
      });
    }
  });

  /* Service worker: guarda as paginas no proprio celular para que o portal
     abra mesmo com internet ruim ou sem internet depois da primeira visita.
     So funciona em HTTPS, por isso a checagem antes de registrar. */
  if ("serviceWorker" in navigator && location.protocol === "https:") {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () { /* ignora */ });
    });
  }
})();
