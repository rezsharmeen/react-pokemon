import { FaHeart, FaRegHeart, FaWindowClose } from "react-icons/fa"; 

import classes from './ItemDetails.module.css';

function ItemDetails(props) {
  const item = props.data; 
  return <div className={classes.details}>
    <img className={classes.detailimage} alt={item.title} src={item.image} />
    <FaWindowClose onClick={() => props.onSelectIconHandler()} />
    <div className={classes.audio}>
      <audio controls>
        <source src={item.sound} />
      Your browser does not support the audio element.
      </audio>
    </div>
    <div className={classes.info}>
      <div className={classes.detailFav}>  
        <div className={classes.detailFavInfo}>
          <div className={classes.name}>{item.name}</div>
          <div className={classes.types}>{item.types.join(", ")}</div>
        </div>
        <div className={classes.detailAction}>
          { item.isFavorite && 
            <FaHeart color="red" onClick={() => props.onFavClickHandler(item.id, false)} />
          }
          { !item.isFavorite && 
            <FaRegHeart color="red" onClick={() => props.onFavClickHandler(item.id, true)} />
          }
        </div>
      </div>
      <div className={classes.hpcp}>
        <span className={classes.cp}>CP: {item.maxCP}</span>
        <span className={classes.hp}>HP: {item.maxHP}</span>
      </div>
      <div className={classes.specs}>
        <div className={classes.weight}>
          <div>Weight</div>
          {item.weight.minimum}-{item.weight.maximum}
        </div>
        <div className={classes.height}>
          <div>Height</div>
          {item.height.minimum}-{item.height.maximum}
        </div>
      </div>
    </div>
  </div>
}

export default ItemDetails;