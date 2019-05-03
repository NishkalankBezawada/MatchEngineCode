import {Component} from 'react';
import * as React from 'react';
import Lstyles from '../components/TaxonomyPicker.module.scss';


export default class BackGroundImage extends React.Component {

    render() {
      return (
        <div className="App">
          <header className="App-header">
            <img src={require('../assets/NewSPLogo.png')} className={Lstyles.logo} alt="logo" />
          </header>
        </div>
      );
    }
  }
