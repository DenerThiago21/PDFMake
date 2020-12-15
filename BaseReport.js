
class BaseReport {

  constructor(header, footer, font) {
    this.header = header;
    this.footer = footer;
    this.font = font;
  }


  pageConfig() {
    const conf = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [65, 100, 65, 65]
    };
    return conf;
  }

  fonts() {
    const font = {
      Times: {
        normal: 'Times-Roman',
        bold: 'Times-Bold',
        italics: 'Times-Bold',
        bolditalics: 'Times-BoldItalic'
      }
    }
    return this.font = font;
  }
  

  headers(filters) {
    let header = {
      columns: [
        {
          image: './img/cee.png',
          width: 100,
          height: 41.25,
        },
        {
          text: [{text: 'Relatório de Atos'},
                 {text: `\nFiltros: ${filters}`, fontsize: 10, bold: false}],
          margin: [160, 1]
        }
      ],
      margin: [65, 25]
    }
    return this.header = header;
  }


  Pagefooter = (currentPage, pageCount) => {
    let count = {text: 'Página '+currentPage.toString()+' de '+pageCount, bold: true};
    console.log(count);
    return count;
  }
  
  footers (usuario, acesso) {
    let footer = {columns: [
                {
                  text: [{text: 'página x de y'},
                  {text: `\nEmitido pelo OEB em: ${acesso}`},
                  {text: `\nusuario: ${usuario}`}]
                }
      ],
      style: ['defaultStyle', 'footerStyle'],
      margin: [0, 0 , 65, 0]
    };

    return this.footer = footer;
  }
}

module.exports = BaseReport;