import { GridItemType } from '../../types/GridItemType';
import * as C from './styles';
import b7Svg from '../../svgs/b7.svg';
import { items } from '../../data/items';

type Props = {
    item: GridItemType,
    onClick: () => void
}

export const GridItem = ({item, onClick}: Props) => {
    return (
        <C.Container 
            showBackground={item.permanentShown || item.shown} /* Se as variáveis permanentShown e shown estiverem true eu exibo o fundo de uma cor ou de outra */
            onClick={onClick}>
            {item.permanentShown === false && item.shown === false && /* Se as variáveis permanentShown e shown estiverem como false então as cartas não serão exibidas */
                <C.Icon src={b7Svg} alt="" opacity={.1}/>
            }
            {(item.permanentShown || item.shown) && item.item !== null && /* Se as variáveis permanentShown e shown forem true e o item for diferente de null então as caratas serão exibidas */
                <C.Icon src={items[item.item].icon} alt="" />
            }
        </C.Container>
    );
}