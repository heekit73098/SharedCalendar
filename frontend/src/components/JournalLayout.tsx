import { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import JournalService from '../utils/journalService';
import JournalEntries from './JournalEntries';

function JournalLayout({groupID, journals, entries}: {groupID:string, journals: string[][], entries:{}}) {
  const [newJournalName, setJournalName] = useState("")
  const [journalNames, setJournalNames] = useState<string[][]>([])
  const [journalEntries, setJournalEntries] = useState<{ [id: string] : [] }>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setJournalNames(journals)
    JournalService.getEntries()
    setJournalEntries(entries)
    setLoaded(true)
  }, [])

  function addJournal() {
    JournalService.addJournal(newJournalName, groupID).then(res => {
      setJournalNames([...journalNames, [res.data['journalID'], newJournalName]])
    })
  }
  
  return (
    <Tab.Container id="left-tabs" defaultActiveKey="add">
      <Row>
        <Col sm={2}>
          <Nav variant="pills" className="flex-column">
            {
              loaded && journalNames.map(journal => {
                return(
                  <Nav.Item key={journal[0]}>
                    <Nav.Link eventKey={journal[0]}>{journal[1]}</Nav.Link>
                  </Nav.Item>
                )
              })
            }
            <Nav.Item>
              <Nav.Link eventKey="add">Add Journal</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={1}></Col>
        <Col sm={9}>
          <Tab.Content>
            {
              journalNames.map(journal => {
                return (
                  <Tab.Pane eventKey={journal[0]} key={journal[0]}>
                    <JournalEntries journalID={journal[0]} entries={journalEntries[journal[0]]} />
                  </Tab.Pane>
                )
              })
            }            
            <Tab.Pane eventKey="add">
              <div className="add-journal">
                <input placeholder="Enter Journal Name" onChange={(e) => {setJournalName(e.target.value)}}></input>
                <button type="button" onClick={addJournal} className="btn btn-primary btn-block">Submit</button>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
}

export default JournalLayout;