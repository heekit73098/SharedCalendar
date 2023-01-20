import React, { useEffect, useState } from 'react'
import '../assets/ColorPicker.css';
import { CirclePicker } from 'react-color'

function ColorPicker({ calID, originalColor, selected }: {calID:string, originalColor:string, selected:Function}) {
    const [displayColorPicker, setDisplayColorPicker] = useState(false)
    const [color, setColor] = useState("")

    useEffect(() => {
        setColor(originalColor)
    }, [])

    const handleClick = () => {
        setDisplayColorPicker(!displayColorPicker)
    };

    const handleClose = () => {
        setDisplayColorPicker(false)
    };

    const handleChange = (colour: {hex: any;}) => {
        setColor(colour.hex)
        selected({
            calendarId: calID,
            value: colour.hex
        })
    };

    return (
        <div>
        <div className='swatch' onClick={ handleClick }>
            <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: color,
            }} />
        </div>
        { displayColorPicker ? <div className='popover'>
            <div className="cover" onClick={ handleClose }/>
            <CirclePicker color={ color } onChange={ handleChange } />
        </div> : null }

        </div>
    )

}

export default ColorPicker
