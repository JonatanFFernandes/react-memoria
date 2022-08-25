import { useEffect, useState } from 'react';
import * as C from './App.styles';
import logoImage from './assets/devmemory_logo.png';
import RestartIcon from './svgs/restart.svg';

import { Button } from './Button';
import { InfoItem } from './components/InfoItem';
import { GridItem } from './components/GridItem';

import { GridItemType } from './types/GridItemType';
import { items } from './data/items'
import { formatTimeElepsed } from './helpers/formatTimeElepsed';



const App = () => {
    const [playing, setPlaying] = useState<boolean>(false); /* Verifica se o jogo está rolando ou não */
    const [timeElepsed, setTimeElepsed] = useState<number>(0); /* Quantidade do tempo decorrido, que passou (em segundos) */
    const [moveCount, setMoveCount] = useState<number>(0);/* Quantidade de movimentos que foram executados */
    const [showCount, setShowCount] = useState<number>(0); /* Quantidade de ítens (cartas) que estão sendo mostrado naquela jogada */
    const [gridItems, setGridItems] = useState<GridItemType[]>([]); /* Usado para exibir os itens, Array dos ítens, quem está sendo mostrado etc... */

    useEffect(() => resetAndCreateGrid(),[]);

    useEffect(() => {
      const timer = setInterval(() => {
        if(playing) /* Se playing estiver como true, conto o tempo, senão para de contar */
          setTimeElepsed(timeElepsed + 1);
      }, 1000);
      return () => clearInterval(timer);
    }, [playing, timeElepsed]); /*Variáveis que ficam sendo monitoradas a medida que forem mudando*/

    //Verificar se as cartas abertas são iguais
    useEffect(() => {
      if (showCount === 2) {
        let opened = gridItems.filter(item => item.shown === true);
        if (opened.length === 2) {


          // Verificação 1 - Se as cartas abertas forem iguais, então tornaremos permanentes
          if (opened[0].item === opened[1].item) {
            let tmpGrid = [...gridItems];
             for(let i in tmpGrid) {
              if(tmpGrid[i].shown) {
                tmpGrid[i].permanentShown = true;
                tmpGrid[i].shown = false;
              }
             }
              setGridItems(gridItems);
              setShowCount(0);
            } else {
            // Verificação 2 - Se as cartas não forem iguais então fechá-las.
            setTimeout(() => {
                let tmpGrid = [...gridItems];
              for(let i in tmpGrid){
                tmpGrid[i].shown = false;
              }
              setGridItems(gridItems);
              setShowCount(0);
            },1000);
          }
          setMoveCount(moveCount => moveCount + 1);
        }
      }
    }, [showCount, gridItems]);

    // Verificar se o jogo terminou
    useEffect(() => {
      if (moveCount === 0 && gridItems.every(item => item.permanentShown === true)) // Verificar se o item permanentShown seja true, e caso positivo continua
        setPlaying(false);
    },[moveCount, gridItems]);

    const resetAndCreateGrid = () => {
      // Passo 1 - Resetar o jogo
      setTimeElepsed(0);
      setMoveCount(0);
      setShowCount(0);

      // Passo 2 - Criar o Grid
      // 2.1 - Criar um Grid Vazio
      let tmpGrid: GridItemType[] = [];
      for(let i = 0; i < items.length * 2; i++) {
        tmpGrid.push({
          item: null,
          shown: false,
          permanentShown: false
        });
      }

      // 2.2 Preencher o Grid
      for (let w = 0; w < 2; w++) {
        for (let i = 0; i < items.length; i++) {
          let pos = -1;
          while (pos < 0 || tmpGrid[pos].item !== null) {
            pos = Math.floor(Math.random() * (items.length * 2));
          }
          tmpGrid[pos].item = i;
        }
      }

      // 2.3 Jogar no state
      setGridItems(tmpGrid);
      
      // Passo 3 - Começar o jogo
      setPlaying(true);
    }

    const handleItemClick = (index: number) =>  {
        if (playing && index !== null && showCount <2) {
        let tmpGrid = [...gridItems]
        
        if (tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false) {
          tmpGrid[index].shown = true;
          setShowCount(showCount + 1);
        }
        setGridItems(tmpGrid);
      }
  }



  return (
    <C.Container>
      <C.Info>
        <C.LogoLink href="">
          <img src={ logoImage} width="200" alt="" />
        </C.LogoLink>
        <C.InfoArea>
          <InfoItem label='Tempo' value={formatTimeElepsed(timeElepsed)} />
          <InfoItem label='Movimentos' value={moveCount.toString()} />
        </C.InfoArea>

        <Button label='Reiniciar' icon={RestartIcon} onClick={resetAndCreateGrid} />
      </C.Info>
      <C.GridArea>
        <C.Grid>
          {gridItems.map((item, index) => (
            <GridItem 
              key={index}
              item={item}
              onClick={() => handleItemClick(index)}
            />
          ))}
        </C.Grid>
      </C.GridArea>
    </C.Container>
  )
}

export default App;
