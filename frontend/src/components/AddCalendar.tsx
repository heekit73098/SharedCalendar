import { Formik, ErrorMessage, Field, Form } from "formik";
import { useEffect, useState } from "react";
import ProfileService from "../utils/profileService";
import ColorPicker from "./ColorPicker";
import { Tooltip } from 'react-tooltip';
import "../assets/AddCalendar.css"
import GroupPopup from "./GroupPopup";
import { Alert } from "react-bootstrap";

export default function AddCalendar() {
    const [calendars, setCalendars] = useState([])
    const [colorDict, setColorDict] = useState({})
    const [colors, setColors] = useState({})
    const [loaded, setLoaded] = useState(false)
    const [groupID, setGroupID] = useState("")
    const [showPopup, setShowPopup] = useState(false)
    const [type, setType] = useState("")
    const [users, setUsers] = useState([])
    const [groupName, setGroupName] = useState("")
    const [alert, setAlert] = useState(false)
    const [alertType, setAlertType] = useState("")
    const [message, setMessage] = useState("")

    const joinPopup = `Note:<ol>
    <li>You must use the unique group ID to join a group.</li>
    <li>Your Personal Group is not shareable to anyone!
    <li>Creating a new group will share all of your event details with your group members.</li>
    <li>Creating an anonymous group will only reveal your unavailable timings to the group members.</li>
    </ol>`
    const groupPopup = "Click below to view more information of the respective group!"
    const colourPopup = "Click below to customise your colour!"

    function addCalendar(formValue: {choice: string, field: string}) {
        ProfileService.addCalendar(formValue).then(res => {
            ProfileService.getCalendars().then(res => {
                setCalendars(res.data)
            }).catch(err => {
                setMessage(err.response.data["Error"])
                setAlert(true)
                setAlertType("danger")
            })
        }).catch(err => {
            setMessage(err.response.data["Error"])
            setAlert(true)
            setAlertType("danger")
        });
        
    }

    function handleChange(target: { calendarId: string; value: string; }) {
        setColorDict({
            ...colorDict,
            [target.calendarId]: target.value
        })
    }

    function submitColors() {
        ProfileService.changeColors(colorDict).then((e) => {
            setMessage("Successfully set colours!")
            setAlertType("success")
            setAlert(true)
        })
    }

    function setPopup(item: never) {
        let type = ""
        if (item['isPersonal']) {
            type = "Personal"
        } else if (item['isAnonymous']) {
            type = "Anonymous"
        } else {
            type = "Shared"
        }
        setGroupID(item['calendarID'])
        setGroupName(item['groupName'])
        setType(type)
        setUsers(item['users'])
        setShowPopup(true)
    }

    useEffect(() => {
        ProfileService.getCalendars().then(res => {
            setCalendars(res.data)
        })
        ProfileService.getColors().then(res => {
            let tempColors: { [id: string] : string; }= {}
            res.data.forEach((e: { calendarID: string; color: string; }) => {
                tempColors[e.calendarID] = e.color
            });
            setColors(tempColors)
            setLoaded(true)
        })
      }, [])

    
    if (!loaded) {
        return <h1>Loading</h1>
    }
    return (
        <div>
            <h3 className="profile-text">Group Settings</h3>
            <table className="group-table">
                <thead>
                    <tr>
                    <th>Group ID <a id="props-basic-1"><span>&#9432;</span> </a> <Tooltip anchorId="props-basic-1" html={groupPopup} /></th>
                    <th>Group Name</th>
                    <th>Colour <a id="props-basic-2"><span>&#9432;</span> </a> <Tooltip anchorId="props-basic-2" html={colourPopup} /></th>
                    </tr>
                </thead>
                <tbody>
                    {calendars.map(item => {
                    return (
                        <tr key={item['calendarID']}>
                        <td><span className="group-id-popup" onClick={() => setPopup(item)}>{ item['calendarID'] }</span></td>
                        <td>{ item['groupName'] }</td>
                        <td><ColorPicker calID={item['calendarID']} originalColor={colors[item['calendarID']]} selected={handleChange}/></td>
                        </tr>
                    );
                    })}
                </tbody>
                <tfoot>
                    <tr><td colSpan={3}><button type="button" className="btn btn-primary btn-block" onClick={submitColors}>Confirm Changes</button></td></tr>
                </tfoot>
            </table>
            {
                showPopup ? 
                <GroupPopup groupID={groupID} groupName={groupName} type={type} users={users} closePopup={() => setShowPopup(false)}></GroupPopup> : null
            }
            <Alert show={alert} variant={alertType} onClose={() => setAlert(false)} dismissible>
                {message}
            </Alert>
            <h3 className="profile-text">Joining / Creating A Group</h3>
            <div className="choice-form">
                <Formik initialValues={{choice:"join", field:""}} onSubmit={addCalendar}> 
                    <Form>
                        <div>
                            <span>Select An Option: </span>
                            <a id="props-basic-3"><span>&#9432;</span> </a> <Tooltip anchorId="props-basic-3" html={joinPopup} />
                            <Field as="select" name="choice">
                                <option value="join">Join An Existing Group</option>
                                <option value="create">Create A New Group</option>
                                <option value="create-anon">Create A New Anonymous Group</option>
                            </Field> 
                        </div>
                        <div>
                            <Field id="choice-form-field" name="field" type="text" placeholder="Enter Group Name To Create / Enter 6-Digit ID To Join A Group" />
                        </div>
                        <div>
                            <button type="submit" className="btn btn-primary btn-block">Submit</button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
        
    )
}