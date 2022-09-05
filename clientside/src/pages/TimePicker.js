import React, { Fragment, useState, useEffect } from "react";
import {
  TimePicker,
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

function SecondsTimePicker() {
  const [selectedTime, setTime] = useState(new Date());
  const [selectedDate, handleDateChange] = useState(new Date());

  const handleTimeChange = (val) => {
    const hours = new Date(val).getHours();
    const minutes = new Date(val).getMinutes();
    const seconds = new Date(val).getSeconds();
    console.log(`${hours}:${minutes}:${seconds}`);
    setTime(val);
  };

  return (
    <Fragment>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          clearable
          inputVariant="outlined"
          value={selectedDate}
          placeholder="10/10/2018"
          onChange={(date) => handleDateChange(date)}
          minDate={new Date()}
          format="MM/dd/yyyy"
          label="Set Date"
        />
        <br />
        <br />
        <br />
        <TimePicker
          ampm={false}
          openTo="hours"
          views={["hours", "minutes", "seconds"]}
          format="HH:mm:ss"
          label="Set Hours,min,sec"
          value={selectedTime}
          onChange={handleTimeChange}
        />
      </MuiPickersUtilsProvider>
    </Fragment>
  );
}

export default SecondsTimePicker;