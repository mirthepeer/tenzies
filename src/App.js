
import React from 'react'
import './App.css';
import Die from './Die'
import uuid from 'react-uuid'
import Confetti from 'react-confetti'




function App() {
  const {useState, useEffect} = React
  
  const [dice, setDice] = useState(generateDice())
  const [gameState, setGameState] = useState(defaultGameState())
  const [topScore, setTopScore] = useState(JSON.parse(localStorage.getItem('topScore'))|| {rolls: null, time:0})
  
  useEffect(()=>{
    const firstValue = dice[0].value
    if(dice.every(dice=>dice.value  === firstValue && dice.isHeld)){
      setGameState(prev=>{
        return({...prev, tenzies:true})
      })
    } else{
      setGameState(prev=>{return {...prev, tenzies:false}})
    }
  },[dice])

  useEffect(()=>{
    
    if(gameState.tenzies){
      if(topScore.rolls === null){
        console.log('yes')
        setTopScore(prevBest=>{
          return {...prevBest , rolls: gameState.rolls , time: gameState.time}
        })
      }
      if(gameState.rolls<topScore.rolls || gameState.time<topScore.time){
        setTopScore(prevBest=>{
          return {...prevBest , rolls: gameState.rolls , time: gameState.time}
        })
      }
    }
  },[gameState.tenzies])


  useEffect(()=>{
    localStorage.setItem('topScore', JSON.stringify(topScore))
  },[topScore])

  useEffect(()=>{
   let timer;
   if(!gameState.tenzies){
    timer = gameState.tenzies? setGameState(prev=>prev) : setInterval(()=>setGameState(prev=> {
      return ({...prev, time: prev.time +1})
    }),1000)
 
   }  
     
     return ()=> clearInterval(timer)
    
  },[gameState.tenzies])
  
 
  function generateRandomDie(){
    const die ={
     value: Math.ceil(Math.random() * 6),
     isHeld: false,
     id: uuid()
   
   
     }
   
     return die
   }

   function defaultGameState(){
    return {tenzies:false, rolls:1, time:0}
   }

   function generateDice(){
    let diceArray = []
    for(let i =0; i<10;i++){
      let newdie = generateRandomDie()
      diceArray.push(newdie)

    }
    return diceArray
   }


   function holdDie(id){
    setDice(dice=>{
      return (
        dice.map(die=>{
          return (
            die.id === id ? {...die, isHeld: !die.isHeld} : die
          )
        })
      )
    })
   }

   function rollDice(){
    if(!gameState.tenzies){
      setDice(prev=>{
        return prev.map(die=>{
          return die.isHeld? die : generateRandomDie()
        })
      })
      setGameState(prev=>{
        return ({...prev, rolls: prev.rolls + 1})
      } )  
    }else{
      setDice(generateDice())
      setGameState(defaultGameState())
    }
    
   }




    const displayDice = dice.map(die=>{
      return (
        <Die 
          key={die.id}
          holdDie={()=>holdDie(die.id)}
          value = {die.value}
          isHeld={die.isHeld}
          />
         
      )
    })
   
  
  
  

 
  const timerStyle = {color: 'lightgreen', fontWeight:'bold'}
  const rollStatStyle = {color : 'red', fontWeight: 'bold'}
  
  return (
    <>
    <div className='topScore'>
    <h2>⭐ Top Score ⭐</h2>
      <div className='score-stats'>
      <p><strong>Rolls: </strong><span style={rollStatStyle}>{topScore.rolls === null? '-' :topScore.rolls}</span></p>
      <p className='timer'>Time: <span style={timerStyle}>{topScore.time===0? '-' : `${topScore.time}s`}</span></p>
       
      </div>
      

    </div>
    {gameState.tenzies && <Confetti/>}
    <div className='instructions'>
      <h1>Tenzies!</h1>
      { gameState.tenzies? 'You win!' :<p className='help'>Hold any number of you choice. Get all the dice to the value of your choice to win. Good luck!</p>}
      <div className='stats'>
      <p><strong>Rolls: </strong><span style={rollStatStyle}>{gameState.rolls}</span></p>
      <p className='timer'>Time: <span style={{color: 'darkgreen'}}>{gameState.time}s</span></p>
      </div>
      
    </div>
    <div className='dice-container'>
      {displayDice}
    </div>
    <div className='button'>
      <button onClick={rollDice}>{gameState.tenzies? 'New Game' : 'Roll'}</button>
    </div>
    </>
    
  );
}

export default App;
