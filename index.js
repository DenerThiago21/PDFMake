const fonts = {
  Times: {
    normal: 'Times-Roman',
    bold: 'Times-Bold',
    italics: 'Times-Italic',
    bolditalics: 'Times-BoldItalic'
  },
  // Roboto: {
  //   normal: 'fonts/Roboto/Roboto-Regular.ttf',
  //   bold: 'fonts/Roboto/Roboto-Medium.ttf',
  //   italics: 'fonts/Roboto/Roboto-Italic.ttf',
  //   bolditalics: 'fonts/Roboto/Roboto-MediumItalic.ttf'
  // }
};

const fs = require('fs');
const PdfPrinter = require('pdfmake');
const printer = new PdfPrinter(fonts);
const obj = JSON.parse(fs.readFileSync('./db/data.json', 'utf8'));

const filters = 'Cidade: Ibirama, Curso: Enfermagem';

//var row = [['Modalidade', 'Etapas/Curso', 'Tipo de Mediação', 'Parecer', 'Portaria' ]];
const headers = [{text: 'Modalidade', bold: true},
{text: 'Etapas/Curso', bold: true},
{text: 'Tipo de Mediação', bold: true},
{text: 'Parecer', bold: true},
{text: 'Portaria', bold: true}];
var row = [];
row.push(headers);

function percorrer(obj) {
  for (let i in obj) {
    let curses = [];
    let institution = [{text: [{text: 'Instituição: ', bold: true}, obj[i].instituicaoNome], colSpan: 5, fillColor: '#CCCCCC'}];
    row.push(institution);
    const acts = obj[i].atos;
    for(let j in acts) {
      let listCurse = acts[j].Curso;
      for(let k in listCurse) {
        curses.push(listCurse[k]);
      }
      const temp = [acts[j].modalidade, curses, acts[j].mediacao, acts[j].parecer, acts[j].portaria];
      row.push(temp);
      curses = [];
    }
    row.push([ {text: '', colSpan: 5} ])
  }
  //DESENHAR LINHA MAIS ESCURA PARA  DIVIDIR
}

percorrer(obj);

const dd = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [65, 100, 80, 65],
    header: 'teste',
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
    content: [
        {
          layout: 'lightHorizontalLines',
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [ 100, '*', 100, '*', '*' ],
    
            body: row
          },
          style: 'defaultStyle'
        }
      ],
      styles: {
        titleStyle: {
            fontSize: 18,
            font: 'Times',
            bold: true
        },
        defaultStyle: {
          fontSize: 12,
          font: 'Times'

        },  
        tableStyle: {
            alignment: 'center'
        },   
        tableHeaderStyle: {
          bold: true,
        }
      }
        
}

const pdfDoc = printer.createPdfKitDocument(dd);
pdfDoc.pipe(fs.createWriteStream('output.pdf'));
pdfDoc.end();