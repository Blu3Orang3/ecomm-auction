import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { makeStyles } from '@mui/styles';
import  Paper  from "@mui/material/Paper";
import  Typography  from "@mui/material/Typography";
import  List  from "@mui/material/List";
import  ListItemText  from "@mui/material/ListItemText";
import  ListItemButton  from "@mui/material/ListItemButton";
import  ListItemAvatar  from "@mui/material/ListItemAvatar";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import ArrowForward from '@mui/icons-material/ArrowForward'
import Person from '@mui/icons-material/Person'
import {list} from './api-user';

// root: theme.mixins.gutters({
//   padding: theme.spacing(1),
//   margin: theme.spacing(5)
// }),
const useStyles = makeStyles(theme => ({

  gutters:{
    padding: theme.spacing(1),
    margin: theme.spacing(5)
  },
  
  title: {
    margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.openTitle
  }
}))

export default function Users() {
  const [users, setUsers] = useState([]);
  const classes = useStyles();

  useEffect(() => {

    const abortController = new AbortController();
    const signal = abortController.signal;
    list(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error);
        
      } else {
        setUsers(data);
        
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <Paper className={classes.gutters} elevation={4}>
      <Typography variant='h6' className={classes.title}>
        All Users
      </Typography>
      <List dense>
        {users.map((item, i) => {
          return (
            <Link to={'/user/' + item._id} key={i}>
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar>
                    <Person />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={item.name} />
                <ListItemSecondaryAction>
                  <IconButton>
                    <ArrowForward />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItemButton>
            </Link>
          );
        })}
      </List>
    </Paper>
  );
}
