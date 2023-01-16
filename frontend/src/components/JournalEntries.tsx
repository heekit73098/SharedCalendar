import { SetStateAction, useEffect, useState } from 'react';
import { EditorState, convertToRaw, convertFromHTML, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import JournalService from '../utils/journalService';

const EditorToolbar = {
  options: ["inline", "blockType", "fontSize", "list", "textAlign", "colorPicker", "link", "remove", "history"],
  fontSize: {
      className: "lato",
  },
  blockType: {
      className: "lato"
  },
  colorPicker: {
      popupClassName: "lato"
  }
}

type Entry = {
  title: string,
  author: string,
  entryID: string,
  journalID: string,
  date: Date,
  datetimeStr: string,
  description: string
}

export default function JournalEntries({journalID, entries}: {journalID: string, entries: []}) {
  const [title, setTitle] = useState("")
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [journalEntries, setJournalEntries] = useState<Entry[]>([])

  useEffect(() => {
    let temp: Entry[] = []
    entries.forEach(entry => {
      let tempEntry: Entry = entry
      let datetime = new Date(entry['date'])
      tempEntry['datetimeStr'] = datetime.toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})
      temp.push(tempEntry)
    });
    setJournalEntries(temp)
  }, [])

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
    })
    

  }
  return (
    <div>
      <div>
        {journalEntries.map(entry => {
          const blocksFromHTML =  convertFromHTML(entry['description']);
          const state = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
          )
          const storedState = EditorState.createWithContent(state)
          return (
            <div  key={entry['entryID']}>
              <div className="card">
                <h4>{entry['title']}</h4>
                <h6>By: {entry['author']}</h6>
                <h6>{entry['datetimeStr']}</h6>
                <Editor toolbarHidden editorState={storedState} readOnly={true} />
              </div>
              <br />
            </div>
          )
        })}
      </div>
      <div>
        <label htmlFor='title'>Title</label>
        <br />
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <Editor
          editorState={editorState}
          wrapperClassName="text-wrapper"
          editorClassName="text-editor"
          onEditorStateChange={onEditorStateChange}
          toolbar={EditorToolbar}
          wrapperStyle={{
            border: "1px solid #ffffff",
            padding: 10,
            borderRadius: 10
          }}
          toolbarStyle={{
            border: 0,
            borderBottom: "1px solid #ffffff"
          }}
        />
      </div>
      <div>
        <button type="button" onClick={addEntry}>Submit</button>
      </div>
    </div>    
  )
}