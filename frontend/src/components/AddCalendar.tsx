import { Formik, ErrorMessage, Field, Form } from "formik";
import { useEffect, useState } from "react";
import ProfileService from "../utils/profileService";
import * as Yup from "yup";
import ColorPicker from "./ColorPicker";

export default function AddCalendar() {
    const [calendars, setCalendars] = useState([])
    const [colorDict, setColorDict] = useState({})
    const [colors, setColors] = useState({})
    const [loaded, setLoaded] = useState(false)

    function addCalendar(formValue: {choice: string, field: string}) {
        console.log(formValue.choice)
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
                    <th>Calendar ID</th>
                    <th>Calendar Name</th>
                    <th>Colour</th>
                    </tr>
                </thead>
                <tbody>
                    {calendars.map(item => {
                    return (
                        <tr key={item[0]}>
                        <td>{ item[0]}</td>
                        <td>{ item[1] }</td>
                        <td><ColorPicker calID={item[0]} originalColor={colors[item[0]]} selected={handleChange}/></td>
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
                        <option value="join">Join An Existing Calendar</option>
                        <option value="create">Create A New Calendar</option>
                    </Field>
                    <div className="form-group">
                        <Field id="form-field" name="field" type="text" className="form-control" placeholder="Enter Calendar Name To Create / Enter 6-Digit ID To Join" />
                        <button type="submit" className="btn btn-primary btn-block">Submit</button>
                        <ErrorMessage name="field" component="div" className="alert alert-danger" />
                    </div>
                </Form>
            </Formik>
        </div>
        
    )
}