import * as React from 'react';
import styles from '../components/TaxonomyPicker.module.scss';
import { ITaxonomyPickerProps } from './ITaxonomyPickerProps';
import { escape, findIndex } from '@microsoft/sp-lodash-subset';
// Controls
import TermsPickerComponent, { ITaxonomyTerm } from './TermsPickerComponent';
import { DefaultButton, IButtonProps, Button } from 'office-ui-fabric-react/lib/Button';
import { Search, List, Items } from '@pnp/sp';
import { SPHttpClient, SPHttpClientResponse, SPHttpClientConfiguration } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as jquery from 'jquery';
import { ListItem } from '../TaxonomyPickerWebPart';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { render } from 'react-dom';

import ReactTable from 'react-table';
import { DetailsList } from 'office-ui-fabric-react/lib/DetailsList';
import 'react-table/react-table.css';
import { SPComponentLoader } from '@microsoft/sp-loader';
import HorizontalStatusIndicator from 'react-npm-horizontal-status-indicator';
import BackGroundImage from './BackGroundImage';



//import { ReactComponent as Logo } from '../images/NewSPLogo.png';

const loader = document.querySelector('.loader');
const showLoader = () => loader.classList.remove('loader--hide');

const hideLoader = () => loader.classList.add('loader--hide');
// if you want to show the loader when React loads data again


export interface ITaxonomyPickerWebpartState {
  SingleSelectFieldTerms: ITaxonomyTerm[],
  MultiSelectFieldTerms: ITaxonomyTerm[]
}

/* Export ITaxonomyPickerWebpartState to use the props mentioned above*/
export default class TaxonomyPicker extends React.Component<ITaxonomyPickerProps, ITaxonomyPickerWebpartState> {

  public termstoreapplname: string = this.props.TermStoreApplication;
  public termsetName: string = this.props.TermSetName;
  public wpName: string = this.props.WebpartName;
  public spContext: WebPartContext = this.props.myContext;
  
  constructor(props, state: ITaxonomyPickerWebpartState) {
    super(props);

    SPComponentLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.2/css/bootstrap.min.css');

    this.state = {
      SingleSelectFieldTerms: [],
      MultiSelectFieldTerms: []

      //Supply array in the below format for a pre-populated control.
      //SingleSelectFieldTerms:[{name:"<Term-Label>", key="<Term-GUID>"}],
      //MultiSelectFieldTerms:[{name:"<Term-Label>", key="<Term-GUID>"}, {name:"<Term-Label>", key="<Term-GUID>"}]
    }

  }

  /*public componentDidMount() {
    hideLoader();
  }*/
  

  public render(): React.ReactElement<ITaxonomyPickerProps> {

    let imgUrl = '../images/NewSPLogo.jpg';
    let imgU = require('../assets/NewSPLogo.png');
    var sectionStyle = {
      width: "100%",
      height: "400px",
      //backgroundImage: "url(" + { imgU } + ") noRepeat center center fixed",
      backgroundImage: `url(${imgU})`,
      backgroundSize: 'cover',
    };
    var Lstyles = {
      root: {
      
          background: 'url('+ imgUrl + ') noRepeat center center fixed',
          backgroundSize: 'cover',
      }};

    return (

      
      <div>
        <div /*src = { require('../assets/NewSPLogo.png') }className={ styles.logo }*/>
          {/*<img src={ require('../assets/NewSPLogo.png')} className={ styles.logo }></img> style={sectionStyle}*/}
          {/*<img src={ require('../assets/NewSPLogo.png')} style={sectionStyle}></img> <div className={ styles.WebpartHeading }>{escape(this.props.WebpartName)}</div>*/}
          <BackGroundImage />
        </div>
        <div className={styles.WebpartHeading}>{escape(this.props.WebpartName)}</div>
        <div className="ms-Grid">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm12 ms-lg12">
              <TermsPickerComponent IsMultiValue={true} TermSetId='<TERM-SET-ID>' LabelText='Choose skills to search' SelectedTerms={this.state.MultiSelectFieldTerms} />
            </div>
          </div>
        </div>
        <DefaultButton
          primary={true}
          text="Search"
          onClick={this._showTaxonomyControlValues.bind(this)}
        />
        <br/>
        <br/>
        <div className={styles.container}>
          <div className="row">
            <div className="col-12">
              <table className="table table-bordered" id="resultat">

              </table>
            </div>
          </div>
             {/*<table className={styles["ms-Grid"]} id="resultat">
            </table>*/}
          </div>

        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
      </div>
    );
  }
  

  private _showTaxonomyControlValues() {

    if (this.state.MultiSelectFieldTerms.length > 0 ) {
      let multiSelectValues = this.state.MultiSelectFieldTerms.map(trm => {
        return {name: trm.name, key: trm.key }
      })
      console.log("1.1 selected values:");
      console.log(multiSelectValues);
      this.search(multiSelectValues)
    }
  }

  

  public search(pickedTerms){
    console.log(pickedTerms);
    let resultsArr : Array<ListItem> = [];
    var cleanArray = [];

    jquery.ajax({ 
      url: `${this.spContext.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Profiles')/items?$expand=AttachmentFiles`,
      type: "GET", 
      headers:{'Accept': 'application/json; odata=verbose;'}, 
      success: function(resultData) { 
        console.log('Results=');
        console.log(resultData);
        debugger;
        resultData.d.results.forEach(function(item){ 
          let skill = [];
         (item.Skills.results).forEach(function(res){
            pickedTerms.forEach(function(r){
                if(res.TermGuid === r.key){
                  skill.push(res)
                }
                /*if(item.AttachmentFiles.results.length == 1){
                  resultsArr.push({
                    'title':item.Title,
                    'teams':item.Team,
                    'skills':skill,
                    'ID': item.ID,
                    'AttachmentURL': item.AttachmentFiles.results[0].ServerRelativeUrl
                  })
                }else{
                  resultsArr.push({
                    'title':item.Title,
                    'teams':item.Team,
                    'skills':skill,
                    'ID': item.ID,
                    'AttachmentURL': "#"
                  })
                }*/
                resultsArr.push({
                  'title':item.Title,
                  'teams':item.Team,
                  'skills':skill,
                  'ID': item.ID
                  //'AttachmentURL': item.AttachmentFiles.results[0].ServerRelativeUrl
                })
            })
          });
       })
       
       var obj = {};
       for ( var i=0, len=resultsArr.length; i < len; i++ ){
          obj[resultsArr[i]['ID']] = resultsArr[i];
          //obj[resultsArr[i]['AttachmentURL']] = resultsArr[i].AttachmentURL;
       }
           
        resultsArr = new Array();
       for ( var key in obj )
            resultsArr.push(obj[key]);
            debugger;
            resultsArr.forEach(function(res){
                if(!(res.skills.length <= 0))
                {
                cleanArray.push({'Name': res.title, 'Team': res.teams, 'Skills': res.skills, 'Score': /*<HorizontalStatusIndicator>*/(res.skills.length / pickedTerms.length) * 100/*</HorizontalStatusIndicator> /*+ '%', 'AttachmentURL':res.AttachmentURL*/});
                }
            })

       console.log("Object Matached-" + cleanArray);
       console.log("cleanArray");
       console.log(cleanArray);

       cleanArray.sort((a,b) => (a.Score > b.Score) ? -1 : 1)
        let content = "";
        cleanArray.forEach(x => { 
          let competences = "";
            (x.Skills).forEach(s =>{
              competences += s.Label+" ";
                })
                competences.trim()
                  //content += `<tr><td><a href="${x.AttachmentURL}">${x.Name}</a></td><td>${x.Team}</td><td>${x.Score}</td><td>${competences}</td></tr>`
                  content += `<tr><td><a href="#">${x.Name}</a></td><td>${x.Team}</td><td>${x.Score}</td><td>${competences}</td></tr>`
      })

       document.getElementById('resultat').innerHTML = `<thead><tr><th scope="col">Name</th><th scope="col">Team</th><th scope="col">Score</th><th scope="col">Matched skills</th></tr></thead>` + content;
       
       console.log("content: ");
       console.log(content);

      },  
      error : function(jqXHR, textStatus, errorThrown) {
        alert('Error as-'+textStatus);
        console.log("Error in Console - "+errorThrown); 
      }
  });

  }
}


