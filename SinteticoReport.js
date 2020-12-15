const BaseReport = require('./BaseReport');
const fs = require ('fs');

const db = JSON.parse(fs.readFileSync('./db/data copy.json', 'utf8'));

const base = new BaseReport();

let row = [];

class SinteticoReport {
    
    headerSintetico() {
        const headers = [{text: 'Modalidade', bold: true},
                         {text: 'Etapas/Curso', bold: true},
                         {text: 'Tipo de Mediação', bold: true},
                         {text: 'Parecer', bold: true},
                         {text: 'Portaria', bold: true}];
        
        return headers;
    }

    percorrer(db) {
        row.push(this.headerSintetico());
        //row.push(this.headerSintetico);
        for(let i in db) {
            // variável curses é um array, pois podem haver mais de um curso cadastrado
            let curses = [];
            let institution = [{text: [{text: 'Instituição: ', bold: true}, db[i].instituicaoNome], colSpan: 5, fillColor: '#CCCCCC'}];
            // nesta etapa insere-se na linha a instiuição
            row.push(institution);
            const acts = db[i].atos;
            for(let j in acts) {
                let listCurse = acts[j].Curso;
                for(let k in listCurse) {
                    // percorre o array de cursos e adiciona-os em um array
                    curses.push(listCurse[k]);
                }
                // montagem das linhas da tabela dentro da variável temp
                const temp = [acts[j].modalidade, curses, acts[j].mediacao, acts[j].parecer, acts[j].portaria];
                // adicionando as linhas dentro do array "matriz"
                row.push(temp);
                curses = [];
            }
            // ColSpan: mesclar colunas;
            // text está vazio, para gerar um espaço entre as instituições
            row.push([ {text: '', colSpan: 5}]);
        }
        console.log(row);
        return row;
    }

    bodyReport(){
        let row = [];
        row.push(this.headerSintetico);

        row.push(this.percorrer(db));

        //console.log(row);
        return row;
    }

    joinModules() {
        const filters = 'cidade: Ibirama, Curso: Enfermagem';
        const user    = 'Marcus Cirillo';
        
        const conf   = base.pageConfig();
        const header = base.headers(filters);
        const footer = base.footers(user);

        const data = {
            pageSize: conf.pageSize,
            pageOrientation: conf.pageOrientation,
            pageMargins: conf.pageMargins,
            header,
            footer,
            content: [
                {
                    //text: {text: 'Algo aqui'},
                    layout: 'lightHorizontalLines',//traça as linhas
                    // criação da tabela
                    table: {
                        //aponta quantas linhas de cabeçalho existem
                        headerRows: 1, 
                        // tamanho das colunas onde '*' -> é relativo, será dividio igualmente entre as demais colunas
                        widths: [ 100, '*', 100, '*', '*' ],     
                        // body é onde a tabela é montada, aqui onde chamamos o array row, contendo a tabela que será renderizada
                        body: this.percorrer(db),
                    },
                    style: 'defaultStyle',
                }
            ],
            styles: {
                titleStyle: {
                    fontSize: 18,
                    font: 'Times',
                    bold: true
                },
                defaultStyle: {
                  fontSize: 10,
                  font: 'Times'
        
                },  
                tableStyle: {
                    alignment: 'center'
                },   
                tableHeaderStyle: {
                  bold: true,
                },
                footerStyle: {
                  fontSize: 10,
                  alignment: 'right'
                }
              }
        }
        return data;

    }
}

module.exports = SinteticoReport;