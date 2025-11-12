const list = document.getElementById('list')
const search = document.getElementById('search')
const btnSearch = document.getElementById('search-btn')
const btnNote = document.getElementById('btn-note')
const btnNoteClose = document.getElementById('modal_close')
const menu = document.getElementById('menu')
const overlay = document.getElementById("overlay")
const modalTitle = document.getElementById("modal__input")
const modalSelect = document.getElementById("modal__select")
const modalSaveBtn = document.getElementById("modal-save")
const modalForm = document.getElementById('modal-form')

let btnDel = null
let activeTag = 1
let editingItem = null
let maxId = null

const API_BASE = 'http://127.0.0.1:3000';
const tags = [
    { id: 1, title: 'Все' },
    { id: 2, title: 'Идея' },
    { id: 3, title: 'Личное' },
    { id: 4, title: 'Работа' }
]

let notes = [];

async function loadNotes() {
    try {
        const response = await fetch(`${API_BASE}/notes`);
        if (!response.ok) throw new Error('Ошибка загрузки заметок');
        notes = await response.json();
        render();
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        notes = [];
        render();
    }
}

search.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
        event.preventDefault();
        btnSearch.click();
    }
});
function createTag(tag) {
    const element = document.createElement('li')
    element.classList.add('list-item')
    element.innerText = tag.title
    return element
}

function createNote(note) {
    const element = document.createElement('div')
    element.classList.add("list_otch")

    const title = document.createElement('span')
    title.innerText = note.title
    title.classList.add("list_otch-title")

    const date = document.createElement('span')
    date.classList.add("list_otch-date")
    date.innerText = note.updateAt || new Date().toDateString()

    const tag = document.createElement('span')
    tag.classList.add("list_otch-tag")
    tag.innerText = tags.find((i) => i.id === note.tag)?.title || 'Неизвестно'
    
    element.appendChild(title)
    element.appendChild(date)
    element.appendChild(tag)

    element.addEventListener('click', () => {
        editingItem = note
        openModal()
    })
    return element
}

function getNotes(searchValue) {
    const filteredNotes = notes.filter((i) => {
        return i.title.toLowerCase().includes(searchValue.toLowerCase())
    })
    return filteredNotes
}

function renderMenu() {
    for (let tag of tags) {
        const element = createTag(tag)
        element.addEventListener("click", () => {
            activeTag = tag.id
            render()
        })
        menu.appendChild(element)
    }
}

function render() {
    list.innerHTML = ''
    let filtered = getNotes(search.value)

    if (activeTag !== 1) {
        filtered = filtered.filter(i => i.tag === activeTag)
    }

    if (filtered.length === 0) {
        list.innerText = 'Ничего не найдено('
        return
    }

    for (let i of filtered) {
        const element = createNote(i)
        list.appendChild(element)
    }
}

async function onDelete(id) {
    if (!confirm('Удалить заметку?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/notes`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        });

        if (!response.ok) throw new Error('Ошибка удаления');
        
        await loadNotes();
        closeModal()
    } catch (error) {
        console.error('Ошибка удаления:', error);
        alert('Не удалось удалить заметку');
    }
}

function openModal() {
    overlay.classList.add("overlay_open")
    modalTitle.value = editingItem?.title || ''
    modalSelect.innerHTML = ""
    for (let tag of tags) {
        if (tag.id !== 1) {
            const option = document.createElement('option')
            option.value = tag.id
            option.innerText = tag.title
            if (editingItem?.tag === tag.id) {
                option.selected = true
            }
            modalSelect.appendChild(option)
        }
    }


    if (editingItem?.id) {
        btnDel = document.createElement('button')
        btnDel.classList.add('modal__btn-save')
        btnDel.style.background = 'red'
        btnDel.innerText = 'Удалить'
        btnDel.addEventListener('click', (e) => {
            e.preventDefault()
            onDelete(editingItem.id)
        })
        modalForm.appendChild(btnDel)
    }
}

function closeModal() {
    overlay.classList.remove("overlay_open")
    modalSelect.innerHTML = ""
    editingItem = null
    if (btnDel !== null) {
        btnDel.remove()
        btnDel = null
    }
}

async function onSave() {
    if (!editingItem) {
        closeModal()
        return
    }

    const title = modalTitle.value.trim();
    const tag = +modalSelect.value;

    if (!title) {
        alert('Введите заголовок заметки');
        return;
    }

    try {
        if (!editingItem.id) {
            const response = await fetch(`${API_BASE}/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title,
                    tag: tag,
                    date: new Date().toDateString()
                })
            });

            if (!response.ok) throw new Error('Ошибка создания');
        } else {
            const response = await fetch(`${API_BASE}/notes`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: editingItem.id,
                    title: title,
                    tag: tag,
                    date: new Date().toDateString()
                })
            });

            if (!response.ok) throw new Error('Ошибка обновления');
        }

        await loadNotes();
        closeModal()
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        alert('Не удалось сохранить заметку');
    }
}

function init() {
    renderMenu()
    loadNotes()
    
    btnSearch.addEventListener('click', render)
    
    btnNote.addEventListener('click', () => {
        editingItem = { 
            id: null,
            title: '',
            tag: 2, 
            updateAt: new Date().toDateString()
        }
        openModal()
    })
    
    btnNoteClose.addEventListener('click', closeModal) 
    
    modalSaveBtn.addEventListener('click', (e) => {
        e.preventDefault()
        onSave()
    })
}

init()