import { SetStateAction, useState } from "react"
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import JournalService from '../utils/journalService';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

type Entry = {
    title: string,
    author: string,
    entryID: string,
    journalID: string,
    date: Date,
    datetimeStr: string,
    description: string
}

export default function NewJournalEntry({journalID, journalEntries, setJournalEntries, closePopup}: 
    {journalID:string, journalEntries: Entry[], setJournalEntries: Function, closePopup: Function}) {
    const [title, setTitle] = useState("")
    const [editorState, setEditorState] = useState(EditorState.createEmpty())


    function onEditorStateChange(editorState: SetStateAction<EditorState>) {
        setEditorState(editorState)
    }

    function addEntry() {
        let descriptionHTML = draftToHtml(convertToRaw(editorState.getCurrentContent()))
        JournalService.addEntry(journalID, title, descriptionHTML).then(res => {
          let datetime = new Date(res.data['date'])
          let temp: Entry = {
            title: title,
            author: res.data['author'],
            journalID: res.data['journalID'],
            entryID: res.data['entryID'],
            datetimeStr: datetime.toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'}),
            date: res.data['date'],
            description: res.data['description']
          }
          setJournalEntries([...journalEntries, temp])
          closePopup()
        })
    }

    return (
        <div className="popup">
            <div className="popup-inner-editor">
                <h3 className="popup-text">Add New Entry</h3>
                <label htmlFor='title'>Title</label>
                <br />
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
                <br />
                <label htmlFor="description">Description</label>
                <Editor
                    editorState={editorState}
                    wrapperClassName="text-wrapper"
                    editorClassName="text-editor"
                    onEditorStateChange={onEditorStateChange}
                    wrapperStyle={{
                        border: "1px solid #000000",
                        padding: 10,
                        borderRadius: 5,
                        backgroundColor: "#f5f5f5",
                        maxWidth: "685px",
                        overflow: "scroll",
                        height: "300px"
                    }}
                    toolbarStyle={{
                        border: "1px solid #000000",
                    }}
                />
                
                <div className="popup-text">
                    <button type="button" className="btn btn-primary btn-block" onClick={addEntry}>Submit</button>
                </div>
                <button className="popup-button" onClick={() => closePopup()}>Close</button>
            </div>
        </div>
    )
}