(() => {
  const header = document.getElementById('header');
  const menu = document.getElementById('menu');
  const nav = document.getElementById('nav');

  // Header ganha fundo ao rolar
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 16);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menu mobile
  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    header.classList.toggle('menu-open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };
  menu.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 820) setMenu(false); });

  // Formulário: monta a mensagem e abre o WhatsApp
  const form = document.getElementById('form');
  const err = document.getElementById('err');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = form.nome.value.trim();
    const tipo = form.tipo.value;
    const msg = form.msg.value.trim();
    if (!nome || !msg) { err.hidden = false; return; }
    err.hidden = true;
    const texto = `Olá, MABELLO! Meu nome é ${nome}.\nTenho interesse em: ${tipo}.\n\n${msg}`;
    window.open('https://wa.me/5511966188923?text=' + encodeURIComponent(texto), '_blank', 'noopener');
  });
})();
