import NotesApi from "./NotesApi.js";

const notes = NotesApi.getAllNotes();

const NotesView = {
    root: document.querySelector("#app"),
    activeNote: null,
    
    _renderRootHTML(){
        const root = this.root;
        root.innerHTML = `
            <section class="notes-view">
                <header class="w100p p05">
                    <span class="header-title">_webnotes</span>
                </header>
          
                <div class="notes-list"></div>
          
                <div class="w100p p05 fixedl0-b0--ztop flex flex-center--center dark-bg">
                    <button class="add-new-note">+</button>
                </div>
            </section>
            
            <section class="notes-editor">
                <div class="actions w100p py05 flex flex-center--between">
                    <button class="close-note-editor py05 px1 w-min50p disabled">Notes</button>
                    <button class="save-note-changes py05 px1 w-min50p disabled">Save changes</button>
                    <button class="save-note-as-new py05 px1 w-min50p">Save as new</button>
                </div>
          
                <div class="note-title" contenteditable></div>
                <div class="note-body" contenteditable></div>
            </section>
        `;
        
        return root;
    },
    
    _initBasicFunctions(){
        const addNewNote = this.root.querySelector(".add-new-note");
        const closeEditor = this.root.querySelector(".close-note-editor");
        const saveChanges = this.root.querySelector(".save-note-changes");
        const saveAsNew = this.root.querySelector(".save-note-as-new");
        
        addNewNote.addEventListener("click", () => {
            this.toggleViews();
            closeEditor.classList.remove("disabled");
            saveChanges.classList.add("disabled");
        });
        
        closeEditor.addEventListener("click", () => {
            this.toggleViews();
        });
        
        saveChanges.addEventListener("click", () => {
            const noteTitle = this.root.querySelector(".note-title").textContent.trim();
            const noteBody = this.root.querySelector(".note-body").textContent.trim();
            const newTitle = noteTitle;
            const newBody = noteBody;
            
            this.onNoteEdit(newTitle, newBody);
            this.toggleViews();
            this._refreshNotes();
            //location.reload();
        });
        
        saveAsNew.addEventListener("click", () => {
            const noteTitle = this.root.querySelector(".note-title").textContent.trim();
            const noteBody = this.root.querySelector(".note-body").textContent.trim();
            
            this.onNoteSave(noteTitle, noteBody);
            this.toggleViews();
            this._refreshNotes();
            //location.reload();
        });
        
        const noteTitle = this.root.querySelector(".note-title");
        const noteBody = this.root.querySelector(".note-body");
        
        if(noteTitle.textContent !== null){
            noteTitle.addEventListener("keydown", (e) => {
                if(e.key === "Enter"){
                    e.preventDefault();
                    noteBody.focus();
                }
            });
        }
    },
    
    toggleViews(){
        if(this.root.classList.contains("toggle-view")){
            this.root.classList.remove("toggle-view");
        }else{
            this.root.classList.add("toggle-view");
        }
    },
    
    _refreshNotes(){
        this._NotesAppRunBuild();
        
        if(notes.length > 0){
            this._setActiveNote(notes[0]);
        }
    },
    
    _setActiveNote(note){
        this.activeNote = note;
        this.updateNoteContent(note);
    },
    
    onNoteSelect(id){
        console.log("Note selected:" + id);
        const selected = notes.find(note => note.id == id);
        this._setActiveNote(selected);
    },
    
    onNoteEdit(updatedTitle, updatedBody){
        console.log(`${updatedTitle + " " + updatedBody}`);
        NotesApi.saveNote({
            id: this.activeNote.id,
            title: updatedTitle,
            body: updatedBody
        });
        this._refreshNotes();
    },
    
    onNoteSave(title, body){
        const newNote = {title, body}
        NotesApi.saveNote(newNote);
        this._refreshNotes();
        location.reload();
    },
    
    onNoteDelete(noteId){
        NotesApi.deleteNote(noteId);
        this._refreshNotes();
    },
    
    _createNoteElem(id, title, body, updated){
        const maxTitleLength = 45;
        const maxBodyLength = 50;
        return `
            <div class="note-saved w100p p05" data-note-id="${id}">
            <div class="note-saved-content flex flex-base--left flex-column">
                <span class="title">
                    ${title.substring(0, maxTitleLength)}
                    ${title.length > maxTitleLength ? "..." : ""}
                </span>
                <span class="body">
                    ${body.substring(0, maxBodyLength)} 
                    ${body.length > maxBodyLength ? "..." : ""}
                </span>
                <span class="timestamp">
                    ${updated.toLocaleString(undefined, {dateStyle: "full", timeStyle: "short"})}
                </span>
            </div>
            
            <div class="note-saved-actions flex flex-center--between">
                <button class="edit-note w50p py03">Edit</button>
                <button class="delete-note w50p py03">Delete</button>
            </div>
            </div>
        `;
    },
    
    updateNotesList(notes){
        const notesListContainer = this.root.querySelector(".notes-list");
        notesListContainer.innerHTML = "";
        for(const note of notes){
            const noteHTML = this._createNoteElem(note.id, note.title, note.body, new Date(note.updated));
            notesListContainer.insertAdjacentHTML("beforeend", noteHTML);
        }
        
        const saved = notesListContainer.querySelectorAll(".note-saved");
        saved.forEach((savedNote, index) => {
            savedNote.addEventListener("click", (e) => {
                if(savedNote.classList.contains("active")){
                    savedNote.classList.remove("active");
                }else{
                    savedNote.classList.add("active");
                }
            });
            
            const editNoteBtn = savedNote.querySelector(".edit-note");
            const closeEditor = this.root.querySelector(".close-note-editor");
            const saveChanges = this.root.querySelector(".save-note-changes");
            editNoteBtn.addEventListener("click", () => {
                this.onNoteSelect(savedNote.dataset.noteId);
                closeEditor.classList.add("disabled");
                saveChanges.classList.remove("disabled");
                this.toggleViews();
            });
            
            const deleteNoteBtn = savedNote.querySelector(".delete-note");
            deleteNoteBtn.addEventListener("click", () => {
                this.onNoteDelete(savedNote.dataset.noteId);
            });
        });
    },
    
    updateNoteContent(note){
        this.root.querySelector(".note-title").textContent = note.title;
        this.root.querySelector(".note-body").textContent = note.body;
        
        this.root.querySelector(`.note-saved[data-note-id='${note.id}']`);
    },
    
    _NotesAppRunBuild(){
        NotesView._renderRootHTML();
        NotesView._initBasicFunctions();
        NotesView.updateNotesList(NotesApi.getAllNotes());
    }
}

document.addEventListener("DOMContentLoaded", () => {
    NotesView._NotesAppRunBuild();
});