let url = document.URL + 'controller.php';
const filesListEl = document.getElementById('files-list');
let filename;
let canContinue = false;

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
	let id = 1;
	
	if(isNaN(id) || id < 1 || id > 1000000) {
		alert("Введите корректные данные - целое числовое значение в диапазое 1-1000'000 ");
		return;
	}
		
}
init();
initDB();
