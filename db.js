let idCounter = 0;

const tags = [
    { id: 1, title: 'Все' },
    { id: 2, title: 'Идея' },
    { id: 3, title: 'Личное' },
    { id: 4, title: 'Работа' }
];

const notes = [
    {
        id: 1,
        title: 'Сдать отчет',
        tag: 4,
        updateAt: new Date().toDateString()
    },
    {
        id: 2,
        title: 'Note 2',
        tag: 3,
        updateAt: new Date().toDateString()
    },
    {
        id: 3,
        title: 'Note 3',
        tag: 3,
        updateAt: new Date().toDateString()
    }
];

function initMaxId() {
    for (let note of notes) {
        if (note.id > idCounter) {
            idCounter = note.id;
        }
    }
    idCounter++;
}
initMaxId();

export function getAllNotes() {
    return notes;
}

export function createNote(dto) {
    const newNote = {
        id: idCounter++,
        title: dto.title,
        tag: dto.tag,
        updateAt: new Date().toDateString()
    };
    notes.push(newNote);
    return newNote;
}

export function deleteNote(id) {
    const idx = notes.findIndex(i => i.id === id);
    if (idx === -1) {
        return null;
    }
    notes.splice(idx, 1);
    return true;
}

export function updateNote(note) {
    const editedNote = notes.find((i) => i.id === note.id);
    if (editedNote === undefined) {
        return false;
    }
    editedNote.title = note.title;
    editedNote.tag = note.tag;
    editedNote.updateAt = new Date().toDateString();
    return editedNote;
}