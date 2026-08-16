const THEME_INIT_SCRIPT = `(function(){
  try {
    var stored = localStorage.getItem('chirag-theme');
    // Defaults to light regardless of OS preference — only an explicit
    // in-app toggle switches to dark.
    var theme = stored === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    var hue = localStorage.getItem('chirag-hue');
    if (hue) {
      var h = parseFloat(hue);
      if (!isNaN(h)) {
        document.documentElement.style.setProperty('--accent', 'oklch(.58 .21 ' + h + ')');
        document.documentElement.style.setProperty('--accent-weak', 'oklch(.58 .21 ' + h + ' / .12)');
        document.documentElement.style.setProperty('--accent-ghost', 'oklch(.58 .21 ' + h + ' / .045)');
      }
    }
  } catch (e) {}
})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />;
}
