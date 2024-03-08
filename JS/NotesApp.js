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
                    <span class="header-title">Jota</span>
                    <div class="menu expandable">
                      <button class="button menu-expander">•••</button>
                      <div class="menu-content expandable hidden">
                        <a href="">Credits</a>
                        <a href="">Report a Problem</a>
                      </div>
                    </div>
                </header>
          
                <div class="notes-list"></div>
                
                <div class="modal credits hidden">
                  <div class="close-btn-container">
                    <button></button>
                  </div>
                  <div class="dev-profile">
                    <div class="dev-profile identity">
                      <img src="./img/mends.jpg" alt="dp">
                      <span>Prince J. Mendie</span>
                    </div>
                    <div class="dev-profile bio">
                      <span>I design and build sites and apps for the web. <br>
                      <a href="#" style="color:var(--orange);">Visit my Portfolio</a> <br>
                      OR
                      </span>
                    </div>
                    <div class="dev-profile social-links">
                      <a href="" class="twitter">
                        <img src="./icon/x-social-media-white-icon.png" alt="x(tw)">
                      </a>
                      <a href="" class="linkedin">
                        <img src="./icon/linkedin-512.png" alt="li">
                      </a>
                      <a href="" class="facebook">
                        <img src="./icon/facebook-512.png" alt="fb">
                      </a>
                      <a href="" class="gmail">
                        <img src="./icon/gmail-white-icon-512.png" alt="gm">
                      </a>
                    </div>
                  </div>
                </div>
                
                <div class="modal support hidden">
                  <div class="close-btn-container">
                    <button></button>
                  </div>
                  <div class="modal support-message">
                    <span>Experiencing any Issue?</span>
                    <span>I got you covered! ✌🏽</span>
                  </div>
                  <form class="modal support-message-field" method="POST" action="">
                    <div class="support-message-field email">
                      <input type="email" placeholder="Enter Email Address">
                    </div>
                    <div class="support-message-field text">
                      <input type="text" id="supportTextField" value="" hidden>
                      <div class="support-text-field" contenteditable>
                        Please tell me what you think should be fixed or improved.
                      </div>
                    </div>
                    <div class="support-message-field submit">
                      <button type="submit">
                        Submit
                        <img src="./icon/top-right-arrow.png">
                      </button>
                    </div>
                  </form>
                </div>
                
                <div class="w100p p05 fixedl0-b0--ztop flex flex-center--center bottom-nav">
                    <div class="note-search">
                      <button class="note-search-btn">
                        <img src="./icon/search-13-512.png">
                        <input type="search" placeholder="Search for a saved note..." hidden>
                      </button>
                      <div class="note-search-results"></div>
                    </div>
                    <button class="add-new-note">+</button>
                    <span class="note-count">3 Notes</span>
                </div>
            </section>
            
            <section class="notes-editor">
                <div class="actions w100p flex flex-center--between">
                    <button class="close-note-editor py05 mr05 w-min10p disabled">&langle;</button>
                    <button class="save-note-changes py05 mr05 w-min30p disabled">Done</button>
                    <button class="save-note-as-new py05 px1 orange-bg w-min30p">Save as new</button>
                </div>
                
                <div class="note-title" contenteditable>Title</div>
                <div class="note-body" contenteditable>Body goes here...</div>
            </section>
        `;
        
        return root;
    },
    
    _initBasicFunctions(){
        const addNewNote = this.root.querySelector(".add-new-note");
        const closeEditor = this.root.querySelector(".close-note-editor");
        const saveChanges = this.root.querySelector(".save-note-changes");
        const saveAsNew = this.root.querySelector(".save-note-as-new");
        
        // Function to filter notes based on input value of search bar
        function filterNotes(searchTerm) {
          return notes.filter(note =>
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.body.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        // Function to display filtered notes in the notes list container
        function displayFilteredNotes(filteredNotes){
          const notesListContainer = document.querySelector('.notes-list');
          notesListContainer.innerHTML = ``; // Clear previous notes
        
          filteredNotes.forEach((note, index) => {
            const saved = notesListContainer.querySelectorAll(".note-saved");
            const noteDiv = document.createElement("div");
            noteDiv.classList.add("note-result");
            let maxTitleLength = 45;
            let maxBodyLength = 39;
            noteDiv.innerHTML = `
              <span class="note-result-title">
                ${note.title.substring(0, maxTitleLength) }
                ${note.title.length > maxTitleLength ? "..." : "" }
              </span>
              <span class="note-result-body">
                ${note.body.substring(0, maxBodyLength)} 
                ${note.body.length > maxBodyLength ? "..." : ""}
              </span>
            `;
            notesListContainer.appendChild(noteDiv);
            noteDiv.addEventListener("click", (e) => {
              NotesView.onNoteSelect(note.id);
              closeEditor.classList.add("disabled");
              saveChanges.classList.remove("disabled");
              NotesView.toggleViews();
            });
          });
        }
        
        // Event listener for search input
        document.querySelector(".note-search-btn > input").addEventListener('input', function(e) {
          const searchTerm = this.value;
          const filteredNotes = filterNotes(searchTerm);
          if(filteredNotes.length === 0){
            document.querySelector(".notes-list").innerHTML = `
              <div class="no-search-results">
                <span>No Results for</span>&nbsp;<span class="highlight">“${document.querySelector(".note-search-btn > input").value}”</span>
              </div>
            `;
            document.querySelector(".note-search-btn > img").addEventListener("click", () => {
              NotesView._refreshNotes();
            });
          }else{
            displayFilteredNotes(filteredNotes);
          }
        });
        
        // Search icon function
        document.querySelector(".note-search-btn > img").addEventListener("click", function(){
          const searchBar = document.querySelector(".note-search-btn > input");
          if(document.querySelector(".note-result")){
            document.querySelector(".note-search-btn > img").setAttribute("src", "./icon/search-13-512.png");
            NotesView._refreshNotes();
          }else{
            searchBar.removeAttribute("hidden");
            searchBar.classList.add("active");
            document.querySelector(".bottom-nav").style.cssText = `
              bottom:-100%;
            `;
          }
        });
        
        // Search bar blur function
        document.querySelector(".note-search-btn > input").addEventListener("blur", (e) => {
          const searchBar = document.querySelector(".note-search-btn > input");
          searchBar.classList.remove("active");
          document.querySelector(".bottom-nav").style.cssText = `
            bottom:0;
          `;
          if(document.querySelector(".note-result")){
            document.querySelector(".note-search-btn > img").setAttribute("src", "./icon/multiply-3-512.png");
          }else if(document.querySelector(".no-search-results")){
            document.querySelector(".note-search-btn > img").setAttribute("src", "./icon/multiply-3-512.png");
          }else{
            document.querySelector(".note-search-btn > img").setAttribute("src", "./icon/search-13-512.png");
          }
        });
        
        // Notes view click function
        
        // Add new note button function
        addNewNote.addEventListener("click", () => {
            this.toggleViews();
            //this._refreshNotes();
            document.querySelector(".note-title").textContent = "";
            document.querySelector(".note-body").textContent = "";
            closeEditor.classList.remove("disabled");
            saveChanges.classList.add("disabled");
        });
        
        // Note count function
        const noteCount = document.querySelector(".note-count");
        if(notes.length < 1){
          noteCount.textContent = `${notes.length + " " + "Notes"}`;
        }else if(notes.length > 1){
          noteCount.textContent = `${notes.length + " " + "Notes"}`;
        }else if(notes.length = 1){
          noteCount.textContent = `${notes.length + " " + "Note"}`;
        }
        
        closeEditor.addEventListener("click", () => {
            this.toggleViews();
        });
        
        // Update Note content function
        saveChanges.addEventListener("click", () => {
            const noteTitle = this.root.querySelector(".note-title").textContent.trim();
            const noteBody = this.root.querySelector(".note-body").textContent.trim();
            const newTitle = noteTitle;
            const newBody = noteBody;
            this.onNoteEdit(newTitle, newBody);
            this.toggleViews();
            this._refreshNotes();
            location.reload();
        });
        
        // Save note content as new
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
        
        // Menu
        const btnMenuExpander = document.querySelector(".button.menu-expander");
        const menuContentExpandable = document.querySelector(".menu-content.expandable");
        btnMenuExpander.addEventListener("click",() => {
          if(menuContentExpandable.classList.contains("hidden")){
            menuContentExpandable.classList.remove("hidden")
          }else{
            menuContentExpandable.classList.add("hidden")
          }
        });
        
        // Menu links click to show modal
        const menuContentExpandable_links = document.querySelectorAll(".menu-content.expandable > a");
        const modalCredits = document.querySelector(".modal.credits");
        const modalCredits_closeBtn = modalCredits.querySelector(".modal.credits > .close-btn-container > button");
        const modalSupport = document.querySelector(".modal.support");
        const modalSupport_closeBtn = modalSupport.querySelector(".modal.support > .close-btn-container > button");
        menuContentExpandable_links.forEach(link => {
          link.addEventListener("click", (e) => {
            e.preventDefault();
            if(link.textContent.match("Credits")){
              modalCredits.classList.remove("hidden");
              modalSupport.classList.add("hidden")
              document.querySelector(".bottom-nav").style.cssText = `
                display:none;
              `;
            }else{
              modalSupport.classList.remove("hidden");
              modalCredits.classList.add("hidden")
              document.querySelector(".bottom-nav").style.cssText = `
                display:none;
              `;
            }
          });
        });
        modalCredits_closeBtn.addEventListener("click", () => {
          modalCredits.classList.add("hidden");
          document.querySelector(".bottom-nav").style.cssText = `
            display:flex;
          `;
        });
        modalSupport_closeBtn.addEventListener("click", () => {
          modalSupport.classList.add("hidden");
          document.querySelector(".bottom-nav").style.cssText = `
            display:flex;
          `;
        });
        
        // Credits modal: click on profile img to expand and other functions
        const devProfileImgId = document.querySelector(".dev-profile.identity > img");
        devProfileImgId.addEventListener("click", () => {
          if(devProfileImgId.classList.contains("active")){
            devProfileImgId.classList.remove("active");
            document.querySelector("header").style.cssText = `
              filter:none;
            `;
            document.querySelector(".notes-list").style.cssText = `
              filter:none;
            `;
            modalCredits_closeBtn.style.cssText = `
              display:block;
            `;
          }else{
            devProfileImgId.classList.add("active");
            document.querySelector("header").style.cssText = `
              filter:blur(15px);
            `;
            document.querySelector(".notes-list").style.cssText = `
              filter:blur(15px);
            `;
            modalCredits_closeBtn.style.cssText = `
              display:none;
            `;
          }
        });
        
        // Report problem modal
        const supportMsgField_Email = document.querySelector(".support-message-field.email > input");
        supportMsgField_Email.addEventListener("focus", () => {
          modalSupport.style.cssText = `
            top:6rem;
            overflow-y:auto;
          `;
          
        });
        supportMsgField_Email.addEventListener("blur", () => {
          modalSupport.style.cssText = `
            top:auto;
            overflow-y:auto;
          `;
        });
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
      if(!updatedTitle || !updatedBody){
        alert("Please add a title and body!");
      }else{
        console.log(`${updatedTitle + " " + updatedBody}`);
        NotesApi.saveNote({
            id: this.activeNote.id,
            title: updatedTitle,
            body: updatedBody
        });
      }
        this._refreshNotes();
    },
    
    onNoteSave(title, body){
      const noteTitle = this.root.querySelector(".note-title");
      const noteBody = this.root.querySelector(".note-body");
      
      if(!title || !body){
        alert("Please add a title and body!")
      }else{
        const newNote = {title, body}
        NotesApi.saveNote(newNote);
        this._refreshNotes();
        location.reload();
      }
    },
    
    onNoteDelete(noteId){
        NotesApi.deleteNote(noteId);
        this._refreshNotes();
        location.reload();
    },
    
    _createNoteElem(id, title, body, updated){
        let maxTitleLength = 45;
        let maxBodyLength = 39;
        return `
            <div class="note-saved w100p p05" data-note-id="${id}">
            <div class="note-saved-content flex flex-base--left flex-column">
                <span class="title">
                    ${title.substring(0, maxTitleLength)}
                    ${title.length > maxTitleLength ? "..." : ""}
                </span>
                <span class="full-title" hidden>${title}</span>
                <span class="body">
                    ${body.substring(0, maxBodyLength)} 
                    ${body.length > maxBodyLength ? "..." : ""}
                </span>
                <span class="full-body" hidden>${body}</span>
                <span class="timestamp">
                    ${updated.toLocaleString(undefined, {dateStyle: "full", timeStyle: "short"})}
                </span>
            </div>
            
            <div class="note-saved-actions flex flex-center--between">
                <button class="copy-note w50p py03">Copy</button>
                <button class="delete-note w50p py03">Delete</button>
            </div>
            </div>
        `;
    },
    
    updateNotesList(notes){
        const notesListContainer = this.root.querySelector(".notes-list");
        const mediaQuery = window.matchMedia("(min-width:769px)");
        if(mediaQuery.matches){
          notesListContainer.innerHTML = `
            <div class="prompt">
              <img src="./img/DrawKit Vector Illustration Team Work (17).png" alt="prompt_img">
              <span>
                Start typing to add a new phrase, memo
                or article.
              </span>
            </div>
          `;
        }else{
          notesListContainer.innerHTML = `
            <div class="prompt">
              <img src="./img/DrawKit Vector Illustration Team Work (17).png" alt="prompt_img">
              <span>
                Click on the "+" button below to add a new phrase, memo
                or article.
              </span>
            </div>
          `;
        }
        if(notes.length > 0){
          document.querySelector(".prompt").style.display = "none"
        }
        for(const note of notes){
            const noteHTML = this._createNoteElem(note.id, note.title, note.body, new Date(note.updated));
            notesListContainer.insertAdjacentHTML("beforeend", noteHTML);
        }
        
        const saved = notesListContainer.querySelectorAll(".note-saved");
        const searchBar = document.querySelector(".note-search-btn > input");
        saved.forEach((savedNote, index) => {
            savedNote.addEventListener("click", (e) => {
              if(savedNote.classList.contains("active") || searchBar.classList.contains("active")){
                savedNote.classList.remove("active");
                searchBar.classList.remove("active");
                document.querySelector(".bottom-nav").style.cssText = `
                  bottom:0;
                `;
              }else{
                this.onNoteSelect(savedNote.dataset.noteId);
                closeEditor.classList.add("disabled");
                saveChanges.classList.remove("disabled");
                this.toggleViews();
              }
            });
            
            let longPress;
            
            savedNote.addEventListener("touchstart", (e) => {
              longPress = setTimeout(function(){
                if(savedNote.classList.contains("active")){
                  savedNote.classList.remove("active");
                }else{
                  savedNote.classList.add("active");
                }
              }, 800);
            });
            savedNote.addEventListener("touchend", (e) => {
              clearTimeout(longPress);
            });
            
            const copyNoteBtn = savedNote.querySelector(".copy-note");
            const closeEditor = this.root.querySelector(".close-note-editor");
            const saveChanges = this.root.querySelector(".save-note-changes");
            copyNoteBtn.addEventListener("click", (e) => {
              const savedTitle = savedNote.querySelector(".note-saved-content > .full-title");
              const savedBody = savedNote.querySelector(".note-saved-content > .full-body");
              
              const copiedTooltip = document.createElement("div");
              copiedTooltip.classList.add("copied-text-tooltip");
              copiedTooltip.textContent = "Copied Successfully!"
              
              navigator.clipboard.writeText(savedTitle.textContent.trim() + " " + savedBody.textContent.trim());
              savedNote.appendChild(copiedTooltip);
              setTimeout(() => {
                savedNote.removeChild(copiedTooltip);
              }, 1000);
            });
            
            const deleteNoteBtn = savedNote.querySelector(".delete-note");
            deleteNoteBtn.addEventListener("click", () => {
                this.onNoteDelete(savedNote.dataset.noteId);
            });
        });
        
        notesListContainer.addEventListener("click", () => {
          if(searchBar.classList.contains("active")){
            searchBar.classList.remove("active");
          }
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