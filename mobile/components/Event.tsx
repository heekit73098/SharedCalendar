import { Button, Pressable, TextInput } from "react-native";
import CalendarService, { CalendarEvent } from "../utils/calendarService";
import { View, Text } from "./Themed";
import { useEffect, useState } from "react";
import { useAuthState } from "../utils/authContext";
import { useRouter } from "expo-router";
import RNDateTimePicker from "@react-native-community/datetimepicker";

type IntrinsicAttributes = any

export default function Event(selectedEvent: IntrinsicAttributes & CalendarEvent){
    const router = useRouter()
    const [isEditable, setEditable] = useState(false)
    const { state } = useAuthState()
    const [token, setToken] = useState("")
    const [title, setTitle] = useState(selectedEvent.selectedEvent.title)
    const [location, setLocation] = useState(selectedEvent.selectedEvent.location)
    const [startDateTime, setStartDate] = useState(new Date(selectedEvent.selectedEvent.start!));
    const [endDateTime, setEndDate] = useState(new Date(selectedEvent.selectedEvent.end!))
    const [showDate, setShowDate] = useState(false);
    const [showTime, setShowTime] = useState(false);
    const [isStart, setIsStart] = useState(true)
    const [confirm, setConfirm] = useState("Update")

    useEffect(() => {
        if (state.state !== "LOGGED_IN") {
            router.replace("index")
        }
        setToken(state.token!)
    }, [])

    function updateEvent() {
        var updatedEvent = {
            title,
            location,
            start: startDateTime.toString(),
            end: endDateTime.toString()
        }
        const id = selectedEvent.selectedEvent.id
        CalendarService.updateEvent(id, updatedEvent, token).then(
            () => {
                console.log("updated")
            }
        )
    }

    function deleteEvent() {
        const id = selectedEvent.selectedEvent.id
        CalendarService.deleteEvent(id, token).then(
            () => {
                console.log("updated")
            }
        )
    }

    const onChangeStartDate = (event:any, selectedDate:any) => {
        const currentDate = selectedDate;
        setShowDate(false);
        if (isStart) {
            setStartDate(currentDate);
        } else {
            setEndDate(currentDate)
        }
    
    };
    
    const onChangeStartTime = (event:any, selectedTime:any) => {
        const currentTime = selectedTime;
        currentTime.setFullYear(startDateTime.getFullYear())
        currentTime.setMonth(startDateTime.getMonth())
        currentTime.setDate(startDateTime.getDate())
        setShowTime(false)
        if (isStart) {
            setStartDate(currentTime)
        } else {
            setEndDate(currentTime)
        }
        
    }
    
    const showStartDatepicker = () => {
        setShowDate(true)
        setIsStart(true)
    };

    const showEndDatepicker = () => {
        setShowDate(true)
        setIsStart(false)
    };

    const showStartTimepicker = () => {
        setShowTime(true)
        setIsStart(true)
    };

    const showEndTimepicker = () => {
        setShowTime(true)
        setIsStart(false)
    };

    return (
        <View>
            <TextInput 
                onChangeText={setTitle}
                editable={isEditable}
                placeholder={selectedEvent.selectedEvent.title}
                value={title}
                style={{ color: 'black' }}
            />

            <TextInput 
                onChangeText={setLocation}
                editable={isEditable}
                placeholder={selectedEvent.selectedEvent.location}
                value={location}
                style={{ color: 'black' }}
            />
            
            
            <Text>Start Date & Time</Text>
            <Pressable onPress={showStartDatepicker} disabled={!isEditable}>
                <Text>{startDateTime.toDateString()}</Text>
            </Pressable>
            <Pressable onPress={showStartTimepicker} disabled={!isEditable}>
                <Text>{startDateTime.getHours().toString() + ":" + startDateTime.getMinutes().toString()}</Text>
            </Pressable>
            <Text>End Date & Time</Text>
            <Pressable onPress={showEndDatepicker} disabled={!isEditable}>
                <Text>{endDateTime.toDateString()}</Text>
            </Pressable>
            <Pressable onPress={showEndTimepicker} disabled={!isEditable}>
                <Text>{endDateTime.getHours().toString() + ":" + endDateTime.getMinutes().toString()}</Text>
            </Pressable>

            {showDate && (
                <RNDateTimePicker
                testID="datePicker"
                value={startDateTime}
                is24Hour={true}
                onChange={onChangeStartDate}
                mode="date"
                />
            )}
            {showTime && (
                <RNDateTimePicker
                testID="timePicker"
                value={startDateTime}
                is24Hour={true}
                onChange={onChangeStartTime}
                mode="time"
                />
            )}

            <Button 
                title={confirm}
                onPress={confirm === "Update" ? () => {setEditable(true); setConfirm("Confirm")} : () => {updateEvent()}}
            />
            <Button 
                title="Delete"
                onPress={() => {deleteEvent()}}
            />
        </View>
    )
}