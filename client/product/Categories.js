import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {makeStyles} from '@mui/styles'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import Icon from '@mui/material/Icon'
import {list} from './api-product.js'
import Products from './Products'


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    background: theme.palette.background.paper,
  },
  imageList: {
    flexWrap: 'nowrap',
    width:'100%',
    height:'100%',
    transform: 'translateZ(0)',
  },
  tileTitle: {
    verticalAlign: 'middle',
    lineHeight: 2.5,
    textAlign: 'center',
    fontSize: '1.35em',
    margin: '0 4px 0 0',
  },
  card: {
    margin: 'auto',
    marginTop: 20
  },
  title: {
    padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
    color: theme.palette.openTitle,
    backgroundColor: '#80808024',
    fontSize: '1.1em'
  },
  icon: {
    verticalAlign: 'sub',
    color: '#738272',
    fontSize: '0.9em'
  },
  link: {
    color: '#4d6538',
    textShadow: '0px 2px 12px #ffffff',
    cursor:'pointer'
  }
}))

export default function Categories(props){
  const classes = useStyles()
  const [products, setProducts] = useState([])
  const [selected, setSelected] = useState(props.categories[0])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    list({
      category: props.categories[0]
    }).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setProducts(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [])

  const listbyCategory = category => event => {
    setSelected(category)
    list({
      category: category
    }).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setProducts(data)
      }
    })
  }

    return (
      <div>
        <Card className={classes.card}>
          <Typography type="title" className={classes.title}>
            Explore by category
          </Typography>
          <div className={classes.root}>
            <ImageList className={classes.imageList} cols={4}>
              {props.categories.map((tile, i) => (
                <ImageListItem key={i} className={classes.tileTitle} style={{height: '64px', backgroundColor: selected == tile? 'rgba(95, 139, 137, 0.56)':'rgba(95, 124, 139, 0.32)'}}>
                  <span className={classes.link} onClick={listbyCategory(tile)}>{tile}  <Icon className={classes.icon}>{selected == tile && 'arrow_drop_down'}</Icon></span>
                </ImageListItem>
              ))}
            </ImageList>
          </div>
          <Divider/>
          <Products products={products} searched={false}/>
        </Card>
      </div>
    )
}
Categories.propTypes = {
  categories: PropTypes.array.isRequired
}