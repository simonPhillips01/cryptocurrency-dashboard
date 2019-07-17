import React from 'react';
import _ from 'lodash';
import { tsParenthesizedType } from '@babel/types';

const cc = require('cryptocompare');

export const AppContext = React.createContext();

const MAX_FAVOURITES = 10

export class AppProvider extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            page: 'dashboard',
            favourites: ['BTC', 'ETH', 'XMR', 'DOGE'],
            ...this.savedSettings(),
            setPage: this.setPage,
            addCoin: this.addCoin,
            removeCoin: this.removeCoin,
            isInFavourites: this.isInFavourites,
            confirmFavourites: this.confirmFavourites,
            setFilteredCoins: this.setFilteredCoins
        }
    }

    componentDidMount = () => {
        this.fetchCoins();
        this.fetchPrices();
    }

    fetchCoins = async () => {
        let coinList = (await cc.coinList()).Data;
        this.setState({coinList});
    }

    fetchPrices = async () => {
        if(this.state.firstVisit) return;
        let prices = await this.prices();
        // Filter the empty price objects
        prices = prices.filter(price => Object.keys(price).length);
        console.log(prices)
        this.setState({prices});
    }

    prices = async () => {
        let returnData = [];
        for(let i = 0; i < this.state.favourites.length; i++) {
            try {
                let priceData = await cc.priceFull(this.state.favourites[i], 'GBP');
                returnData.push(priceData);
            } catch(e) {
                console.warn('Fetch price error: ', e)
            }
        }
        return returnData;
    }

    addCoin = key => {
        let favourites = [...this.state.favourites];
        if(favourites.length < MAX_FAVOURITES) {
            favourites.push(key);
            this.setState({favourites});
        }
    }

    removeCoin = key => {
        let favourites = [...this.state.favourites];
        this.setState({favourites: _.pull(favourites, key)})
    }

    isInFavourites = key => _.includes(this.state.favourites, key)

    confirmFavourites = () => {
        this.setState({
            firstVisit: false,
            page: 'dashboard'
        }, () => {
            this.fetchPrices();
        });
        localStorage.setItem('cryptoDash', JSON.stringify({
            favourites: this.state.favourites
        }));
    }

    savedSettings() {
        let crytoDashData = JSON.parse(localStorage.getItem('crytoDash'));
        if(!crytoDashData) {
            return {page: 'settings', firstVisit: true}
        }
        let {favourites} = crytoDashData;
        return {favourites};
    }
    
    setPage = page => this.setState({page});

    setFilteredCoins = (filteredCoins) => this.setState({filteredCoins});

    render() {
        return (
            <AppContext.Provider value={this.state}>
                {this.props.children}
            </AppContext.Provider>
        )
    }
}