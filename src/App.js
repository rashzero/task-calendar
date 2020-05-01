import React, { Component } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import EventDialog from './EventDialog';
import "./App.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: "50px auto 50px auto",
      padding: theme.spacing(10),
      width: theme.spacing(110),
      height: "auto",
    },
  },
  dialog: {
    display: 'flex',
    flexWrap: 'wrap',
    position: "absolute"
  }
});

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

class App extends Component {

  state = {
    events: [
      {
        start: moment().toDate(),
        end: moment()
          .add(1, "days")
          .toDate(),
        title: "Some title",
        id: 1,
        color: "#0000ff",
      },
    ],
    event: {
      name: '',
      id: '',
      date: '',
      time: '',
      notes: '',
      color: '#0000ff',
    },
    modalIsOpen: false,
    eventSelect: false,
    errors: {
      name: '',
      date: '',
      time: '',
      notes: '',
    }
  };

  handleChangeColor = (event) => {
    const newState = { ...this.state }
    newState.event.color = event.target.value;
    this.setState(newState);
  };

  onEventResize = ({ event, start, end, allDay }) => {
    const newState = { ...this.state };
    const eventEdit = newState.events.find(doing => doing.id === event.id);
    eventEdit.start = start;
    eventEdit.end = end;
    this.setState(newState);
  };

  onEventDrop = ({ event, start, end, allDay }) => {
    const eventDuration = end - start;
    const eventEnd = +start + eventDuration;
    const newState = { ...this.state };
    const eventEdit = newState.events.find(doing => doing.id === event.id);
    eventEdit.start = start;
    eventEdit.end = new Date(eventEnd);
    this.setState(newState);
  };

  handleSelect = () => {
    const newState = { ...this.state  };
    let id;
    if (this.state.events.length > 0) {
      id = this.state.events[this.state.events.length-1].id + 1;
    } else {
      id = 1;
    };
    newState.modalIsOpen = true;
    newState.event.id = id;
    this.setState(newState);
  }

  handleCancelClose = () => {
    this.setState({
      modalIsOpen: false,
      eventSelect: false,
      event: {
        name: '',
        id: '',
        date: '',
        time: '',
        notes: '',
        color: '#0000ff',
      },
      errors: {
        name: '',
        date: '',
        time: '',
        notes: '',
      },
    });
  }

  handleSelectEvent = (event) => {
    const year = event.start.getFullYear();
    const month = event.start.getMonth()>10?event.start.getMonth()+1:"0" + (event.start.getMonth() + 1);
    const day = event.start.getDate()>10?event.start.getDate():"0" + event.start.getDate();
    const hours = event.start.getHours()>10?event.start.getHours():"0" + event.start.getHours();
    const minutes = event.start.getMinutes()>10?event.start.getMinutes():"0" + event.start.getMinutes();
    const newState = { ...this.state  };
    newState.modalIsOpen = true;
    newState.eventSelect = true;
    newState.event = {
      name: event.title,
      date: `${year}.${month}.${day}`,
      time: `${hours}:${minutes}`,
      notes: event.notes,
      color: event.color,
      id: event.id,
    }
    this.setState(newState);
  }

  handleDelete = (id) => {
    const newState = { ...this.state };
    const indexEventForDelete = newState.events.findIndex(event => event.id === id);
    newState.events.splice(indexEventForDelete, 1);
    newState.modalIsOpen = false;
    this.setState(newState);
    this.handleCancelClose();
  }

  handleEdit = (id) => {
    const newState = { ...this.state };
    const indexEventEdit = newState.events.findIndex(event => event.id === id);
    const { name, date, time, notes, color } = this.state.event;
    const start = new Date(date + '.' + time);
    const end = new Date(date).setHours(23, 59, 59, 0);
    for (const key in this.state.event) {
      if (!this.state.event[key]) {
        newState.errors[key] = "field not require";
      } else {
        newState.errors[key] = "";
      };
    };
    if ( !(name && date && time && notes) ) {
      this.setState(newState);
      return;
    } else {
      const editedEvent = {
        start,
        id,
        end: new Date(end),
        title: name,
        notes: notes,
        color,
      };
      newState.events.splice(indexEventEdit, 1, editedEvent);
      newState.modalIsOpen = false;
      this.setState(newState);
      this.handleCancelClose();
    };
  }

  handleSave = () => {
    const { name, date, time, notes, color, id } = this.state.event;
    const start = new Date(date + '.' + time);
    const end = new Date(date).setHours(23, 59, 59, 0);
    const newState = { ...this.state };
    for (const key in this.state.event) {
      if (!this.state.event[key]) {
        newState.errors[key] = "field not require";
      } else {
        newState.errors[key] = "";
      };
    };
    if ( !(name && date && time && notes) ) {
      this.setState(newState);
      return;
    } else {
      newState.events.push({
        start,
        id,
        end: new Date(end),
        title: name,
        notes: notes,
        color,
      });
      newState.modalIsOpen = false;
      this.setState(newState);
      this.handleCancelClose();
    };  
  }

  handleChange = (id, event) => {
    const newState = { ...this.state };
    newState.event[id] = event.target.value;
    this.setState(newState);
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <EventDialog
          open={this.state.modalIsOpen}
          mouseXY={this.state.mouseXY}
          handleChange={this.handleChange}
          handleCancelClose={this.handleCancelClose}
          handleSave={this.handleSave}
          className={classes.dialog}
          errors={this.state.errors}
          handleChangeColor={this.handleChangeColor}
          checkedColor={this.state.event.color}
          eventSelect={this.state.eventSelect}
          event={this.state.event}
          handleDelete={this.handleDelete}
          handleEdit={this.handleEdit}
        />
        <Paper elevation={3} className={classes.root} >
          <div className="App">
            <DnDCalendar
              selectable
              defaultDate={moment().toDate()}
              defaultView="month"
              events={this.state.events}
              localizer={localizer}
              onEventDrop={this.onEventDrop}
              onEventResize={this.onEventResize}
              resizable
              style={{ height: "100vh" }}
              onSelectEvent={this.handleSelectEvent}
              onSelectSlot={this.handleSelect}
              eventPropGetter={event => ({
                style: {
                  backgroundColor: event.color,
                },
              })}
            />
          </div>
        </Paper>
      </div>
    );
  }
}

export default withStyles(useStyles)(App);
