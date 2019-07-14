import React from 'react';
import styled from 'styled-components';
import {AppContext} from '../App/AppProvider';

const ConfirmButtonStyled = styled.div`
    margin: 20px;
    color: #03ff03;
    cursor: pointer;
`

export const CenterDiv = styled.div`
    display: grid;
    justify-content: center;
`

export default function() {
    return <AppContext.Consumer>
                {({confirmFavourites}) => 
                    <CenterDiv>
                        <ConfirmButtonStyled onClick={confirmFavourites}>
                            Confirm Favourites
                        </ConfirmButtonStyled>
                    </CenterDiv>
                }
           </AppContext.Consumer>
}