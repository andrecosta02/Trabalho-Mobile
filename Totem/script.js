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

  function atualizarUltimaSenhaChamada() {
    var senhasArmazenadas = obterSenhasArmazenadas();
    var ultimaSenhaChamada = senhasArmazenadas.chamadas.slice(-1)[0];
  
    if (ultimaSenhaChamada) {
      var elementoSenhaChamada = document.getElementById('senha-chamada');
      elementoSenhaChamada.textContent = 'Última senha chamada: ' + formatarSenha(ultimaSenhaChamada.numero);
    }
  }
  
  // // Adicione essa chamada de função no final do arquivo script.js para atualizar a última senha chamada ao carregar a página
  // atualizarUltimaSenhaChamada();
  
