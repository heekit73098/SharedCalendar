import { useEffect, useState } from 'react';
import { EditorState, convertFromHTML, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { useNavigate } from 'react-router-dom';
import JournalService from '../utils/journalService';
import "../assets/Journal.css"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import NewJournalEntry from './NewJournalEntry';

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
  description: string,
  editable: boolean
}

export default function JournalEntries({journalID, entries}: {journalID: string, entries: []}) {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false)
  const [journalEntries, setJournalEntries] = useState<Entry[]>([])

  useEffect(() => {
    let temp: Entry[] = []
    if (entries) {
      entries.forEach(entry => {
        let tempEntry: Entry = entry
        let datetime = new Date(entry['date'])
        tempEntry['datetimeStr'] = datetime.toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})
        tempEntry['editable'] = false
        temp.push(tempEntry)
      });
    }
    setJournalEntries(temp)
  }, [])

  function deleteEvent(entryID: string) {
    JournalService.deleteEntry(entryID).then(() => 
      setJournalEntries(journalEntries.filter(entry => entry.entryID != entryID))
    )
  }

  function deleteJournal(journalID: string) {
    JournalService.deleteJournal(journalID).then(() => {
      navigate(0)
    })
  }


  return (
    <div>
      <Row>
        <Col sm={6}>
          <h3 className='journal-text'>Journal Entries</h3>
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
                  <h5>Title: {entry['title']}</h5>
                  <h6>By: {entry['author']}</h6>
                  <h6>{entry['datetimeStr']}</h6>
                  <button className='delete-button' onClick={() => deleteEvent(entry['entryID'])}>Delete</button>
                  <br />
                  
                  <Editor toolbarHidden editorState={storedState} readOnly={true} wrapperStyle={{
                    backgroundColor: "#ffffff",
                    paddingLeft: "2%"
                  }} />
                </div>
                <br />
              </div>
            )
          })}
        </Col>
        <Col sm={1}></Col>
        <Col sm={3}>
          <h3 className='journal-text'>Panel</h3>
          <div className="editor-panel">
            <button type="button" className="btn btn-primary btn-block" onClick={() => setShowPopup(true)}>Add New Entry</button>
          </div>
          <div className="editor-panel">
            <button type="button" className="btn btn-primary btn-block" onClick={() => deleteJournal(journalID)}>Delete Journal</button>
          </div>
        </Col>
      </Row>
      {
        showPopup ? 
        <NewJournalEntry journalID={journalID} journalEntries={journalEntries} setJournalEntries={setJournalEntries} closePopup={() => setShowPopup(false)} /> : null
    }
    </div>    
  )
}