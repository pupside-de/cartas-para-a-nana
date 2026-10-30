/*
  COMO ADICIONAR UMA NOVA CARTA
  -----------------------------
  Copie o bloco abaixo e cole no final da lista LETTERS (antes do "];"),
  mudando o conteúdo. Cada carta precisa de:

    id:    um identificador único, sem espaços (ex: "carta-21")
    title: o "rótulo" interno da carta (não aparece na tela, só pra
           facilitar achar a carta neste arquivo)
    date:  o cabeçalho que aparece no topo da carta (data + cidade)
    body:  o texto da carta. Use \n\n para separar parágrafos.

  Exemplo:
  {
    id: "carta-21",
    title: "Para a Nana",
    date: "Outubro de 2026. Teresina, Piauí, Brasil.",
    body: "Minha Nana,\n\nAqui vai o texto da carta...\n\nCom carinho,\n[seu nome]"
  },
*/

const LETTERS = [
  {
    id: "carta-01",
    title: "1 de janeiro",
    date: "1 de janeiro de 2026. Teresina, Piauí, Brasil.",
    body: `Minha Nana,

Resolvi escrever cartas para a Nana neste ano de 2026. São cartas que decidi escrever com alguma frequência, mas não sei quando a Nana vai lê-las. Se ainda este ano ou só no próximo, confesso que não sei.

Qual será o conteúdo das cartas? Também não sei dizer. É possível que, por vezes, elas tenham uma carga emocional um pouco mais intensa, mas às vezes vou estar só falando de coisas meio aleatórias também.

O que eu sei é que quero escrever cartas para a Nana.

Enfim.

Eu me encontrei bem pensativo nessa virada de 2025 para 2026. Pensando sobre muitas coisas, sobre o ano que passou, sobre o ano que está vindo. Me peguei pensando: o que eu quero para a minha vida? Quem sou, onde estou e para onde vou?

É engraçado como uma pessoa pode querer tantas coisas em uma só vida. Algumas dessas coisas são desejos, expectativas que ela mesma criou ou que criaram para ela. E, recentemente, acho que tenho vivido muito na lógica do "tenho que". Tenho que fazer isso, tenho que fazer aquilo, tenho que ser, tenho que ter alguma coisa. E, não sei, acho que esse é um jeito pesado de viver. Claro que precisamos de sonhos e objetivos para sermos melhores a cada dia, com certeza. Mas, se a toda hora "temos que" alguma coisa, será que nunca estamos satisfeitos com a condição em que estamos? Isso não tornaria ainda mais difícil viver o aqui e o agora?

Não sei para onde esses pensamentos levam. Afinal de contas, são só pensamentos produzidos dentro da minha cabecinha, que mal cabe em chapéu nenhum de tão grandona.

Sem saber ao certo como terminar esta primeira carta, só posso dizer que tenho saudades da Nana! De verdade, você tem me ensinado muito sobre o amor, meu bem. E acredito que a viagem que fiz para Belém no final de 2025 me marcou e vai me marcar para sempre, pois foi um momento único para conhecer Belém, sua família, seus amigos e, mais importante, conhecer você ainda mais.

Com carinho,
Seu Petrão.`
  },
  {
    id: "carta-02",
    title: "2 de janeiro",
    date: "2 de janeiro de 2026. Teresina, Piauí, Brasil.",
    body: `Minha Nana,

Uma vez um professor da escola falou: "Meninas, se baseiem em como os meninos tratam a mãe deles, porque diz muito sobre como eles vão tratar vocês."

E eu acho que levei isso a sério demais. Eu gosto de tratar minha mãe bem, sempre gostei e tentei me esforçar para isso. Mas sinto que muitas vezes não consigo, e isso me frustra. Fico com medo de estar seguindo os passos do meu pai, e ainda mais medo de tratar a Nana assim.

Sinto um grande peso nessa coisa. Por vezes, eu, minha mãe, meu pai e a Suellen sendo segurados por uma areia movediça, como em um buraco negro.

São nesses momentos que fico pensando nas ideias mais mirabolantes de juntar dinheiro para sair logo de casa, poder me sustentar e poder viver com a Nana. Só que, das ideias mirabolantes, rendem-se poucos frutos e muita ansiedade e preocupação.

Será que vou passar na residência? Vou para o alistamento militar? Vou passar um ano? Eu nem sei mais que residência fazer, sendo sincero. Qual seria o meu perfil? Seria bom para concurso?

Quero ter uma casinha com a Nana em Parnaíba. Sendo pequena, o tanto que desse para pagar, mas seria nossa. Eu vou lutar por isso.

Eu admiro que as conversas da Nana são calorosas. Falando no Uber que nos levou ao shopping, a Nana sorri e todos ao redor sorriem juntos. Falando com alguém na rua, a Nana faz uma piadinha ou fala de um jeito engraçado, descontraído e espontâneo.

Com amor,
Seu Petrão.`
  },
  {
    id: "carta-03",
    title: "3 de janeiro",
    date: "3 de janeiro de 2026. Teresina, Piauí, Brasil.",
    body: `Minha Nana,

Hoje eu me senti com muita energia no meu dia. Acredito que foi a viagem para o Pará, passando os dias com a Nana. Descansei bem a cabeça, sinto-me mais leve agora. A sua companhia me faz bem.

Esses dias eu falei que estava bem reflexivo, pensando em muitas coisas. Eu sei que não é legal remoer as coisas, mas eu queria pedir desculpas por, ano passado, eu ter falado em terminar, meu bem. De verdade. Isso jamais vai acontecer novamente.

Com amor,
Seu Petrão.`
  },
  {
    id: "carta-04",
    title: "4 de janeiro",
    date: "4 de janeiro de 2026. Teresina, Piauí, Brasil.",
    body: `Meu bem,

Gosto muito de jogar Minecraft com a Nana.

Hoje estou com poucas ideias além dessa. Mas sabe de algo que eu gosto? Eu gosto de contar histórias para a Nana. Hoje eu contei do meu primo, que quer cobrar 500 reais para fazer um site para mim, e do meu cocô de 600 gramas que fiz no banheiro da minha casa (me pesei antes e depois na balança de casa). Eu sei que eu morri de rir contando a história, enquanto a Nana fazia cara de "que história é essa???", eu gosto.

Te amo, amor, minha princesa. Boa noite!

Com carinho,
Seu Petrão.`
  },
  {
    id: "carta-05",
    title: "13 de janeiro",
    date: "13 de janeiro de 2026. Teresina, Piauí, Brasil.",
    body: `Meu bem,

Esses dias eu tive vários pesadelos com a Nana, em que a Nana me deixa pelos mais variados motivos. Mas tudo isso é só pesadelo, e eu sei que não vai acontecer.

Com carinho,
Seu Petrão.`
  },
  {
    id: "carta-06",
    title: "14 de janeiro",
    date: "14 de janeiro de 2026. Teresina, Piauí, Brasil.",
    body: `Meu bem,

Ontem a Nana me fez uma pergunta: "Como é a divisão dos gastos na sua casa?"

Especificamente ontem, essa pergunta gerou um pouco de gatilhos no Petrão, porque ontem mesmo teve uma briga na casa dele, bem feia, por conta de dinheiro, justamente por conta da divisão dos gastos. Petrão não gosta de brigar por dinheiro. Acha que o dinheiro tem um potencial grande de afastar as pessoas, se elas não souberem como usá-lo. Enfim, foi por isso que eu fiquei mais distante com a pergunta: porque me lembrei dessa situação da minha casa.

Na verdade, sempre que eu penso no meu pai, mesmo chamando de papai, eu sinto meio que uma repulsa, uma raiva, um desgosto. Enfim, daria para fazer páginas e páginas de adjetivos.

Enfim, eu te amo, viu?

Com carinho,
Seu Petrão.`
  },
  {
    id: "carta-07",
    title: "16 de janeiro",
    date: "16 de janeiro de 2026. Teresina, Piauí, Brasil.",
    body: `Minha Nana,

O sorriso da Nana é muito lindo, uma das coisas mais lindas que já vi e que vejo todos os dias. É, de verdade, muito genuíno e muito alegre.

Com carinho,
Seu Petrão.`
  },
  {
    id: "carta-08",
    title: "19 de janeiro",
    date: "19 de janeiro de 2026. Teresina, Piauí, Brasil.",
    body: `Minha Nana,

Eu amo as piadas da Nana e como ela consegue ter tiradas inteligentes e fazer brotar alegrias até mesmo nos momentos mais tristes e desafiadores. Eu admiro muito isso em você, meu amor. Você é luz para mim nos momentos difíceis.

Com carinho,
Seu Petrão.`
  },
  {
    id: "carta-09",
    title: "22 de janeiro",
    date: "22 de janeiro de 2026. Teresina, Piauí, Brasil.",
    body: `Minha Nana,

Uma das minhas metas secretas para este ano de 2026 é me preparar para casar com a Nana. E, por acaso, alguém se prepara para casar? Eu confesso que não sei, aaahh, mas achei um objetivo apropriado. Não sei, pensei comigo: se eu evoluir bastante neste ano de 2026, vou estar um ótimo futuro marido para pedir você em casamento, certo? Então eu resolvi ler mais, usar menos o celular e estudar ainda mais, gastar menos, investir mais, me esforçar para fazer atividade física, me afetar menos com as coisas da minha família que não posso controlar, desenvolver amizades e me esforçar para impor melhor meus limites.

Eu sei que não sou perfeito. Na verdade, nunca serei, e não devo nem quero ser algo perto disso, pois seria ilusão, e só Deus pode isso. E eu sei que já cometi erros no passado que até mesmo abalaram nosso relacionamento, e tenho muito medo de cometê-los novamente. Eu falava muito do meu avô, que ele sempre considerou o poder da palavra, e foi por isso, eu acho, que a Nana resolveu acreditar em mim: porque eu sempre falei e sempre fiz o que falava. Até que, em 2025, eu não fiz. Graças a Deus nós voltamos e estamos firmes e fortes hoje.

Desde então eu fiquei tão frustrado comigo mesmo e com essa afirmativa do meu avô, porque eu não consegui cumprir o que falei, que eu pediria você em casamento, que sempre estaríamos juntos, para você naquela época em que terminamos.

Eu entendo também que nem sempre meu avô deve ter cumprido a palavra dele, afinal é humano e o que ficou de lembrança foram os feitos positivos dele. E não estou tentando justificar essa situação passada nem nada, enfim.

Mas o que sei é que quero a minha vida com você, minha Nana. Quero construir ainda mais da nossa vida juntos, quero casar com você, quero me tornar melhor.

No internato, as pessoas, buscando puxar assunto, perguntam da minha vida amorosa, e eu falo então de você, da minha namorada maravilhosa, de quando nos conhecemos, de Parnaíba, falo do Pará. E, curiosas, as pessoas perguntam ainda mais. E depois, de certa forma, se espantam ao saber que dei de presente de Natal para você um livro de receitas da Netflix ("que presente, hein… não é um tanto machista?") ou que acabamos ficando muito tempo sem nos ver (às vezes dois meses, ou até três). Até mesmo perguntam: "É pouco tempo um ano de namoro, né?"

Por vezes eu fico com vontade é de dar na cara dessas pessoas, mas eu só discordo delas na hora e fico calado, porque perco o interesse de falar da minha vida pessoal para quem quer ficar me julgando tanto, sem nada saber sobre a nossa história. Eu e a Nana já vivemos tanta coisa, e tem muita coisa por vir ainda. Nós somos mais fortes do que qualquer um pode esperar.

E tenho certeza, Thaina Corrêa Moraes: chegará o dia em que vamos nos casar. Obrigado por ser tão incrível, meu bem. Eu quero ser o meu melhor para você, pois você merece o melhor de mim.

Com carinho,
Seu Petrão.`
  },
  {
    id: "carta-10",
    title: "3 de fevereiro",
    date: "3 de fevereiro de 2026. Teresina, Piauí, Brasil.",
    body: `Minha Nana,

Enquanto escrevo esta carta, ouço música de Minecraft, pensando nas minhas jogatinas de Minecraft com a Nana. Pensando no que já construímos juntos no jogo e na vida real, no que aprendemos no jogo e na vida real. A música me transmite uma sensação de calma, de paciência, de que as coisas que queremos que aconteçam vão acontecer, e vão acontecer no tempo delas.

Com carinho,
Seu Petrão.`
  },
  {
    id: "carta-11",
    title: "7 de fevereiro",
    date: "7 de fevereiro de 2026. Teresina, Piauí, Brasil.",
    body: `Minha nana,

No final do ano passado, eu comentei que tinha me inscrito em uma aula de finanças. Acredita que a aula só foi acontecer hoje? Mas, mesmo acontecendo hoje, eu decidi, desde o ano passado, que ia melhorar nas finanças. E ia melhorar para que a gente pudesse se ver em momentos oportunos e aproveitar bem nosso tempo juntos. Já tiveram alguns momentos em que me encontrei preocupado com contas para pagar e querendo ver a Nana ao mesmo tempo. Eu decidi, enfim, que ia dar um jeito de ter mais liberdade financeira, para então viver uma vida mais abundante e, enfim, podermos nos ver, pagar passagem de ônibus ou avião, nossa alimentação… Eu espero poder te ajudar com as coisas do nosso muleki também.

Esses foram alguns dos motivadores. Ano passado, eu consegui juntar 1.000 reais investidos, e hoje, 07/02, eu percebi que já consegui juntar 2.000 reais investidos, mais rápido do que eu imaginava. Você não sabe ainda, meu bem, mas esse dinheiro é nosso pequeno patrimônio futuro, para que possamos construir nossa vida juntos.

Ainda tem muita coisa que não sei sobre o dinheiro, e tenho percebido que mais dinheiro traz, sim, mais segurança e liberdade, mas também traz muita complexidade (eu confesso que é meio desesperador ter 2.000 reais investidos, hahah). Eu pensei em falar do marco dos 2.000 hoje com a Nana para comemorar, mas pensei em guardar a informação para surpreendê-la depois.

Também porque sinto que eu falava muito de dinheiro um tempo atrás. Falava bastante das minhas preocupações com dinheiro também. E sei que isso é válido e importante de falar, mas tenho pensado em falar menos de dinheiro, só o necessário. Na verdade, quando tivermos nossos gastos conjuntos, o Petrão vai falar bem mais, hehe. Mas, por ora, vou guardando esse pouquinho para realizar alguns sonhos meus, pois a Nana está nos meus sonhos.

Com carinho,
Seu Petrão.`
  },
  {
    id: "carta-12",
    title: "1 de março",
    date: "1 de março de 2026. Teresina, Piauí, Brasil.",
    body: `Minha Nana,

Eu fico pensando: "Será que a Nana sente falta das minhas cartas? Será que ela fica preocupada por eu estar escrevendo menos?" Porque em 2024 e 2025 eu escrevia bastante, e aos poucos fui reduzindo bem a quantidade delas. Até que decidi escrever essas "cartas secretas" que você está lendo agora, para fazer uma coletânea e te surpreender depois, em algum momento.

Esses dias, estou prestes a finalizar a obstetrícia da maternidade, e nos últimos dias tenho me sentido para baixo, cansado, me comparando demais com os outros, me reprimindo demais pelo que faço. Tenho tentado entender isso e de onde isso está vindo. E aos poucos tenho sentido uma leve melhora.

Sabe, eu lembro do passado sempre como algo muito bom, algo muito melhor que o presente. E lembro dos meus anos em Parnaíba. Eu me sentia tão livre aí em Parnaíba, enquanto em Teresina me sinto mais pesado, mais sozinho, com mais dificuldade de me conectar com as pessoas, a ponto de não me sentir mais tanto UFDPar, tampouco UFPI.

Mas, tomando outra perspectiva, as coisas se tornaram mais complexas do final de 2024 para cá. Nós vivemos tanta coisa juntos: estou com meus empregos no marketing, a Nana com a lojinha, o internato, os estudos para a residência. Tudo isso é muito maior e mais complexo do que o que conhecíamos em 2024. Maior ainda do que o mundo que o Petrão de 18 anos conhecia em 2021 quando entrou na faculdade.

Eu revisito as nossas memórias, vejo o primeiro vídeo que postamos juntos no Insta, ouço as músicas da nossa playlist… Nossa, crescemos tanto, meu bem.

As nossas memórias, a nossa história, são os bens mais valiosos que temos. Um dia teremos casa, carros, empresas, que terão, sim, um grande valor nas nossas vidas. Mas as nossas memórias, o nosso amor nanatronístico, serão muito maiores que tudo isso. Serão o fundamento, o pavimento de tudo, pois serão a representação de Deus em nossas vidas.

Com carinho,
Seu Petrão.`
  },
  {
    id: "carta-13",
    title: "27 de março",
    date: "27 de março de 2026. Teresina, Piauí, Brasil.",
    body: `Minha Nana,

Quando eu estava no estágio de obstetrícia, eu e a Nana nos desentendemos. A Nana ficou com raiva de mim e disse que queria terminar. Eu não aceitei, e logo no dia seguinte estava arrumado para ir a Parnaíba, para conversarmos e nos reencontrarmos.

Erramos um com o outro nessa época. Sentimos raiva um do outro e até angústia, mas fico feliz que acertamos juntos quando conversamos e escolhemos um ao outro.

Tenho aprendido que o amor é calmo, mas, quando necessário, o amor também urge, pois faz parte daquilo que nos faz sentir vivos.

Com carinho,
Seu Petrão.`
  },
  {
    id: "carta-14",
    title: "14 de abril",
    date: "14 de abril de 2026. Teresina, Piauí, Brasil.",
    body: `Minha nana,

Às vezes eu sinto que não sou um bom namorado para a Nana. Às vezes sinto que, mesmo tentando melhorar, estou muito longe de conseguir isso. Talvez, do ponto de vista imediatista, eu esteja. Mas, pensando no médio e longo prazo, eu esteja sendo um bom namorado para a Nana.

Hoje eu vi que faltam 60 dias para o Dia dos Namorados. Faz um tempo que estou planejando o seu presente. Vai ser um diorama nosso de biscuit, representando nosso primeiro encontro. Em breve vou comprar os materiais e fazer os primeiros modelos.

Eu venho tentando trabalhar alguns vícios também. Até sinto que estou indo bem nesses dias, mas ainda sinto uma grande dependência do celular e de ficar rolando a tela. Vou tentar ler mais e passar menos tempo no celular. Também sinto que tenho tido muita dificuldade de aproveitar os pequenos momentos.

Com carinho,
Seu Petrão.`
  },
  {
    id: "carta-15",
    title: "13 de julho",
    date: "13 de julho de 2026. Teresina, Piauí, Brasil.",
    body: `Minha vidas,

Essa foi a maior quantidade de tempo que consegui passar em Parnaíba com a Nana desde 2024. Foram o quê, dez dias!

Nesse meio-tempo, estudamos bastante: eu para a residência e a Nana para a prova de infectologia dela. Também fizemos pizza juntos pela primeira vez e assistimos à Copa. Pena que o Brasil perdeu para a Noruega.

Também acabamos nos desentendendo, porque eu estava forçando você a ir para a academia e a comer de determinada forma. Acabei te invalidando nessa época, eu peço desculpas por isso.

Ao mesmo tempo, fico feliz que conseguimos conversar sobre isso, buscamos soluções juntos e, logo depois, resolvemos um livro de palavras-cruzadas. Eu gosto de como a Nana é aberta ao mundo. Compramos o livro porque confiamos no moço do sinal. Se eu estivesse sozinho, dificilmente teria confiado nele. Mas abrimos o vidro, olhamos os produtos dele e compramos. Isso não só deixou o nosso dia um pouquinho mais feliz, como acredito que o dele também. É por isso que acho que você traz luz por onde passa.

Também passamos por outra provação nessa época, uma que nos exigiu paciência: estudar juntos para a sua prova. E não só isso, mas também convencer a Nana de que ela tinha chances reais, de que ia conseguir, e pensar em novas soluções juntos. Mais uma vez, me enche de felicidade termos passado por isso juntos, do nosso jeito, aprendendo um com o outro.

Com carinho,
Seu Petrão.`
  },
  {
    id: "carta-16",
    title: "22 de setembro",
    date: "22 de setembro de 2026. Teresina, Piauí, Brasil.",
    body: `Minha vidas,

Me sinto muito bem com a sua companhia e na sua presença, meu bem. Este ano tivemos que lidar com algo difícil, que foi aquele acontecimento na festa da hipertensiva entre a Nana, a Aliciane e o Kaynner. Para mim, não foi algo linear de se lidar. Teve momentos em que consegui lidar com mais facilidade, e outros em que minha ansiedade com o assunto aumentou e fiquei mais triste. Mas nada disso se compara à alegria de ir para Parnaíba e estar na sua companhia.

Notei que, namorando à distância, surgem certas inseguranças e medos que poderiam ser resolvidos simplesmente com o seu abraço apertado. É por isso que busco valorizar cada abraço e cada momento que passamos juntos. Devo dizer que agora em setembro, eu ainda estava bem inseguro com esse acontecimento da festa, mas foi só abraçar você que todo esse medo e essa insegurança foram varridos para longe, e isso não tem mais me incomodado desde então.

Para mim, é muito nítido que estamos amadurecendo, e muito. Falando de mim, acho que o meu eu do passado seria muito mais impulsivo diante dessa situação, agiria ainda mais movido pelas emoções e pelo medo. Fico feliz que pudemos lidar com isso com a "frieza" que a situação pedia, pois assim conseguimos conversar e resolver juntos.

Enfim, eu me sinto muito bem na sua presença e na presença da sua família. Por vezes, ficamos um tempo sem nos ver: um mês, dois meses, e desta vez quase três. Mas, para mim, tudo isso valeu e continua valendo a pena pelos momentos e aventuras que vivemos juntos. Quando penso no futuro, receio que possamos ficar ainda mais tempo sem nos ver por causa da residência, e isso me dá medo. Mas sei que, quando chegar a hora, saberemos lidar, e que o nosso amor vale esse tipo de sacrifício.

Com carinho,
Seu Petrão.`
  },
  {
    id: "carta-17",
    title: "15 de outubro",
    date: "15 de outubro de 2026. Teresina, Piauí, Brasil.",
    body: `Minha vidas,

Hoje minha irmã, Suellen, tentou se mutilar na minha frente. Uns chamaram de mutilação e, num grau mais extremo, de tentativa de suicídio. Enfim, foi um dia muito intenso, e no final dele senti um cansaço físico imenso.

Sou grato por você ter me acompanhado neste dia, por ter puxado minha orelha quando necessário e por ter me oferecido apoio.

Agora, no fim do dia, estou ouvindo músicas de Minecraft no YouTube Music, relembrando os momentos bons que já tive com a Nana jogando Minecraft. Mesmo muito cansado, isso serve para me curar um pouquinho desse dia tão maluco.

Pensar em você me faz bem. Me dá, até hoje, aquele quentinho no coração. Um quentinho que serve, por vezes, de afago, por outras vezes, de calorão.

Com carinho,
Seu Petrão.`
  },
  {
    id: "carta-18",
    title: "18 de outubro",
    date: "18 de outubro de 2026. Teresina, Piauí, Brasil.",
    body: `Minha vidas,

Esses dias tivemos muitas conversas sobre política.

Tenho aprendido que validar significa reconhecer e aceitar que os sentimentos, pensamentos e experiências de uma pessoa são reais e compreensíveis dentro do contexto em que ela está vivendo. Ou seja, validar não significa concordar com tudo o que o outro fala ou faz, nem assumir a responsabilidade pelos problemas de alguém. Diante disso, entendo que eu e a Nana podemos ter falhado em validar um ao outro nesses momentos. Por isso, te peço desculpas pelas vezes em que fiquei pesquisando algo enquanto falávamos sobre política, ou mostrei que não estava prestando atenção, pois assim acabei te invalidando. Também te peço desculpas por ter demorado tanto para deixar claro o meu ponto de vista.

Confesso que falar tanto de política tem me feito aprender junto com você, ao mesmo tempo que tem me causado certa ansiedade e insegurança.

Com carinho,
Seu Petrão.`
  },
  {
    id: "carta-19",
    title: "28 de outubro",
    date: "28 de outubro de 2026. Teresina, Piauí, Brasil.",
    body: `Minha Nana,

Hoje a Nana deu a entender que queria terminar comigo. Isso foi inesperado para mim e me deixou ansioso.

E, ansioso, esperei nesse dia pela minha consulta com a psicóloga. Conversando na terapia, ela me orientou a pensar no seguinte depois da sessão: será que existem outras formas de resolver essa situação que envolve política com a minha namorada sem, necessariamente, falar de política?

Foi aí que pensei: e se retomássemos, de alguma forma, todas as coisas boas que fazem o meu relacionamento com a Nana valer a pena?

Afinal de contas, eu quero falar de tudo com você, meu bem, aprender com você e junto de você, bem pertinho. Mas não quero que determinadas coisas, como opiniões políticas, determinem o nosso relacionamento, pois acredito com muita força que somos mais do que isso.

Como escrevi em uma destas cartas, as nossas memórias são os nossos bens mais valiosos. Esse foi um dos principais motivos que me fizeram começar a escrever lá no início do ano e continuar até aqui, mesmo sem saber quando nem como te entregaria.

Tentando usar o máximo de mim para encontrar boas soluções para o nosso relacionamento, acredito que são as memórias que construímos, tudo o que já vivemos, que vão nos ajudar a atravessar os nossos desentendimentos sobre política, ou sobre qualquer outro tema.

Com carinho,
Seu Petrão.`
  },
  {
    id: "carta-20",
    title: "30 de outubro",
    date: "30 de outubro de 2026. Teresina, Piauí, Brasil.",
    body: `Minha vidas,

Hoje estou nos ajustes finais destas cartas e do site para você lê-las. Busquei fazer tudo com máxima atenção aos detalhes e todo o carinho que você merece.

Eu te amo muito minha vidas, mesmo. Quero minha vida todinhas com você.

Com carinho,
Seu Petrão.`
  },
];
