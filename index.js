setores = [
  { opcao: "1", descricao: "Rastreamento", arquivo: "./scripts/1" },
  { opcao: "2", descricao: "Suporte", arquivo: "./scripts/2" },
  { opcao: "3", descricao: "Financeiro", arquivo: "./scripts/3" },
  { opcao: "4", descricao: "Comercial", arquivo: "./scripts/4" }
];

atendimentos = [
  { numero: "0000000000", setor: "-1" } // esse é obrigatório,
];

function checaAtendimento(__numero) {
  for (x = 0; x < atendimentos.length; x++) {
    if (atendimentos[x].numero === __numero) {
      return atendimentos[x];
    }
  }
  return atendimentos[0];
}

function iniciaAtendimento(__numero, setor = 0) {
  atendimentos.push({ numero: __numero, setor: setor });
}

function trocaSetor(__numero, setor) {
  for (x = 0; x < atendimentos.length; x++) {
    if (atendimentos[x].numero == __numero) {
      atendimentos.splice(x, 1);
    }
  }
  iniciaAtendimento(__numero, setor);
}

function encerraAtendimento(__numero) {
  for (x = 0; x < atendimentos.length; x++) {
    if (atendimentos[x].numero == __numero) {
      atendimentos.splice(x, 1);
    }
  }
  console.log("Atendimento Encerrado");
}

function buscaSetor(setor) {
  for (x = 0; x < setores.length; x++) {
    if (setores[x].opcao == setor) {
      //console.log("vai para o setor ", setores[x].descricao);
      return setores[x];
    }
  }
  return -1;
}

function menuInicial(){
  return "Olá, seja bem vindo a SUAEMPRESA\n\nComo podemos lhe ajudar?:\n\n1 - Rastreamento\n2 - Suporte\n3 - Financeiro\n4 - Comercial\n# - Trocar Departamento\n* - Encerrar Atendimento";
}

function roteamento(__numero, mensagem) {
  let setor = checaAtendimento(__numero).setor;

  if (setor == -1 || mensagem == "#") {
    // console.log(menuInicial());
    trocaSetor(__numero, (setor = 0));
    return menuInicial();
  } else if (mensagem == "*") {
    encerraAtendimento(__numero);
  } else {
    if (setor == 0) {
      __setor = buscaSetor(mensagem);
      if (__setor == -1) {
        // console.log("Não entendi. Por favor, escolha um departamento.");
        return "Não entendi. Por favor, escolha um departamento.";
      } else {
        trocaSetor(__numero, __setor.opcao);
        // console.log("Você está em: " +__setor.descricao);
        return "Você está em: " +__setor.descricao;
      }
    } else {
      // console.log("encaminha mensagem ao operador do departamento -> "+__setor.descricao);
      return "encaminha mensagem ao operador do departamento -> "+__setor.descricao;
    }
  }
}