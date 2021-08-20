let url = '/controller.php';
const filesListEl = document.getElementById('files-list');
let filename;


let indent_level = 4;
let OPENING_BRACKET_REGEX = /\'.*{.*\'/;
let CLOSING_BRACKET_REGEX = /\'.*}.*\'/;

const prettify = (content) => {

    let codeLines = content.split('\n');
    let indentLevels = getIndentationLevels(codeLines);
    let formattedCode = '';
    for (let i = 0; i < codeLines.length ;i++) {
        let currentLine = codeLines[i].trim();
        if (currentLine) {
            currentLine = (Array(indentLevels[i]*indent_level+1)).join(' ') + currentLine;
        }
        currentLine += (i+1 < codeLines.length ? '\n' : '');
        formattedCode += (i + 1)  + ". " + " " + currentLine;
    }
    return formattedCode.trim();
}

function getIndentationLevels(codeLines) {
    let indentLevels = [],
        lineStack = [],
        cIndentLevel = 0;
    for (let i = 0; i < codeLines.length; i++) {
        if (codeLines[i].indexOf('}') !== -1 && codeLines[i].indexOf('{') !== -1) {
            lineStack.push(codeLines[i]);
            indentLevels[i] = cIndentLevel;
            continue;
        }
        if (!CLOSING_BRACKET_REGEX.test(codeLines[i]) && codeLines[i].indexOf('}') !== -1) {
            while (lineStack.pop().indexOf('{') === -1) {}
            --cIndentLevel;
        } else {
            lineStack.push(codeLines[i]);
        }
        indentLevels[i] = cIndentLevel;
        if (!OPENING_BRACKET_REGEX.test(codeLines[i]) && codeLines[i].indexOf('{') !== -1) {
            cIndentLevel++;
        }
    }
    return indentLevels;
}

const setListingContent = (content) => {
    const contentBox = document.getElementById('content');
    if (filename !== 'script.js') {
        content = prettify(content);
    }
    contentBox.innerHTML = content;
}

const handleListing = (e) => {
    filename = e.currentTarget.innerText;
    fetch(url + '?action=listing&file=' + filename)
        .then(response => {
            console.log(response);
            if (response.ok) {
                return response.json();
            }
        })
        .then(data => {
            setListingContent(data);
        })
        .catch(err => {
            console.log(err);
        })
}

const createListEl = (innerText) => {
    let listEl = document.createElement('li');
    listEl.innerHTML = innerText;
    listEl.addEventListener('click', handleListing);

    return listEl;
}

const fillFilesList = (data) => {
    const files = Object.values(data);
    if (files.length > 0) {
        files.forEach(file => {
            listEl = createListEl(file);
            filesListEl.appendChild(listEl);
        });
    }
}

fetch(url + '?action=init')
    .then(response => {
        if (response.ok) {
            return response.json();
        };
    })
    .then(data => {
        fillFilesList(data);
    })
    .catch(err => {
        console.log(err);
    });


try {
    fetch(url + '?action=init_db')
        .then(response => {
            console.log(response);
            if (response.ok) {
                return response.json();
            }
        })
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            alert("Произошла ошыбка при соединении с Базой Данных, проверьте параметры подключения для корректной работы");
        });
} catch {
    alert("Error happened")
}