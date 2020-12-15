const { format } = require('date-fns');

const fs = require('fs');
const PDFprinter = require('pdfmake');

const SinteticoReport = require('./SinteticoReport');
const base = require('./BaseReport');

const oBase = new base();

const oSinteticoReport = new SinteticoReport();

const fonts = {
    Times: {
      normal: 'Times-Roman',
      bold: 'Times-Bold',
      italics: 'Times-Italic',
      bolditalics: 'Times-BoldItalic'
    },
    Roboto: {
      normal: './fonts/Roboto/Roboto-ttf/Roboto-Regular.ttf',
      bold: './fonts/Roboto/Roboto-ttf/Roboto-Medium.ttf',
		  italics: './fonts/Roboto/Roboto-ttf/Roboto-Italic.ttf',
		  bolditalics: './fonts/Roboto/Roboto-ttf/Roboto-MediumItalic.ttf'
    }
  };

const printer = new PDFprinter(fonts);

//const docDefinition = oSinteticoReport.joinModules();
//console.log(oSinteticoReport.joinModules().footer.columns[0]);
const filters = "cidade: Ibirama";
const user    = "Marcus Cirillo";
const acesso = format(new Date(), 'dd/MM/yyyy hh:mm:ss');
//const dd = oBase.headers(filters);
const dd = oSinteticoReport.joinModules(user, filters, acesso);
//console.log(dd);
const pdfdoc = printer.createPdfKitDocument(dd);
pdfdoc.pipe(fs.createWriteStream('pdfmodular.pdf'));
pdfdoc.end();