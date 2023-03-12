class Despesa{
	constructor(ano, mes, dia, tipo, descricao, valor){
		this.ano = ano 
		this.mes = mes
		this.dia = dia
		this.tipo = tipo 
		this.descricao = descricao
		this.valor = valor
	}

	validarDados(){
		for(let i in this){
			if(this[i] == undefined || this[i] == '' || this[i] == null){
				return false
			}
		}
		return true
	}
}

class Bd {
	constructor(){
		let id = localStorage.getItem('id')

		if(id === null){
			localStorage.setItem('id', 0)
		}

	}

	getProximoId(){
		let proximoId = localStorage.getItem('id') 
		return (parseInt(proximoId) + 1)
	}

	gravar(d){
		let id = this.getProximoId()
		console.log(id)

		localStorage.setItem(id, JSON.stringify(d))

		localStorage.setItem('id', id)
	}

	recuperarTodosRegistros(){

		//array de despesas
		let despesas = Array()

		let id = localStorage.getItem('id')
		
		//recupera todas despesas
		for(let i = 1; i <= id; i++){
			//recuperar a despesa
			let despesa = JSON.parse(localStorage.getItem(i))

			if(despesa === null){
				continue
			}

			despesa.id = i
			despesas.push(despesa)
		}

		return despesas
	}

	pesquisar(despesa){
		let despesasFiltradas = Array()
		despesasFiltradas =  this.recuperarTodosRegistros()

		//ano
		if(despesa.ano != ''){
		    despesasFiltradas  = despesasFiltradas.filter(d => d.ano == despesa.ano)
		}

		//mes
		if(despesa.mes != ''){
		    despesasFiltradas  = despesasFiltradas.filter(d => d.mes == despesa.mes)
		}

		//dia
		if(despesa.dia != ''){
		    despesasFiltradas  = despesasFiltradas.filter(d => d.dia == despesa.dia)
		}

		//tipo
		if(despesa.tipo != ''){
		    despesasFiltradas  = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
		}

		//descricao
		if(despesa.descricao != ''){
		    despesasFiltradas  = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
		}

		//valor
		if(despesa.valor != ''){
		    despesasFiltradas  = despesasFiltradas.filter(d => d.valor == despesa.valor)
		}

		return despesasFiltradas
	}

	remover(id){
		localStorage.removeItem(id)
	}
}

let bd = new Bd()

function cadastrarDespesa(){

	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(
		ano.value,
		mes.value,
		dia.value,
		tipo.value,
		descricao.value,
		valor.value
	)

	if(despesa.validarDados()){
		//dialog de sucesso
		bd.gravar(despesa)
		$('#registraDespesa').modal('show')

		//Mensagem de sucesso titulo
		let texto = document.getElementById('tituloDialog')
		let modalTituloDiv = document.getElementById('modal_titulo_div')
		modalTituloDiv.className = 'modal-header'
		texto.className = 'text-success'
		texto = "Registro efetuado!" 
		document.getElementById('tituloDialog').innerHTML = texto

		//Mensagem de sucesso paragrafo
		let mensagemErro = document.getElementById('textoDialog')
		mensagemErro  = "Dados inseridos com sucesso!"
		document.getElementById('textoDialog').innerHTML = mensagemErro

		//Mensagem de sucesso botao
		let corrigir = document.getElementById('fecharDialog')
		corrigir.className = "btn btn-success"
		corrigir  = "Voltar"
		document.getElementById('fecharDialog').innerHTML = corrigir

		ano.value = ''
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''

	}else {
		//dialog de erro
		$('#registraDespesa').modal('show')

		//Mensagem de erro titulo
		let texto = document.getElementById('tituloDialog')
		let modalTituloDiv = document.getElementById('modal_titulo_div')
		modalTituloDiv.className = 'modal-header'
		texto.className = "text-danger"
		texto = "Erro ao registrar." 
		document.getElementById('tituloDialog').innerHTML = texto

		//Mensagem de erro paragrafo
		let mensagemErro = document.getElementById('textoDialog')
		mensagemErro  = "Campos vazios precisam ser preenchidos"
		document.getElementById('textoDialog').innerHTML = mensagemErro

		//Mensagem de erro botao
		let corrigir = document.getElementById('fecharDialog')
		corrigir.className = "btn btn-danger"
		corrigir  = "Voltar e Corrigir"
		document.getElementById('fecharDialog').innerHTML = corrigir
		
	}
	
}


function carregaListaDespesa(despesas = Array(), filtro = false) {
	// body...

	if(despesas.length == 0 && filtro == false){
		despesas = bd.recuperarTodosRegistros()
	}


	//selecionando item TBODY
	let listaDespesa = document.getElementById('listaDespesas')
	listaDespesa.innerHTML = ''

	//percorrer o array de despesas 
	despesas.forEach(function(d){

		//criando a linha (tr)
		let linha = listaDespesa.insertRow()

		//inserir os valores criando colunas (td)
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
	
		//ajustar o tipo
		switch(parseInt(d.tipo)){
			case 1: d.tipo = 'Alimentação'
				break
			case 2: d.tipo = 'Educação'
				break
			case 3: d.tipo = 'Saúde'
				break
			case 4: d.tipo = 'Lazer'
				break
			case 5: d.tipo = 'Transporte'
				break
		}

		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor

		//cria botao de exclusao
		let btn = document.createElement("button")
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fas fa-times"></i>'
		btn.id = `id_despesa_${d.id}`
		btn.onclick = function(){
			//remove item
			let id = this.id.replace('id_despesa_','')
			bd.remover(id)
			$('#itemExcluido').modal('show')

			//Mensagem de exlusao titulo
			let textoExclusao = document.getElementById('tituloDialogExclusao')
			let modalTituloDivExclusao = document.getElementById('modal_titulo_div_exlusao')
			modalTituloDivExclusao.className = 'modal-header'
			textoExclusao.className = "text-danger"
			textoExclusao = "Item excluido!" 
			document.getElementById('tituloDialogExclusao').innerHTML = textoExclusao

			//Mensagem de exlusao paragrafo
			let mensagemExclusao = document.getElementById('textoDialogExclusao')
			mensagemExclusao  = "Os dados foram apagados com sucesso!"
			document.getElementById('textoDialogExclusao').innerHTML = mensagemExclusao

			//Mensagem de sucesso botao
			let confirma = document.getElementById('fecharDialogExclusao')
			confirma.className = "btn btn-success"
			confirma  = "OK"
			document.getElementById('fecharDialogExclusao').innerHTML = confirma
			document.getElementById('fecharDialogExclusao').onclick = function () {
				window.location.reload()
			}

				
		}
		linha.insertCell(4).append(btn)
	})


}


function pesquisarDespesa() {
	// body...

	let ano = document.getElementById('ano').value
	let mes = document.getElementById('mes').value
	let dia = document.getElementById('dia').value
	let tipo = document.getElementById('tipo').value
	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
	let despesas = bd.pesquisar(despesa)

	carregaListaDespesa(despesas, true)

}


