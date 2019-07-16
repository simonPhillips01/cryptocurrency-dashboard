import React from 'react';
import styled from 'styled-components';
import {AppContext} from '../App/AppProvider';
import CoinTile from './CoinTile';

export const CoinGridStyle = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    grid-gap: 15px;
    margin-top: 40px;
`

function getCoinsToDisplay(coinList, topSection, favourites) {
    return topSection ? favourites : Object.keys(coinList).slice(0, 100);
}

export default function({topSection}) {
    return <AppContext.Consumer>
        {({coinList, favourites}) => <CoinGridStyle>
            {getCoinsToDisplay(coinList, topSection, favourites).map(coinKey =>
                <CoinTile topSection={topSection} coinKey={coinKey} />
            )}
        </CoinGridStyle>}
    </AppContext.Consumer>
}