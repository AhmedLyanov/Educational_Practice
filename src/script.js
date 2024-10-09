document.getElementById('addButton').addEventListener('click', async () => {
    const keyword = document.getElementById('keywordInput').value;
    const url = document.getElementById('urlInput').value;

    if (!keyword || !url) {
        alert('Поля не могут быть пустыми');
        return;
    }

    const response = await fetch('http://localhost:3000/api/keywords', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword, urls: [url] }),
    });

    if (response.ok) {
        alert('Ключевое слово и URL добавлены успешно!');
        document.getElementById('keywordInput').value = '';
        document.getElementById('urlInput').value = '';
    } else {
        alert('Ошибка системы добавления ключевого слова и URL');
    }
});

document.getElementById('searchButton').addEventListener('click', async () => {
    const keyword = document.getElementById('searchInput').value;
    const response = await fetch(`http://localhost:3000/api/keywords/${keyword}`);

    if (response.ok) {
        const urls = await response.json();
        const urlList = document.getElementById('urlList');
        urlList.innerHTML = ''; 

        urls.forEach(url => {
            const li = document.createElement('li');
            li.textContent = url;

           
            const downloadButton = document.createElement('button');
            downloadButton.textContent = 'Скачать';
            downloadButton.onclick = async () => {
                try {
                    const downloadResponse = await fetch(`http://localhost:3000/api/download?url=${encodeURIComponent(url)}`);
                    
                    if (!downloadResponse.ok) {
                        throw new Error('Не удалось установить,неизвестный URL ');
                    }
                    
                    const blob = await downloadResponse.blob();
                    const content = await blob.text(); //////////////////////////////////////////// Получаем содержимое контента
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = 'content.html'; //////////////////////////////////////////////// Имя файла для сохранения
                    link.click();

                    ////////////////////////////////////// Сохранение контента в LocalStorage
                    localStorage.setItem(url, content);
                    alert('Контент успешно сохранен в LocalStorage!');
                } catch (error) {
                    alert(`Ошибка: ${error.message}`);
                }
            };

            li.appendChild(downloadButton);
            urlList.appendChild(li);
        });
    } else {
        alert('Ключевое слово не обнаружено');
    }
});

///////////////////////////////////// Функция для отображения сохраненного контента
document.getElementById('filterInput').addEventListener('input', displaySavedContent);

function displaySavedContent() {
    const savedContentList = document.getElementById('savedContentList');
    const filter = document.getElementById('filterInput').value.toLowerCase();
    savedContentList.innerHTML = ''; ///////////////////////////////////////// Очистка списка перед добавлением новых элементов

    for (let i = 0; i < localStorage.length; i++) {
        const url = localStorage.key(i);
        if (url.toLowerCase().includes(filter)) { ///////////////////////////////////////////////// Фильтрация по URL
            const li = document.createElement('li');
            li.textContent = url;

            const viewButton = document.createElement('button');
            viewButton.textContent = 'Просмотреть';
            viewButton.onclick = () => {
                const content = localStorage.getItem(url);
                alert(content); 
            };

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Удалить';
            deleteButton.onclick = () => {
                localStorage.removeItem(url);
                displaySavedContent(); /////////////////////////////////////////////// Обновляем список после удаления
            };

            li.appendChild(viewButton);
            li.appendChild(deleteButton); ///////////////////////////////////////////////////////// Добавляем кнопку удаления
            savedContentList.appendChild(li);
        }
    }
}

/////////////////////////////////////////////////////////////////// Вызов функции для отображения сохраненного контента при загрузке страницы
displaySavedContent();