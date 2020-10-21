const fonts = {
    Roboto: {
      normal: 'fonts/Roboto/Roboto-Regular.ttf',
      bold: 'fonts/Roboto/Roboto-Medium.ttf',
      italics: 'fonts/Roboto/Roboto-Italic.ttf',
      bolditalics: 'fonts/Roboto/Roboto-MediumItalic.ttf'
    }
  };

 const fs = require('fs');
const PdfPrinter = require('pdfmake');
const printer = new PdfPrinter(fonts);
const obj = JSON.parse(fs.readFileSync('./db/data.json', 'utf8'));

const filters = 'Cidade: Ibirama, Curso: Enfermagem';

var row = [['Modalidade', 'Etapas/Curso', 'Tipo de Mediação', 'Parecer', 'Portaria' ]];

function percorrer(obj) {
  for (let i in obj) {
    let curses = [];
    let institution = [{text: [{text: 'Instituição: ', bold: true}, obj[i].instituicaoNome], colSpan: 5}];
    row.push(institution);
    const acts = obj[i].atos;
    for(let j in acts) {
      let listCurse = acts[i].Curso;
      for(let k in listCurse) {
        curses.push(listCurse[k]);
      }
      const temp = [acts[j].modalidade, curses, acts[j].mediacao, acts[j].parecer, acts[j].portaria];
      row.push(temp);
    }
  }
}
    



  //   if (obj.hasOwnProperty(propriedade)) {
  //     if (typeof obj[propriedade] == "object") {
  //       percorrer(obj[propriedade]);
  //     } else {
  //       if(propriedade == 'instituicaoNome') {
  //         resultado.push([])
  //       } else {
  //         if(propriedade == 'Curso'){
  //           console.log(propriedade);
  //           console.log(typeof(propriedade));
  //         }
          
  //       }
  //       resultado.push(obj[propriedade]);
  //     }
  //   }
  // }
//}

percorrer(obj);
console.log(JSON.stringify(row));

const dd = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [65, 70, 65, 60],
    header: 'teste',
    header: {
        columns: [
            {
                image: './img/cee.png',
                width: 100,
                height: 41.25,
            },
            {
                text: [{text: 'Relatório Sintético', style: 'titleStyle'},
                       {text: `\n${filters}`, fontSize: 10}],
                margin: [160, 0.8]
                
            }
          ],
          margin: [65, 35],
          // canvas: [{ type: 'line', x1: 10, y1: 10, x2: 595-10, y2: 10, lineWidth: 1 }],
    }, 
    content: [
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [ '*', '*', '*', '*', '*' ],
    
            body: row
              // [institution],
              // first[0],
              // first[1],
              // [ {text: '', colSpan: 5} ],
              // [{text: [{text: 'Instituição: ', bold: true}, 'ABC'], colSpan: 5}],
              // [ 'Value 1', ['Value 2', 'value2.1', 'value2.3'], 'Value 3', 'Value 4', 'value 5' ],
              // [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4', 'Val 5' ],
            , 
          }
        }
      ],
      styles: {
        titleStyle: {
            fontSize: 18,
            bold: true
        },  
        tableStyle: {
            margin: [80, 100, 65, 60]
        }       
      }
        
}

const pdfDoc = printer.createPdfKitDocument(dd);
pdfDoc.pipe(fs.createWriteStream('output.pdf'));
pdfDoc.end();