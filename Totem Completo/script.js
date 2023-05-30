// Função para emitir uma nova senha
function emitirSenha(tipoSenha) {
  // Cria uma nova senha
  var novaSenha = {
    tipo: tipoSenha,
    numero: gerarNumeroSenha(tipoSenha)
  };

  // Obtém as senhas armazenadas no armazenamento local
  var senhasArmazenadas = obterSenhasArmazenadas();

  // Adiciona a nova senha à lista de senhas emitidas
  senhasArmazenadas.emitidas.push(novaSenha);

  // Salva as senhas atualizadas no armazenamento local
  salvarSenhasArmazenadas(senhasArmazenadas);

  // Exibe a senha emitida para o usuário
  alert('Senha emitida: ' + novaSenha.numero);
}

// Função para gerar um número de senha no formato YYMMDD-PPSQ
function gerarNumeroSenha(tipoSenha) {
  var dataAtual = new Date();
  var ano = dataAtual.getFullYear().toString().substr(-2);
  var mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
  var dia = dataAtual.getDate().toString().padStart(2, '0');
  var sequencia = obterSequenciaPorPrioridade(tipoSenha);

  var numeroSenha = ano + mes + dia + '-' + tipoSenha + sequencia;
  return numeroSenha;
}

// Função para obter a sequência da senha com base no tipo e na prioridade
function obterSequenciaPorPrioridade(tipoSenha) {
  var senhasArmazenadas = obterSenhasArmazenadas();
  var tipoSenhaFiltrado = senhasArmazenadas.emitidas.filter(senha => senha.tipo === tipoSenha);
  var sequencia = tipoSenhaFiltrado.length + 1;
  return sequencia.toString().padStart(2, '0');
}

// Função para gerar um número de senha no formato YYMMDD-PPSQ
function gerarNumeroSenha(tipoSenha) {
  var dataAtual = new Date();
  var ano = dataAtual.getFullYear().toString().substr(-2);
  var mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
  var dia = dataAtual.getDate().toString().padStart(2, '0');
  var sequencia = obterSequenciaPorPrioridade(tipoSenha);
  
  var numeroSenha = ano + mes + dia + '-' + tipoSenha + sequencia;
  return numeroSenha;
}

// Função para obter a sequência da senha com base no tipo e na prioridade
function obterSequenciaPorPrioridade(tipoSenha) {
  var senhasArmazenadas = obterSenhasArmazenadas();
  var tipoSenhaFiltrado = senhasArmazenadas.emitidas.filter(senha => senha.tipo === tipoSenha);
  var sequencia = tipoSenhaFiltrado.length + 1;
  return sequencia.toString().padStart(2, '0');
}

var novaSenhaPrioritaria = {
  tipo: 'SP',
  numero: gerarNumeroSenha('SP')
};
 
  // Função para chamar a próxima senha na ordem correta
  function chamarProximaSenha() {
    // Obtém as senhas armazenadas no armazenamento local
    var senhasArmazenadas = obterSenhasArmazenadas();
  
    // Verifica se há senhas prioritárias (SP) na fila
    var senhaPrioritaria = senhasArmazenadas.emitidas.find(senha => senha.tipo === 'SP');
    if (senhaPrioritaria) {
      // Chama a próxima senha prioritária
      var proximaSenha = senhaPrioritaria;
      senhasArmazenadas.emitidas = senhasArmazenadas.emitidas.filter(senha => senha !== proximaSenha);
      senhasArmazenadas.chamadas.push(proximaSenha);
    } else {
      // Verifica se há senhas para retirada de exames (SE) na fila
      var senhaExames = senhasArmazenadas.emitidas.find(senha => senha.tipo === 'SE');
      if (senhaExames) {
        // Chama a próxima senha para retirada de exames
        var proximaSenha = senhaExames;
        senhasArmazenadas.emitidas = senhasArmazenadas.emitidas.filter(senha => senha !== proximaSenha);
        senhasArmazenadas.chamadas.push(proximaSenha);
      } else {
        // Chama a próxima senha geral (SG)
        var senhaGeral = senhasArmazenadas.emitidas.find(senha => senha.tipo === 'SG');
        if (senhaGeral) {
          var proximaSenha = senhaGeral;
          senhasArmazenadas.emitidas = senhasArmazenadas.emitidas.filter(senha => senha !== proximaSenha);
          senhasArmazenadas.chamadas.push(proximaSenha);
        }
      }
    }
  
    salvarSenhasArmazenadas(senhasArmazenadas);
    atualizarPainel(senhasArmazenadas.chamadas);
  }
  
  // Função para obter as senhas armazenadas no armazenamento local
  function obterSenhasArmazenadas() {
    var senhasJSON = localStorage.getItem('senhas');
    var senhas = JSON.parse(senhasJSON) || { emitidas: [], chamadas: [] };
    return senhas;
  }
  
  // Função para salvar as senhas no armazenamento local
  function salvarSenhasArmazenadas(senhas) {
    var senhasJSON = JSON.stringify(senhas);
    localStorage.setItem('senhas', senhasJSON);
  }
  
  // Função para atualizar o painel do atendente com as senhas
  function atualizarPainel(senhas) {
    var chamadosList = document.getElementById('chamados');
  
    // Limpa o painel
    chamadosList.innerHTML = '';
  
    // Adiciona as senhas ao painel
    for (var i = 0; i < senhas.length; i++) {
      var chamado = senhas[i];
      var listItem = document.createElement('li');
      listItem.textContent = chamado.numero;
      chamadosList.appendChild(listItem);
    }
  }
  
  // Função para exibir os chamados na página do atendente
  function exibirChamados() {
    // Obtém as senhas armazenadas no armazenamento local
    var senhasArmazenadas = obterSenhasArmazenadas();
  
    // Atualiza o painel do atendente com as senhas chamadas
    atualizarPainel(senhasArmazenadas.chamadas);
  }
  
  // Função para limpar todas as senhas
  function limparSenhas() {
    // Verifica se existem senhas na fila
    var senhasArmazenadas = obterSenhasArmazenadas();
  
    if (senhasArmazenadas.emitidas.length > 0 || senhasArmazenadas.chamadas.length > 0) {
      // Confirmação do atendente antes de limpar as senhas
      var confirmacao = confirm("Tem certeza de que deseja limpar todas as senhas?");
  
      if (confirmacao) {
        // Limpa as senhas armazenadas no armazenamento local
        salvarSenhasArmazenadas({ emitidas: [], chamadas: [] });
  
        // Atualiza o painel do atendente com as senhas limpas
        atualizarPainel([]);
  
        alert("Lista de Senhas limpada com Sucesso!");
      }
    } else {
      alert("Não existem senhas na fila.");
    }
  }







// Lógica em JavaScript para o funcionamento do sistema

// // Função para emitir uma nova senha
// function emitirSenha(tipoSenha) {
//   // Cria uma nova senha
//   var novaSenha = {
//     tipo: tipoSenha,
//     numero: gerarNumeroSenha()
//   };

//   // Obtém as senhas armazenadas no armazenamento local
//   var senhasArmazenadas = obterSenhasArmazenadas();

//   // Adiciona a nova senha à lista de senhas emitidas
//   senhasArmazenadas.emitidas.push(novaSenha);

//   // Salva as senhas atualizadas no armazenamento local
//   salvarSenhasArmazenadas(senhasArmazenadas);

//   // Exibe a senha emitida para o usuário
//   alert('Senha emitida: ' + formatarSenha(novaSenha));
// }

// // Função para gerar um número de senha aleatório
// function gerarNumeroSenha() {
//   // Implemente sua lógica para gerar um número de senha aqui
//   // Você pode usar a data e hora atual, um contador, ou qualquer outra abordagem que preferir
//   // Neste exemplo, usaremos um número aleatório entre 100 e 999
//   return Math.floor(Math.random() * (999 - 100 + 1)) + 100;
// }

// // Função para formatar uma senha
// function formatarSenha(senha) {
//   var data = new Date();
//   var ano = String(data.getFullYear()).slice(-2);
//   var mes = padLeft(String(data.getMonth() + 1), 2, '0');
//   var dia = padLeft(String(data.getDate()), 2, '0');
//   var tipo = senha.tipo.toUpperCase();
//   var sequencia = padLeft(String(senha.sequencia), 2, '0');
//   return `${ano}${mes}${dia}-${tipo}${sequencia}`;

  
// }



// // Função para preencher à esquerda com zeros
// function padLeft(value, length, character) {
//   return String(value).padStart(length, character);
// }

// // Função para preencher à direita com caracteres
// function padRight(value, length, character) {
//   return String(value).padEnd(length, character);
// }

// // Função para chamar a próxima senha
// function chamarProximaSenha() {
//   // Obtém as senhas armazenadas no armazenamento local
//   var senhasArmazenadas = obterSenhasArmazenadas();

//   if (senhasArmazenadas.emitidas.length > 0) {
//     // Remove a próxima senha da lista de senhas emitidas
//     var proximaSenha = senhasArmazenadas.emitidas.shift();

//     // Adiciona a senha chamada à lista de senhas chamadas
//     senhasArmazenadas.chamadas.push(proximaSenha);

//     // Salva as senhas atualizadas no armazenamento local
//     salvarSenhasArmazenadas(senhasArmazenadas);

//     // Atualiza o painel do atendente com as senhas chamadas
//     atualizarPainel(senhasArmazenadas.chamadas);
//   } else {
//     alert('Não há mais senhas na fila.');
//   }
// }

// // Função para obter as senhas armazenadas no armazenamento local
// function obterSenhasArmazenadas() {
//   var senhasJSON = localStorage.getItem('senhas');
//   var senhas = JSON.parse(senhasJSON) || { emitidas: [], chamadas: [] };
//   return senhas;
// }

// // Função para salvar as senhas no armazenamento local
// function salvarSenhasArmazenadas(senhas) {
//   var senhasJSON = JSON.stringify(senhas);
//   localStorage.setItem('senhas', senhasJSON);
// }

// // Função para atualizar o painel do atendente com as senhas
// function atualizarPainel(senhas) {
//   var chamadosList = document.getElementById('chamados');

//   // Limpa o painel
//   chamadosList.innerHTML = '';

//   // Adiciona as senhas ao painel
//   for (var i = 0; i < senhas.length; i++) {
//     var chamado = senhas[i];
//     var listItem = document.createElement('li');
//     listItem.textContent = formatarSenha(chamado);
//     chamadosList.appendChild(listItem);
//   }
// }

// // Função para exibir os chamados na página do atendente
// function exibirChamados() {
//   // Obtém as senhas armazenadas no armazenamento local
//   var senhasArmazenadas = obterSenhasArmazenadas();

//   // Atualiza o painel do atendente com as senhas chamadas
//   atualizarPainel(senhasArmazenadas.chamadas);
// }

// // Função para limpar todas as senhas
// function limparSenhas() {
//   // Verifica se existem senhas na fila
//   var senhasArmazenadas = obterSenhasArmazenadas();

//   if (senhasArmazenadas.emitidas.length > 0 || senhasArmazenadas.chamadas.length > 0) {
//     // Confirmação do atendente antes de limpar as senhas
//     var confirmacao = confirm("Tem certeza de que deseja limpar todas as senhas?");

//     if (confirmacao) {
//       // Limpa as senhas armazenadas no armazenamento local
//       salvarSenhasArmazenadas({ emitidas: [], chamadas: [] });

//       // Atualiza o painel do atendente com as senhas limpas
//       atualizarPainel([]);

//       alert("Lista de Senhas limpada com Sucesso!");
//     }
//   } else {
//     alert("Não existem senhas na fila.");
//   }
// }

// // Chama a função para exibir os chamados ao carregar a página
// exibirChamados();
