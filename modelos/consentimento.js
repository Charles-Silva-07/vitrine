(function () {
  var raiz = document.documentElement;
  var ativo = raiz.getAttribute('data-rastreamento') === 'ligado';
  var CHAVE = 'consentimento-cookies';

  if (!ativo) return;
  raiz.classList.add('rastreio');
  document.querySelectorAll('.so-rastreio').forEach(function (el) { el.hidden = false; });

  function ler() {
    try { return JSON.parse(localStorage.getItem(CHAVE)); } catch (e) { return null; }
  }

  function gravar(prefs) {
    try { localStorage.setItem(CHAVE, JSON.stringify(prefs)); } catch (e) {}
    if (typeof window.aoConsentir === 'function') window.aoConsentir(prefs);
  }

  var aviso = document.createElement('div');
  aviso.id = 'aviso-cookies';
  aviso.setAttribute('role', 'dialog');
  aviso.setAttribute('aria-labelledby', 'aviso-cookies-titulo');
  aviso.setAttribute('aria-modal', 'false');
  aviso.tabIndex = -1;
  aviso.hidden = true;
  aviso.className = 'fixed inset-x-0 bottom-[5.5rem] md:bottom-0 z-50 bg-white border-t-4 border-ouro shadow-[0_-12px_32px_-12px_rgba(13,27,56,.35)]';
  aviso.innerHTML =
    '<div class="max-w-6xl mx-auto px-5 sm:px-6 py-5">' +
      '<p id="aviso-cookies-titulo" class="font-serif font-semibold text-xl text-ink">Sua privacidade</p>' +
      '<p class="mt-2 text-base text-corpo max-w-[75ch]">Usamos cookies necessários para o funcionamento da página. Com a sua autorização, também usamos cookies estatísticos e de publicidade. Você pode recusar sem prejuízo ao acesso. Saiba mais na <a href="politica-de-privacidade.html" class="font-bold text-carteira underline underline-offset-4">Política de Privacidade</a>.</p>' +
      '<div id="aviso-cookies-config" class="mt-4 space-y-3 text-base text-ink" hidden>' +
        '<p class="flex items-start gap-3"><input type="checkbox" checked disabled class="caixa mt-0.5"><span><strong>Necessários.</strong> Sempre ativos. Guardam a sua escolha de cookies.</span></p>' +
        '<label class="flex items-start gap-3 cursor-pointer"><input type="checkbox" id="ck-estatistico" class="caixa mt-0.5"><span><strong>Estatísticos.</strong> Ajudam a entender como a página é usada.</span></label>' +
        '<label class="flex items-start gap-3 cursor-pointer"><input type="checkbox" id="ck-publicidade" class="caixa mt-0.5"><span><strong>Publicidade.</strong> Medem o resultado de anúncios.</span></label>' +
      '</div>' +
      '<div class="mt-5 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">' +
        '<button type="button" id="ck-aceitar" class="min-h-[3.5rem] px-6 py-3 rounded-md bg-carteira text-white text-lg font-bold border-2 border-carteira hover:bg-noite transition duration-300">Aceitar todos</button>' +
        '<button type="button" id="ck-recusar" class="min-h-[3.5rem] px-6 py-3 rounded-md bg-white text-carteira text-lg font-bold border-2 border-carteira hover:bg-papel transition duration-300">Recusar os não necessários</button>' +
        '<button type="button" id="ck-configurar" class="min-h-[3.5rem] px-4 py-3 text-lg font-bold text-carteira underline underline-offset-4" aria-expanded="false" aria-controls="aviso-cookies-config">Configurar</button>' +
        '<button type="button" id="ck-salvar" class="min-h-[3.5rem] px-6 py-3 rounded-md bg-carteira text-white text-lg font-bold border-2 border-carteira hover:bg-noite transition duration-300" hidden>Salvar preferências</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(aviso);

  var config = aviso.querySelector('#aviso-cookies-config');
  var botaoConfig = aviso.querySelector('#ck-configurar');
  var botaoSalvar = aviso.querySelector('#ck-salvar');
  var caixaEstat = aviso.querySelector('#ck-estatistico');
  var caixaPub = aviso.querySelector('#ck-publicidade');

  function mostrar(abrirConfig) {
    var atual = ler();
    caixaEstat.checked = !!(atual && atual.estatistico);
    caixaPub.checked = !!(atual && atual.publicidade);
    aviso.hidden = false;
    alternarConfig(!!abrirConfig);
    if (abrirConfig) aviso.focus();
  }

  function alternarConfig(abrir) {
    config.hidden = !abrir;
    botaoSalvar.hidden = !abrir;
    botaoConfig.setAttribute('aria-expanded', abrir);
  }

  function decidir(estatistico, publicidade) {
    gravar({ estatistico: estatistico, publicidade: publicidade, data: new Date().toISOString() });
    aviso.hidden = true;
  }

  aviso.querySelector('#ck-aceitar').addEventListener('click', function () { decidir(true, true); });
  aviso.querySelector('#ck-recusar').addEventListener('click', function () { decidir(false, false); });
  botaoConfig.addEventListener('click', function () { alternarConfig(config.hidden); });
  botaoSalvar.addEventListener('click', function () { decidir(caixaEstat.checked, caixaPub.checked); });

  document.querySelectorAll('[data-abrir-cookies]').forEach(function (el) {
    el.addEventListener('click', function () { mostrar(true); });
  });

  var existente = ler();
  if (existente) {
    if (typeof window.aoConsentir === 'function') window.aoConsentir(existente);
  } else {
    mostrar(false);
  }
})();
