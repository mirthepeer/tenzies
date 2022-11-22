


export default function Die(props) {
  const style = {
    backgroundColor: props.isHeld ?  'lightgreen': ''
   } 
    
    
    return(
        <div onClick={props.holdDie} className="die">
            <p style={style}  className="die-value">{props.value}</p>
        </div>


    )
};
