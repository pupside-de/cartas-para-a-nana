/*
  COMO ADICIONAR UMA NOVA CARTA
  -----------------------------
  Copie o bloco abaixo e cole no final da lista LETTERS (antes do "];"),
  mudando o conteúdo. Cada carta precisa de:

    id:    um identificador único, sem espaços (ex: "carta-04")
    title: o "rótulo" que aparece no envelope (ex: uma data ou um apelido)
    date:  texto livre, aparece no topo da carta (pode deixar "")
    body:  o texto da carta. Use \n\n para separar parágrafos.

  Exemplo:
  {
    id: "carta-04",
    title: "Para a Nana",
    date: "Outubro de 2026",
    body: "Minha Nana,\n\nAqui vai o texto da carta...\n\nCom carinho,\n[seu nome]"
  },
*/

const LETTERS = [
  {
    id: "carta-01",
    title: "A primeira",
    date: "",
    body: "Minha Nana,\n\nEssa é só uma carta de exemplo — substitua este texto pelo\nconteúdo real quando for digitalizar e transcrever as suas cartas.\n\nCom carinho,\n[seu nome]"
  },
  {
    id: "carta-02",
    title: "Para os dias difíceis",
    date: "",
    body: "Minha Nana,\n\nOutro exemplo de carta. Edite o arquivo js/letters.js para\ncolocar o texto de verdade aqui.\n\nCom carinho,\n[seu nome]"
  },
  {
    id: "carta-03",
    title: "Sobre nós",
    date: "",
    body: "Minha Nana,\n\nMais uma carta de exemplo, só para você ver como vai ficar o\nvisual da grade de envelopes antes de colocarmos as cartas reais.\n\nCom carinho,\n[seu nome]"
  },
];
