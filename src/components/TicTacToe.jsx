import { useCallback, useEffect, useState } from "react";
import GAME_STATE from "./game-state";
import Board from "./board";
import clickSound from '../assets/sounds/click.wav';
import gameOverSound from '../assets/sounds/game-over.wav';

const CLICK_SOUND = new Audio(clickSound);
CLICK_SOUND.volume = 0.5;

const GAME_OVER_SOUND = new Audio(gameOverSound);
GAME_OVER_SOUND.volume = 0.2;

const PLAYER_X = 'X';
const PLAYER_O = 'O';

const TicTacToe = () => {
  const [tiles, setTiles] = useState(Array(9).fill(null));
  const [playerTurn, setPlayerTurn] = useState(PLAYER_X);
  const [strikeClass, setStrikeClass] = useState();
  const [lock, setLock] = useState(false);
  const [gameState, setGameState] = useState(GAME_STATE.MATCH_IS_PROCEEDING);

  const handleTileClick = (index) => {
    if (lock) {return 0;}

    if (tiles[index]) {return;}
    
    const newTiles = [...tiles];
    newTiles[index] = playerTurn;
    setTiles(newTiles);
    setPlayerTurn(playerTurn===PLAYER_X ? PLAYER_O : PLAYER_X);
  };

  const calculateWinner = useCallback(() => {
    const winArray = [
      // row
      {windex: [0,1,2], strikeClass: 'strike-row-1'},
      {windex: [3,4,5], strikeClass: 'strike-row-2'},
      {windex: [6,7,8], strikeClass: 'strike-row-3'},
      // column
      {windex: [0,3,6], strikeClass: 'strike-column-1'},
      {windex: [1,4,7], strikeClass: 'strike-column-2'},
      {windex: [2,5,8], strikeClass: 'strike-column-3'},
      // diagnal
      {windex: [0,4,8], strikeClass: 'strike-diagnal-1'},
      {windex: [2,4,6], strikeClass: 'strike-diagnal-2'}
    ];

    for (const {windex, strikeClass} of winArray){
      const tilesValue1 = tiles[windex[0]];
      const tilesValue2 = tiles[windex[1]];
      const tilesValue3 = tiles[windex[2]];
    
      if  (tilesValue1===tilesValue2 && 
        tilesValue2===tilesValue3 && 
        tilesValue3) {
        setStrikeClass(strikeClass);
        setLock(true);
        setGameState(playerTurn===PLAYER_X ? 
          GAME_STATE.PLAYER_O_WON : 
          GAME_STATE.PLAYER_X_WON);
        return; // Exit loop once a winner is found
      }
    } 
  }, [setGameState, playerTurn, tiles]);

  const calculateDraw = useCallback(() => {
    if (tiles.every((tile) => tile !== null)) {
      setLock(true);
      setGameState(GAME_STATE.MATCH_DRAW);
      return; // Exit once the match draw
    }
  }, [tiles]);   

  useEffect(() => {
    calculateDraw();
    calculateWinner();

    if (tiles.some((tile) => tile !== null)) {
      CLICK_SOUND.play();
    } 

    if (gameState !== GAME_STATE.MATCH_IS_PROCEEDING) {
      GAME_OVER_SOUND.play();
    }
  }, [tiles, gameState, calculateWinner, calculateDraw]);

  const reset = () => {
    setTiles(Array(9).fill(null));
    setPlayerTurn(PLAYER_X);
    setStrikeClass(null);
    setLock(false);
    setGameState(GAME_STATE.MATCH_IS_PROCEEDING);
  };

  return (
    <div>
      <h1>Tic Tac Toe</h1>
      <Board 
        strikeClass={strikeClass}
        playerTurn={playerTurn} 
        tiles={tiles} 
        onTileClick={handleTileClick}
      />
      <h2 className="game-state">{`${gameState}`}</h2>
      <button className="reset" onClick={() => {reset()}}>Reset</button>
    </div>
  );
};

export default TicTacToe;