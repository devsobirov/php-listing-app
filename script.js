let url = document.URL + 'controller.php';
const filesListEl = document.getElementById('files-list');
const inputEl = document.getElementById('input');
const resultEl = document.getElementById('result');
const submitBtn = document.getElementById('submit');
const listingHeadEl = document.getElementById('listing');

let filename;
let canContinue = false;

const setListingHead = (filename) => {
    let spanEl = document.createElement('span');
    spanEl.classList.add('highlight');
    spanEl.innerText = filename;
    listingHeadEl.innerText = "Выбранный файл для листинга - ";
    listingHeadEl.appendChild(spanEl);
}

const setListingContent = (content) => {
    const contentBox = document.getElementById('content');
    if (filename !== 'prettier.js') {
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
            setListingHead(filename);
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

const setResultInput = (value = "") => {
    resultEl.value = value;
}

const init = () => {
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

}

const initDB = () => {
    try {
        fetch(url + '?action=prepare_for_create_rows')
            .then(response => {
                canContinue = true;
                if (response.ok) {
                    return response.json();
                }
            })
            .catch(err => {
                canContinue = confirm(
                    "Произошла ошибка соединения в Базу Данных или завершён очередной цыкл наполнения контентом из-за  'Maximum execution time of 30 seconds exceeded'. Продолжить? "
                );
                if (canContinue) {
                    initDB();
                }
            });
    } catch {
        alert("Error happened")
    }
}

const getRow = (e) => {
	let id = inputEl.value;
    function isInteger(n) {
        return n === +n && n === (n|0);
    }
	
	if(isNaN(id) || id < 1 || id > 1000000 || isInteger(id)) {
		alert("Введите корректные данные - целое числовое значение в диапазое 1-1000'000, не целые числа округляется");
		return;
	} 

    setResultInput();
    fetch(url + '?action=get_row&id=' + id)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(data => {
            if (data) {
                setResultInput(data.value);
            }else if (!data && !canContinue) {
                canContinue = confirm("Запрашеваемое значение для - " + id +" пока не сущесвтует в Базе данных, продолжать добавление записей?");
                if (canContinue) {
                    initDB();
                    alert("Добавление оставшиейся записей успешно запушена!");
                }
            } else {
                alert("Запрашеваемое значение для - " + id +" пока не сущесвтует в Базе данных, возможно будет доступен через некоторое время");
            }
        })
        .catch(err => {
            console.log(err);
        })
		
}
init();
initDB();

submitBtn.addEventListener('click', getRow);
