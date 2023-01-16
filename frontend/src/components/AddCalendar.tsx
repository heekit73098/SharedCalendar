import { Formik, ErrorMessage, Field, Form } from "formik";
import { useEffect, useState } from "react";
import ProfileService from "../utils/profileService";
import ColorPicker from "./ColorPicker";
import { Tooltip } from 'react-tooltip';
import "../assets/AddCalendar.css"

export default function AddCalendar() {
    const [calendars, setCalendars] = useState([])
    const [colorDict, setColorDict] = useState({})
    const [colors, setColors] = useState({})
    const [loaded, setLoaded] = useState(false)
    const popup = `Note:<ol>
    <li>You must use the unique group ID to join a group.</li>
    <li>Your Personal Calendar is not shareable to anyone!
    <li>Creating a new group will share all of your event details with your group members.</li>
    <li>Creating an anonymous group will only reveal your unavailable timings to the group members.</li>
    </ol>`

    function addCalendar(formValue: {choice: string, field: string}) {
        ProfileService.addCalendar(formValue);
        ProfileService.getCalendars().then(res => {
            setCalendars(res.data)
        })
    }

    function handleChange(target: { calendarId: string; value: string; }) {
        setColorDict({
            ...colorDict,
            [target.calendarId]: target.value
        })
    }

    function submitColors() {
        ProfileService.changeColors(colorDict).then((e) => console.log("submitted"))
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
            <table>
                <thead>
                    <tr>
                    <th>Group ID</th>
                    <th>Group Name</th>
                    <th>Colour</th>
                    </tr>
                </thead>
                <tbody>
                    {calendars.map(item => {
                    return (
                        <tr key={item['calendarID']}>
                        <td>{ item['calendarID']}</td>
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
            <br></br>
            <Formik initialValues={{choice:"join", field:""}} onSubmit={addCalendar}> 
                <Form>
                    <Field as="select" name="choice">
                        <option value="join">Join An Existing Group</option>
                        <option value="create">Create A New Group</option>
                        <option value="create">Create A New Anonymous Group</option>
                    </Field> 
                    <a id="props-basic"><span>&#9432;</span> </a> <Tooltip anchorId="props-basic" html={popup} />
                    <div className="form-group">
                        <Field id="form-field" name="field" type="text" className="form-control" placeholder="Enter Group Name To Create / Enter 6-Digit ID To Join A Group" />
                        <button type="submit" className="btn btn-primary btn-block">Submit</button>
                        <ErrorMessage name="field" component="div" className="alert alert-danger" />
                    </div>
                </Form>
            </Formik>
        </div>
        
    )
}