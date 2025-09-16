export async function GET() {
  const js = `(() => {
    var current = document.currentScript || (function(){
      var scripts = document.getElementsByTagName('script');
      for (var i = scripts.length - 1; i >= 0; i--) {
        var s = scripts[i];
        var src = s.getAttribute('src') || '';
        if (src.indexOf('/embed.js') !== -1) return s;
      }
      return null;
    })();
    if (!current) return;
    var srcAttr = current.getAttribute('src') || window.location.href;
    var url = new URL(srcAttr, window.location.href);
    var origin = url.origin;
    var ds = current.dataset || {};
    var mintId = ds.mintId || current.getAttribute('data-mint-id') || '';
    if (!mintId) return;
    var width = ds.width || current.getAttribute('data-width') || '100%';
    var height = ds.height || current.getAttribute('data-height') || '315';
    var allow = ds.allow || current.getAttribute('data-allow') || 'autoplay; fullscreen; picture-in-picture';
    var style = ds.style || current.getAttribute('data-style') || 'border:0;overflow:hidden';
    var refp = ds.referrerpolicy || current.getAttribute('data-referrerpolicy') || 'strict-origin-when-cross-origin';
    var embedId = (ds.embedId || Math.random().toString(36).slice(2) + Date.now().toString(36));
    var border = ds.border || current.getAttribute('data-border') || '';
    var pump = ds.pump || current.getAttribute('data-pump') || '';
    var controls = ds.controls || current.getAttribute('data-controls') || '';
    var qs = '';
    function addParam(k){
      if (qs) qs += '&';
      qs += k + '=1';
    }
    if (border && border !== '0' && border !== 'false') addParam('border');
    if (pump && pump !== '0' && pump !== 'false') addParam('pump');
    if (controls && controls !== '0' && controls !== 'false') addParam('controls');
    var iframe = document.createElement('iframe');
    iframe.src = origin + '/e?mintId=' + encodeURIComponent(mintId) + '&embedId=' + encodeURIComponent(embedId) + (qs ? '&' + qs : '');
    if (String(width).indexOf('%') !== -1) {
      iframe.style.width = String(width);
    } else {
      iframe.width = String(width);
    }
    iframe.height = String(height);
    iframe.setAttribute('allow', String(allow));
    iframe.setAttribute('style', String(style));
    iframe.setAttribute('referrerpolicy', String(refp));
    iframe.setAttribute('loading', 'lazy');
    current.insertAdjacentElement('afterend', iframe);

    function onMsg(ev){
      if (!ev || ev.origin !== origin) return;
      var d = ev.data || {};
      if (d.type !== 'pump-embed:aspect') return;
      if (d.embedId && d.embedId !== embedId) return;
      var aspect = Number(d.aspect);
      if (!aspect || !isFinite(aspect) || aspect <= 0) return;
      var w;
      var widthStr = String(width);
      if (widthStr.indexOf('%') !== -1) {
        w = iframe.clientWidth || 560;
      } else {
        w = parseFloat(widthStr);
        if (!w || !isFinite(w)) w = iframe.clientWidth || 560;
      }
      var h = Math.round(w / aspect);
      iframe.height = String(h);
      iframe.style.height = h + 'px';
    }
    window.addEventListener('message', onMsg, false);
  })();`;
  return new Response(js, {
    headers: {
      "content-type": "application/javascript; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}
