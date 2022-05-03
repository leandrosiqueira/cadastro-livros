'use strict';

const abrirModal = () => document.getElementById('modal')
  .classList.add('active');

const fecharModal = () => {
  limparCampos();
  document.getElementById('modal').classList.remove('active');
}


const obterArmazenamentoLocal = () => JSON.parse(localStorage.getItem('db_livro')) ?? [];
const configurarArmazenamentoLocal = (bancoLivro) => localStorage.setItem("db_livro", JSON.stringify(bancoLivro));

// CRUD - create read update delete
const removerLivro = (indice) => {
  const bancoLivro = lerLivro();
  bancoLivro.splice(indice, 1);
  configurarArmazenamentoLocal(bancoLivro);
}

const atualizarLivro = (indice, livro) => {
  const bancoLivro = lerLivro();
  bancoLivro[indice] = livro;
  configurarArmazenamentoLocal(bancoLivro);
}

const lerLivro = () => obterArmazenamentoLocal();

const criaLivro = (livro) => {
  const dbLivro = obterArmazenamentoLocal();
  dbLivro.push(livro);
  configurarArmazenamentoLocal(dbLivro);
}

const camposValidos = () => {
  return document.getElementById('form').reportValidity();
}

//Interação com o layout

const limparCampos = () => {
  const campos = document.querySelectorAll('.modal-field');
  campos.forEach(campo => campo.value = "");
  document.getElementById('titulo').dataset.index = 'new';
}

const salvaLivros = () => {
  debugger
  if (camposValidos()) {
    const livro = {
      titulo: document.getElementById('titulo').value,
      autor: document.getElementById('autor').value,
      editora: document.getElementById('editora').value,
      ano: document.getElementById('ano').value
    }
    const indice = document.getElementById('titulo').dataset.index;
    if (indice == 'new') {
      criaLivro(livro);
      atualizaTabela();
      fecharModal();
    } else {
      atualizarLivro(indice, livro)
      atualizaTabela();
      fecharModal();
    }
  }
}

const criaLinha = (livro, indice) => {
  const novaLinha = document.createElement('tr');
  novaLinha.innerHTML = `
        <td>${livro.titulo}</td>
        <td>${livro.autor}</td>
        <td>${livro.editora}</td>
        <td>${livro.ano}</td>
        <td>
            <button type="button" class="button green" id="edit-${indice}">Editar</button>
            <button type="button" class="button red" id="delete-${indice}" >Excluir</button>
        </td>
    `
  document.querySelector('#tabelaLivro>tbody').appendChild(novaLinha);
}

const limpaTabela = () => {
  const linhas = document.querySelectorAll('#tabelaLivro>tbody tr');
  linhas.forEach(linha => linha.parentNode.removeChild(linha));
}

const atualizaTabela = () => {
  const bancoLivro = lerLivro();
  limpaTabela();
  bancoLivro.forEach(criaLinha);
}

const preencheCampos = (livro) => {
  document.getElementById('titulo').value = livro.titulo;
  document.getElementById('autor').value = livro.autor;
  document.getElementById('editora').value = livro.editora;
  document.getElementById('ano').value = livro.ano;
  document.getElementById('titulo').dataset.index = livro.index;
}

const editaLivro = (indice) => {
  const livro = lerLivro()[indice];
  livro.index = indice;
  preencheCampos(livro);
  abrirModal();
}

const removeLivro = (evento) => {
  if (evento.target.type == 'button') {

    const [acao, indice] = evento.target.id.split('-');

    if (acao == 'edit') {
      editaLivro(indice);
    } else {
      const livro = lerLivro()[indice];
      const resposta = confirm(`Deseja realmente excluir o livro ${livro.titulo}`);
      if (resposta) {
        removerLivro(indice);
        atualizaTabela();
      }
    }
  }
}

atualizaTabela()
 
document.getElementById('cadastrarLivro').addEventListener('click', abrirModal);

document.getElementById('modalClose').addEventListener('click', fecharModal);

document.getElementById('salvar').addEventListener('click', salvaLivros);

document.querySelector('#tabelaLivro>tbody').addEventListener('click', removeLivro);

document.getElementById('cancelar').addEventListener('click', fecharModal);