import React, {useState, useEffect} from 'react'
import { makeStyles } from '@mui/styles'
import Paper from '@mui/material/Paper'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import auth from './../auth/auth-helper'
import {listByUser} from './api-order.js'
import {Link} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 600,
    margin: '12px 24px',
    padding: theme.spacing(3),
    backgroundColor: '#3f3f3f0d'
  },
  title: {
    margin: `${theme.spacing(2)}px 0 12px ${theme.spacing(1)}px`,
    color: theme.palette.openTitle
  }
}))

export default function MyOrders(){
  const classes = useStyles()
  const [orders, setOrders] = useState([])
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    listByUser({
      userId: jwt.user._id
    }, {t: jwt.token}).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setOrders(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [])

    return (
      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          Your Orders
        </Typography>
        <List dense>
          {orders.map((order, i) => {
            return <span key={i}>
                      <Link to={"/order/"+order._id}>
                        <ListItemButton>
                          <ListItemText primary={<strong>{"Order # "+order._id}</strong>} secondary={(new Date(order.created)).toDateString()}/>
                        </ListItemButton>
                      </Link>
                      <Divider/>
                    </span>})}
        </List>
      </Paper>
    )
}