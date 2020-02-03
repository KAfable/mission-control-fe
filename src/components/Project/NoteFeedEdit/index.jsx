import React, { useState, useEffect } from 'react';
import StarRatings from 'react-star-ratings';
import { Label, Dropdown } from 'semantic-ui-react';
import Button from '@material-ui/core/Button';
import { useMutation } from 'urql';
import extractAvatar from '../../../utils/managers';
import DeleteNote from '../Note/DeleteNote';

import {
  mainContainer,
  editorContainer,
  avatarContainer,
  formContainer,
  formHeader,
  bodyContainer,
  bodyInput,
  textFooter,
  attendeesAvatars,
  miniAvatarContainer,
  collapsedView,
  expandedView,
  saveBtn,
  editButtons,
} from './NoteFeedEdit.module.scss';

import { UpdateNoteMutation as updateNote } from '../Queries/requests';

const topicOptions = [
  { key: 'gd', value: 'General Discussion', text: 'General Discussion' },
  {
    key: 'pca',
    value: 'Product Cycle Approval',
    text: 'Product Cycle Approval',
  },
  {
    key: 'rca',
    value: 'Release Canvas Approval',
    text: 'Release Canvas Approval',
  },
];

export default ({ user, note, id, setIsEditing, isEditing }) => {
  const initialState = {
    topic: note.topic,
    content: note.content,
    rating: note.rating,
    attendees: note.attendedBy,
    expandedAttendees: false,
    expandedAbsent: false,
    absentees: [],
    error: true,
    hover: true,
  };
  const [state, setState] = useState(initialState);
  const [res, executeMutation] = useMutation(updateNote);

  useEffect(() => {
    if (state.topic && state.content && state.rating > 0) {
      setState(s => ({ ...s, error: false, hover: false }));
    } else {
      setState(s => ({ ...s, error: true, hover: true }));
    }
  }, [state.topic, state.content, state.rating]);

  if (res.error) {
    alert('Incorrect data shape');
  }

  const markAbsent = e => {
    e.preventDefault();
    e.stopPropagation();
    const deleted = e.target.previousSibling.textContent;
    const newAttendees = state.attendees.filter(({ name }) => {
      return name !== deleted;
    });
    const deletedAttendee = state.attendees.filter(({ name }) => {
      return name === deleted;
    });
    const newAbsentees = [...state.absentees, ...deletedAttendee];
    setState({ ...state, attendees: newAttendees, absentees: newAbsentees });
  };

  const markAttended = e => {
    e.preventDefault();
    e.stopPropagation();
    const attended = e.target.previousSibling.textContent;
    const newAttendee = state.absentees.filter(({ name }) => {
      return name === attended;
    });
    const newAttendees = [...state.attendees, ...newAttendee];
    const newAbsentees = state.absentees.filter(({ name }) => {
      return name !== attended;
    });
    setState({ ...state, attendees: newAttendees, absentees: newAbsentees });
  };

  return (
    <div className={mainContainer}>
      <div className={editorContainer}>
        <div className={avatarContainer}>
          <img src={extractAvatar(user)} alt={`avatar of ${user.name}`} />
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            const input = {
              id,
              topic: state.topic,
              content: state.content,
              rating: state.rating,
              // Extracts an array of emails from array of Person objects
              attendedBy: Array.from(state.attendees, ({ email }) => email),
            };
            executeMutation(input);
            setState(initialState);
            setIsEditing(!isEditing);
          }}
          className={formContainer}
        >
          <div className={formHeader}>
            <Dropdown
              placeholder="Select Topic"
              inline
              options={topicOptions}
              onChange={(_, { value }) => {
                setState({ ...state, topic: value });
              }}
              value={state.topic}
            />
            <StarRatings
              numberOfStars={3}
              name="rating"
              starRatedColor="rgb(245,73,135)"
              starHoverColor="rgb(245,73,135)"
              starEmptyColor="rgba(245,73,135,.2)"
              changeRating={rating => setState({ ...state, rating })}
              starDimension="20px"
              starSpacing=".5px"
              rating={state.rating}
            />
          </div>
          <div className={bodyContainer}>
            <textarea
              className={bodyInput}
              placeholder="What's going on?"
              name="content"
              onChange={e => setState({ ...state, content: e.target.value })}
              value={state.content}
            />
          </div>
          <div className={textFooter}>
            <div>
              <div
                className={
                  state.expandedAttendees ? expandedView : collapsedView
                }
                onClick={() =>
                  setState({
                    ...state,
                    expandedAttendees: !state.expandedAttendees,
                  })
                }
                role="presentation"
              >
                Attendees
                <div className={attendeesAvatars}>
                  {state.attendees.map(({ name, email }) => {
                    return (
                      <div className={miniAvatarContainer}>
                        <img
                          src={extractAvatar(email)}
                          alt={`avatar of ${name}`}
                        />
                        <button type="button">
                          <Label disabled size="small">
                            {name}
                          </Label>
                          <Label
                            onClick={markAbsent}
                            size="tiny"
                            as="a"
                            basic
                            color="pink"
                            pointing="left"
                          >
                            Remove
                          </Label>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              {!!state.absentees.length && (
                <div
                  className={
                    state.expandedAbsent ? expandedView : collapsedView
                  }
                  onKeyDown={() =>
                    setState({
                      ...state,
                      expandedAttendees: !state.expandedAttendees,
                    })
                  }
                  onClick={() =>
                    setState({
                      ...state,
                      expandedAbsent: !state.expandedAbsent,
                    })
                  }
                  role="presentation"
                >
                  Absent
                  <div className={attendeesAvatars}>
                    {state.absentees.map(({ name, email }) => {
                      return (
                        <div className={miniAvatarContainer}>
                          <img
                            src={extractAvatar(email)}
                            alt={`avatar of ${name}`}
                          />
                          <button type="button">
                            <Label disabled size="small">
                              {name}
                            </Label>
                            <Label
                              onClick={markAttended}
                              size="tiny"
                              as="a"
                              basic
                              color="green"
                              pointing="left"
                            >
                              Add
                            </Label>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className={editButtons}>
              <DeleteNote id={note.id} />
              <Button
                color="default"
                variant="outlined"
                type="button"
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <button
                className={saveBtn}
                color="primary"
                variant="outlined"
                type="submit"
                disabled={state.error}
                title={
                  state.hover
                    ? 'Please include a title, rating, and content'
                    : null
                }
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
