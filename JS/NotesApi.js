export default class NotesApi {
    static getAllNotes(){
        const notes = JSON.parse(localStorage.getItem("notes")) || [];
        return notes.sort((a, b) => {
            return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
        });
    }
    
    static saveNote(noteToSave){
        const notes = NotesApi.getAllNotes();
        const existing = notes.find(note => note.id == noteToSave.id);
        
        if(existing){
            existing.title = noteToSave.title;
            existing.body = noteToSave.body;
            existing.updated = new Date().toISOString();
        }else{
            noteToSave.id = Math.floor(Math.random() * 1000000);
            noteToSave.updated = new Date().toISOString();
            notes.push(noteToSave);
        }
        
        localStorage.setItem("notes", JSON.stringify(notes));
    }
    
    static editNote(){
        
    }
    
    static deleteNote(id){
        const notes = NotesApi.getAllNotes();
        const newNotes = notes.filter(note => note.id != id);
        
        localStorage.setItem("notes", JSON.stringify(newNotes));
    }
}