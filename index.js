const {
    PDFDocument,
} = require('pdf-lib');
const fs = require('fs');
const {
    dialog
} = require('electron').remote;

function shift(arr) {
    if (!arr || arr.length == 0) {
        return null;
    }
    let n = arr.shift().trim();
    if (!n) {
        return shift(arr);
    }
    let p = n.indexOf("-");
    if (p == -1) {
        return parseInt(n);
    }
    return {
        a: parseInt(n.substr(0, p)),
        b: parseInt(n.substr(p + 1)),
    }
}

function parseArr(arr) {
    let arr2 = [];
    if (!arr) {
        return arr2;
    }
    while (true) {
        if (arr.length == 0) {
            break;
        }
        let n = arr.shift().trim();
        if (!n) {
            continue;
        }
        let p = n.indexOf("-");
        if (p == -1) {
            arr2.push(parseInt(n));
            continue;
        }
        let a = parseInt(n.substr(0, p))
        let b = parseInt(n.substr(p + 1))
        if (a < b) {
            for (let i = a; i <= b; i++) {
                arr2.push(i);
            }
        } else {
            for (let i = a; i >= b; i--) {
                arr2.push(i);
            }
        }
    }
    return arr2;
}
async function work(path, numbers) {
    try {
        let path2 = path.replace(/\.([^\.]+$)/, ".split.$1");
        let data = fs.readFileSync(path); // => <data>
        const doc1 = await PDFDocument.load(data)
        let total = doc1.getPages().length;
        //
        const doc2 = await PDFDocument.create();
        const arr = numbers.split(",");
        let arr2 = parseArr(arr);
        for (let i = 0; i < arr2.length; i++) {
            let item = arr2[i]
            if (item == 0 || item > total) {
                alert2(`${item} 超出页码范围`);
            }
            arr2[i] = item - 1;
        }
        //
        const pages2 = await doc2.copyPages(doc1, arr2);
        pages2.forEach((p) => doc2.addPage(p));
        const data2 = await doc2.save();
        fs.writeFileSync(path2, data2);
        //
        alert2(`完成 共${arr2.length}页`);
        console.log(arr2);
    } catch (e) {
        alert2(e.message);
    }
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

function btnOK_onclick() {
    var path = document.getElementById("txtPath").value.trim();
    var numbers = document.getElementById("txtNumbers").value.trim();
    if (!path || !numbers) {
        return;
    }
    if (!/^(\d+(-\d+)?,?)+$/.test(numbers)) {
        alert2("指定页面的格式错误", "abcd");
        return;
    }
    work(path, numbers);
}

window.onload = function() {
    let body = document.documentElement;
    body.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        let path = e.dataTransfer.files[0];
        if (path) {
            document.getElementById("txtPath").value = path.path;
        }
    });
    body.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return true;
    });
}

function alert2(s) {
    var label = document.querySelector("#lblMessage")
    label.innerHTML = s;
    setTimeout(() => {
        label.innerHTML = "";
    }, 2000);
}
