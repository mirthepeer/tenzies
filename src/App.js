
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
  
  // to check if the user has won the game and changing
  // the state of game accordingly
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

  
  // to determine if user has beaten the previous topscore
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

// everytime  the topScore changes this useEffect is called and the topScore is set to the current value in local Storage
  useEffect(()=>{
    localStorage.setItem('topScore', JSON.stringify(topScore))
  },[topScore])

  // this useEffect controls the timer and it only runs while the game has not won
  useEffect(()=>{
   let timer;
   if(!gameState.tenzies){
    timer = gameState.tenzies? setGameState(prev=>prev) : setInterval(()=>setGameState(prev=> {
      return ({...prev, time: prev.time +1})
    }),1000)
 
   }  
    //  clean up function to remmove the timer once the game is finished
     return ()=> clearInterval(timer)
    
  },[gameState.tenzies])
  
//  generate random die using uuid so the dice has unique ids onced created
  function generateRandomDie(){
    const die ={
     value: Math.ceil(Math.random() * 6),
     isHeld: false,
     id: uuid()
   
   
     }
   
     return die
   }

  // initialze a game state when the game begins from start
   function defaultGameState(){
    return {tenzies:false, rolls:1, time:0}
   }

  //  using the generateRandomDie function this function returns 10 dice array.
   function generateDice(){
    let diceArray = []
    for(let i =0; i<10;i++){
      let newdie = generateRandomDie()
      diceArray.push(newdie)

    }
    return diceArray
   }

  //  logic to tell when the dice is held/clicked so it can change state accordingly and it value doesn't change if it's held
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

  //  it ignores the dice that are already held and creates a new random dice that is not held
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
      // if the game has ended the else block will run so we can restart the game using the default settings 
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
      <h2 className='score-heading'>⭐Top Score⭐</h2>
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
