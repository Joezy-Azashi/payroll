
import { ExportToCsv } from 'export-to-csv';

export default function PrintToExcel (option = {data: null, title: '', headers: '', filename: 'Amalitech Payroll'}){

        const options = { 
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalSeparator: '.',
          showLabels: true, 
          showTitle: true,
          title: option.title,
          useTextFile: false,
          useBom: true,
          headers: option.headers,
          filename: option.filename
        };

      const csvExporter = new ExportToCsv(options);
       
      csvExporter.generateCsv(option.data);

}