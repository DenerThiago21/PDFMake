/**
 * instanciação das fontes, utilizando uma fonte padrão, o pdfmake possui 14
 * caso haja a necessidade de uma fonte diferente, deve-se baixar os arquivos das
 * fontes e apontar o caminho delas dentro do objeto fonts
 */
const fonts = {
  Times: {
    normal: 'Times-Roman',
    bold: 'Times-Bold',
    italics: 'Times-Italic',
    bolditalics: 'Times-BoldItalic'
  }
};

const fs = require('fs');
const PdfPrinter = require('pdfmake');

const printer = new PdfPrinter(fonts);

// recuperação do json e armazenado dentro da const obj
const obj = JSON.parse(fs.readFileSync('./db/data.json', 'utf8'));

const filters = 'Cidade: Ibirama, Curso: Enfermagem';

/**
 * headers, array contendo os cabeçalhos das colunas nas tabelas.
 */
const headers = [{text: 'Modalidade', bold: true},
                {text: 'Etapas/Curso', bold: true},
                {text: 'Tipo de Mediação', bold: true},
                {text: 'Parecer', bold: true},
                {text: 'Portaria', bold: true}];

// criação do array que será o body do relatório
var row = [];
row.push(headers);

/**
 * função que percorre o json e vai acrescentando dados dentro do array, 
 * a cada nova iteração é uma linha dentro do array que irá formar a tabela 
 * dentro do pdfmake
 * @param {*} obj 
 */
function percorrer(obj) {
  for (let i in obj) {
    // variável curses é um array, pois podem haver mais de um curso cadastrado
    let curses = [];
    let institution = [{text: [{text: 'Instituição: ', bold: true}, obj[i].instituicaoNome], colSpan: 5, fillColor: '#CCCCCC'}];
    // nesta etapa insere-se na linha a instiuição
    row.push(institution);
    const acts = obj[i].atos;
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
}

/**
 * chamada da função percorrer
 */
percorrer(obj);

/**
 * Aqui começa a montagem do relatório
 */
const dd = {
    // parâmetros da página
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [65, 100, 65, 65],
    // cabeçalho do doc
    header: {
        columns: [
            {
                image: './img/cee.png',
                width: 100,
                height: 41.25,
            },
            {
                text: [{text: 'Relatório de Atos - Sintético', style: 'titleStyle'},
                       {text: `\n${filters}`, fontSize: 10, bold: false, style: 'titleStyle'}],
                margin: [160, 1]
                
            }
          ],
          margin: [65, 25]
    }, 
    // rodapé
    footer: function(currentPage, pageCount) {
      return {
        columns: [
          { 
            text: [{text: 'Página '+currentPage.toString()+' de '+pageCount, bold: true},
                   {text: '\nEmitido pelo Sistema do Conselho Estadual de Educação em: xx/xx/xxxx xx:xx:xx'},
                   {text: '\nUsuário: Dener Thiago Ancini'}]
          }
        ],
        style: ['defaultStyle', 'footerStyle'],
        margin: [0, 0, 65, 0]
      }
    },
    // conteúdo do report ... aqui é onde a tabela será criada
    content: [
        {
          layout: 'lightHorizontalLines',//traça as linhas
          // criação da tabela
          table: {
            //aponta quantas linhas de cabeçalho existem
            headerRows: 1, 
            // tamanho das colunas onde '*' -> é relativo, será dividio igualmente entre as demais colunas
            widths: [ 100, '*', 100, '*', '*' ],     
            // body é onde a tabela é montada, aqui onde chamamos o array row, contendo a tabela que será renderizada
            body: row
          },
          style: 'defaultStyle'
        }
      ],
      //Styles: o pdfMake permite criar diferentes estilos e ir aplicando a cada "elemento" dentro do report
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

//criação e saida do arquivo em PDF
console.log(dd);
const pdfDoc = printer.createPdfKitDocument(dd);
pdfDoc.pipe(fs.createWriteStream('output.pdf'));
pdfDoc.end();
