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
