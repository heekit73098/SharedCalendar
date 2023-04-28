import { useEffect, useState } from 'react';
import { Alert, Button, Pressable, TextInput, StyleSheet } from 'react-native';
import { Text, View } from './Themed';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import CalendarService, { CalendarEvent, CalendarData } from '../utils/calendarService';
import ProfileService from '../utils/profileService';
import { Dropdown } from 'react-native-element-dropdown';
import { useAuthState } from '../utils/authContext';
import { useRouter } from 'expo-router';

export default function AddEvent() {
  const router = useRouter()
  const [startDateTime, setStartDate] = useState(new Date());
  const [endDateTime, setEndDate] = useState(new Date())
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [isStart, setIsStart] = useState(true)
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const { state } = useAuthState()
  const [token, setToken] = useState("")
  const [calendars, setCalendars] = useState<{value:string, label:string}[]>([])
  const [value, setValue] = useState("");
  const [isFocus, setIsFocus] = useState(false);

    const renderLabel = () => {
      if (value || isFocus) {
        return (
          <Text style={[styles.label, isFocus && { color: 'blue' }]}>
            Dropdown label
          </Text>
        );
      }
      return null;
    };

  useEffect(() => {
    if (state.state !== "LOGGED_IN") {
      router.replace("index")
    }
    setToken(state.token!)
    
  }, [])

  useEffect(() => {
    ProfileService.getCalendars(token).then(res => {
      var calendarArray: {value:string, label:string}[] = []
      res.data.forEach((calendar: CalendarData) => {
        calendarArray?.push({
          value: calendar['calendarID'],
          label: calendar['groupName']
        })
      });
      setCalendars(calendarArray)
    }).catch(
      (err) => {
        console.log("get calendars in add event error")
        console.log(err)
      }
    )
  }, [token, setToken])

  function addNewEvent() {
    if (endDateTime < startDateTime) {
      Alert.alert("Invalid Settings", "End Time should not be earlier than Start Time!")
    }
    if (value === "") {
      Alert.alert("Invalid Settings", "Please select a group!")
      return
    }
    if (title === "") {
      Alert.alert("Invalid Settings", "Please enter a title!")
      return
    }
    const event: CalendarEvent = {
      calendarID: value,
      id: "",
      title: title,
      location: location,
      isAllday: false,
      start: startDateTime.toString(),
      end: endDateTime.toString(),
      category: "",
      dueDateClass: "",
      state: "",
      isPrivate: false,
      tag: ''
    }
    CalendarService.createEvent(event, token).then(
      (res) => {
        console.log("success")
      }
    ).catch(
      (err) => {
        console.log("create event error")
        console.log(err)
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
        placeholder='Title'
      />

      <TextInput 
        onChangeText={setLocation}
        placeholder='Location'
      />
      
      
      <Text>Start Date & Time</Text>
      <Pressable onPress={showStartDatepicker}>
          <Text>{startDateTime.toDateString()}</Text>
      </Pressable>
      <Pressable onPress={showStartTimepicker}>
          <Text>{startDateTime.getHours().toString() + ":" + startDateTime.getMinutes().toString()}</Text>
      </Pressable>
      <Text>End Date & Time</Text>
      <Pressable onPress={showEndDatepicker}>
          <Text>{endDateTime.toDateString()}</Text>
      </Pressable>
      <Pressable onPress={showEndTimepicker}>
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
      <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={calendars}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
          }}
          
        />
      
      <Button onPress={addNewEvent} title='Create New Event' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});