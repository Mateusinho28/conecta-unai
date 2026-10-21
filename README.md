# Conecta Unaí

Portal de inclusão digital para os bairros Canaã, Novo Horizonte, Iuna, Cidade Nova e
Sagrada Família, em Unaí-MG.

Projeto desenvolvido na disciplina **Atividade Extensionista II: Tecnologia Aplicada à
Inclusão Digital – Projeto**, do curso Superior de Tecnologia em Análise e Desenvolvimento
de Sistemas do Centro Universitário Internacional Uninter.

## O problema

Serviços públicos que antes eram resolvidos no balcão migraram para aplicativos:
agendamento de consulta, benefício social, carteira de trabalho, comprovante de vacina.
Quem não domina o celular perde acesso a direitos que já possui. Nos bairros atendidos,
a barreira raramente é falta de aparelho — é falta de alguém que ensine e de um ponto
de partida confiável.

## O que o portal entrega

| Página | Conteúdo |
|---|---|
| `index.html` | Apresentação do projeto e as três frentes de atuação |
| `servicos.html` | 16 serviços públicos digitais, cada um explicado em uma frase |
| `trilha.html` | Trilha de alfabetização digital em 6 passos, com progresso salvo |
| `voluntarios.html` | Como qualquer morador pode ajudar o próprio bairro |
| `roteiro-oficina.html` | Roteiro minuto a minuto de uma oficina de 1 hora, com lista de presença, pronto para imprimir |

## Decisões técnicas

- **HTML, CSS e JavaScript puros**, sem framework nem dependência externa: carrega rápido
  em celular antigo e em rede 3G.
- **Acessibilidade**: três níveis de tamanho de letra, modo de alto contraste, alvos de
  toque de no mínimo 44 px, marcação semântica, link de pular para o conteúdo e
  `aria-*` nos controles. As preferências ficam salvas em `localStorage`.
- **Funciona sem internet** depois da primeira visita, através de um *service worker*
  com estratégia rede-primeiro e retorno ao cache em caso de falha.
- **Instalável** como aplicativo no celular, via `manifest.webmanifest`.
- **Sem cadastro e sem coleta de dados pessoais**, o que reduz a desconfiança do público
  e evita responsabilidade sobre dados sensíveis.
- **Todos os links externos foram verificados** e apontam apenas para sites oficiais e
  gratuitos (`gov.br`, `cert.br`, Fundação Bradesco e Prefeitura de Unaí).

## Como executar localmente

O site é estático. O `service worker` só é registrado em HTTPS, então em teste local
o portal funciona normalmente, apenas sem o modo offline.

```bash
python -m http.server 8000
# abrir http://localhost:8000
```

## Publicação

Publicado como site estático no Cloudflare Pages, sem servidor de aplicação e sem custo:
**https://conecta-unai.pages.dev/**

## Licença

Conteúdo livre para copiar, imprimir e adaptar em qualquer comunidade.
