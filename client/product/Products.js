import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { Link } from 'react-router-dom';
import AddToCart from './../cart/AddToCart';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    background: theme.palette.background.paper,
    textAlign: 'left',
    padding: '0 8px',
  },
  container: {
    minWidth:'100%',
    paddingBottom: '14px',
  },
  imageList: {
    minHeight: 200,
    padding: '16px 0 10px',
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      2
    )}px`,
    color: theme.palette.openTitle,
    width: '100%',
  },
  tile: {
    textAlign: 'center',
    height: '100%',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  link: {
    width: '100%',
    height: '100%'
  },
  tileBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    textAlign: 'left',
  },
  tileTitle: {
    fontSize: '1.1em',
    marginBottom: '5px',
    color: 'rgb(189, 222, 219)',
    display: 'block',
  },
}));

export default function Products(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {props.products.length > 0 ? (
        <div className={classes.container}>
          <ImageList rowHeight={200} className={classes.imageList} cols={4}>
            {props.products.map((product, i) => (
              <ImageListItem key={i} className={classes.tile}>
                <Link to={'/product/' + product._id} className={classes.link}>
                  <img
                    className={classes.image}
                    src={'/api/product/image/' + product._id}
                    alt={product.name}
                  />
                </Link>
                <ImageListItemBar
                  className={classes.tileBar}
                  title={
                    <Link
                      to={'/product/' + product._id}
                      className={classes.tileTitle}
                    >
                      {product.name}
                    </Link>
                  }
                  subtitle={<span>$ {product.price}</span>}
                  actionIcon={<AddToCart item={product} />}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </div>
      ) : (
        props.searched && (
          <Typography
            variant='subheading'
            component='h4'
            className={classes.title}
          >
            No products found! :(
          </Typography>
        )
      )}
    </div>
  );
}
Products.propTypes = {
  products: PropTypes.array.isRequired,
  searched: PropTypes.bool.isRequired,
};
