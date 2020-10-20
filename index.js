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

const dd = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [65, 70, 65, 60],
    //header: 'teste',
    header: {
        columns: [
            {
                image: './img/cee.png',
                width: 100,
                height: 41.25,
            },
            {
                text: [{text: 'Relatório Sintético', style: 'titleStyle'},
                       {text: '\nfiltro(s):', fontSize: 10}],
                margin: [160, 0.8]
                
            }
          ],
          margin: [65, 35]
    }, 
    // content: [
    //     {
    //       layout: 'lightHorizontalLines', // optional
    //       table: {
    //         // headers are automatically repeated if the table spans over multiple pages
    //         // you can declare how many rows should be treated as headers
    //         headerRows: 1,
    //         widths: [ '*', 'auto', 100, '*' ],
    
    //         body: [
    //           [ 'First', 'Second', 'Third', 'The last one' ],
    //           [ 'Value 1', 'Value 2', 'Value 3', 'Value 4' ],
    //           [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
    //         ], 
    //       }
    //     }
    //   ],
      styles: {
        titleStyle: {
            fontSize: 18,
            bold: true
        }         
      }
        
}

const pdfDoc = printer.createPdfKitDocument(dd);
pdfDoc.pipe(fs.createWriteStream('output.pdf'));
pdfDoc.end();