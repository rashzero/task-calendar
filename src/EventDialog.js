import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import TextField from '@material-ui/core/TextField';
import DateRangeIcon from '@material-ui/icons/DateRange';
import InputAdornment from '@material-ui/core/InputAdornment';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import Checkbox from '@material-ui/core/Checkbox';
import { green, blue, red, yellow } from '@material-ui/core/colors';

const useStyles = makeStyles({
    root: {
      width: "300px",
      height: "100%",
    },
    textInput: {
      width: "100%",
      marginBottom: "10px"
    },
    buttonCancel: {
      margin: "0 100px 0 5px",
      textTransform: "capitalize",
    },
    button: {
      textTransform: "capitalize",
    },
  });

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const RedCheckbox = withStyles({
  root: {
    color: red[400],
    '&$checked': {
      color: red[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const BlueCheckbox = withStyles({
  root: {
    color: blue[400],
    '&$checked': {
      color: blue[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const YellowCheckbox = withStyles({
  root: {
    color: yellow[400],
    '&$checked': {
      color: yellow[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);


export default function EventDialog(props) {
  const classes = useStyles();

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [mouseXY, setMouseXY] = useState({});
  const windowSize = document.documentElement.clientHeight;
  const actionsPanel = () => {
    if (props.eventSelect) {
      return (
        <div className={classes.buttonCase}>
          <Button
            onClick={() => props.handleDelete(props.event.id)}
            color="secondary"
            className={classes.buttonCancel}
          >
            Delete
          </Button>
          <Button
            onClick={() => props.handleEdit(props.event.id)}
            color="primary"
            className={classes.button}
            autoFocus
          >
            Edit
          </Button>
        </div>
      );
    };
    return (
      <div className={classes.buttonCase}>
        <Button
          onClick={props.handleCancelClose}
          color="secondary"
          className={classes.buttonCancel}
        >
          Cansel
        </Button>
        <Button
          onClick={props.handleSave}
          color="primary"
          className={classes.button}
          autoFocus
        >
          Save
        </Button>
      </div>
    );
  }

  document.onmousemove = function (e) {
    setX(e.clientX);
    setY(e.clientY);
  }

  window.onclick = function () {
    if (props.open) return;
    setMouseXY({
      x,
      y,
    });
  }

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={classes.root}
        style={{ left: `${mouseXY.x-150}px`, top: `${mouseXY.y < windowSize / 2.5 ? mouseXY.y-135 : 25}px` }}
      >
        <DialogContent style={{ padding: "0px" }}>
            <div style={{ textAlign: "right", padding: "5px 5px 0 0" }}>
                <HighlightOffIcon style={{ fontSize: 28, color: "b3adad" }} onClick={props.handleCancelClose}/>
            </div>
            {
              //styles are written in the render due to the features of Material-UI
            }
            <div style={{ padding: "0 15px 0 15px" }}>
                <TextField
                    error={props.errors.name?true:false}
                    id="name"
                    label="event name"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    size="small"
                    className={classes.textInput}
                    onChange={(event) => props.handleChange("name", event)}
                    helperText={props.errors.name}
                    inputProps={{
                      maxLength: 30,
                    }}
                    defaultValue={props.eventSelect?props.event.name:''}
                />
                <TextField
                    error={props.errors.date?true:false}
                    className={classes.textInput}
                    id="date"
                    placeholder="YYYY.MM.DD"
                    label="event date"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <DateRangeIcon />
                            </InputAdornment>
                        ),
                    }}
                    size="small"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(event) => props.handleChange("date", event)}
                    helperText={props.errors.date}
                    defaultValue={props.eventSelect?props.event.date:''}
                />
                <TextField
                    error={props.errors.time?true:false}
                    className={classes.textInput}
                    id="time"
                    label="event time"
                    placeholder="HH:MM"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <QueryBuilderIcon />
                            </InputAdornment>
                        ),
                    }}
                    size="small"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(event) => props.handleChange("time", event)}
                    helperText={props.errors.time}
                    defaultValue={props.eventSelect?props.event.time:''}
                />
                <TextField
                    error={props.errors.notes?true:false}
                    id="notes"
                    label="notes"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    size="small"
                    className={classes.textInput}
                    onChange={(event) => props.handleChange("notes", event)}
                    helperText={props.errors.notes}
                    defaultValue={props.eventSelect?props.event.notes:''}
                />
            </div>
            <div>
              <center>
                <span>Select color for event</span><br/>
                <GreenCheckbox name='color' value='#008000' onChange={props.handleChangeColor} checked={props.checkedColor === '#008000'}/>
                <RedCheckbox name='color' value='#ff0000' onChange={props.handleChangeColor} checked={props.checkedColor === '#ff0000'}/>
                <BlueCheckbox name='color' value='#0000ff' onChange={props.handleChangeColor} checked={props.checkedColor === '#0000ff'}/> 
                <YellowCheckbox name='color' value='#ffff00' onChange={props.handleChangeColor}checked={props.checkedColor === '#ffff00'} />
              </center>
            </div>
        </DialogContent>
        {actionsPanel()}
      </Dialog>
    </div>
  );
}