const {
    PDFDocument,
} = require('pdf-lib');
const fs = require('fs');
const {
    dialog
} = require('electron').remote;


async function work() {
    var path = "./a.pdf";
    var path2 = path.replace(/\.([^\.]+$)/, ".split.$1");
    var data = fs.readFileSync(path); // => <data>
    console.log(data.length);
    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(data)

    // Get the first page of the document
    const pages = pdfDoc.getPages();

    console.log(pages.length);

    const pdfDoc2 = await PDFDocument.create();
    const [page1] = await pdfDoc2.copyPages(pdfDoc, [10]);
    pdfDoc2.addPage(page1);
    const data2 = await pdfDoc2.save();
    fs.writeFileSync(path2, data2);
    console.log('完成');
}

async function btnSelect_onclick() {
    if (!dialog) {
        alert('dialog is null');
    }
    let result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{
            name: "PDF",
            extensions: ["pdf"]
        }],
    });
    let path = result.filePaths[0];
    if (path) {
        document.getElementById("txtPath").value = path;
    }
}
window.onload = function() {
    document.body.ondrop = function(event) {
        event.preventDefault();
        let path = event.dataTransfer.files[0];
        if (path) {
            document.getElementById("txtPath").value = path.path;
        }
    }
}
