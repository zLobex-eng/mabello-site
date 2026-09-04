MABELLO V10 — EDIÇÃO DE POLIMENTO FINAL

ARQUIVOS
- index.html  → estrutura e textos
- styles.css  → visual, responsividade e animações
- script.js   → interações, scroll, cursor, Canvas e terminal
- assets/     → logo e Lobex

COMO ABRIR
1. Extraia a pasta.
2. Abra index.html no navegador.
3. Para estudar do jeito certo, abra a pasta inteira no VS Code.
4. Se tiver a extensão Live Server, clique com o botão direito em index.html > Open with Live Server.

O QUE FOI REFINADO NA V10
- Cursor praticamente colado ao mouse; o halo tem apenas uma inércia curta.
- Glow do mouse refeito sem blur grande, reduzindo custo gráfico.
- Rede Canvas mais leve (menos pontos, menor resolução e ~25 FPS).
- Banners do MABELLO Labs com spotlight, scan, reflexo e mais espaço no final.
- Microinterações em serviços, processo e contato.
- Hero com telemetria visual e melhor adaptação a telas baixas.
- Terminal com comandos status/versao e atalho '/' para focar.
- Acessibilidade: focus-visible, skip link e respeito a reduced motion.
- content-visibility em seções longas para melhorar renderização fora da tela.

IMPORTANTE
Esta versão continua 100% HTML + CSS + JavaScript, de propósito, para você conseguir estudar a base. Quando formos transformar o projeto em produção, o passo seguinte recomendado é migrar a interface para Next.js + TypeScript, componentizar e implementar o formulário real no servidor.
