/* i18n PT/EN — HTML já contém PT como padrão; EN sobrescreve via data-i18n + JSON.
   Fallback: se o fetch falhar, o site permanece no idioma atual (PT embutido). */
(function () {
  'use strict';
  var KEY = 'lang';
  var current = 'pt';

  function apply(lang, dict) {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    var desc = document.querySelector('meta[name="description"]');
    if (desc && dict['meta.description']) desc.setAttribute('content', dict['meta.description']);
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (dict[k] != null) el.innerHTML = dict[k];
    });
    document.querySelectorAll('.lang-toggle button').forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-lang') === lang);
    });
    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang, dict: dict } }));
  }

  function load(lang) {
    if (lang === current) return;
    fetch('i18n/' + lang + '.json')
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (dict) {
        current = lang;
        try { localStorage.setItem(KEY, lang); } catch (e) {}
        apply(lang, dict);
      })
      .catch(function () {}); // permanece no idioma atual
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.lang-toggle button').forEach(function (b) {
      b.addEventListener('click', function () { load(b.getAttribute('data-lang')); });
    });
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    if (saved === 'en') load('en');
  });
})();
