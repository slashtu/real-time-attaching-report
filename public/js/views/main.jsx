/** In this file, we create a React component which incorporates components provided by material-ui */

var React = require('react');
var Chart = require('../chart/eventChart');
var mui = require('material-ui');
var AppBar = mui.AppBar;
var FontIcon = mui.FontIcon;
var RaisedButton = mui.RaisedButton;
var LeftNav = mui.LeftNav;
var Menu = mui.Menu;
var MenuItem = mui.MenuItem;
var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;

var menuItems = [
  { route: 'get-started', text: 'Attacks Report' },
  { route: 'customization', text: 'Risks Report' },
  { type: MenuItem.Types.SUBHEADER, text: 'Resources' },
  { 
     type: MenuItem.Types.LINK, 
     payload: 'https://www.nexusguard.com', 
     text: 'Nexusguard' 
  },
  { 
     type: MenuItem.Types.LINK, 
     payload: 'https://g2.nexusguard.com', 
     text: 'G2 Customer Portal' 
  },
  { 
     type: MenuItem.Types.LINK, 
     payload: 'https://www.google.com', 
     text: 'Provision Portal', 
     disabled: true 
  },
];

var filterMenuItems = [
   { payload: '1', text: 'All', toggle: true, defaultToggled: true},
   { payload: '2', text: 'Filter 2', toggle: true},
   { payload: '3', text: 'Filter 3', toggle: true},
   { payload: '4', text: 'Filter 4', toggle: true},
   { payload: '5', text: 'Filter 5', toggle: true},
   { payload: '6', text: 'Filter 6', toggle: true},
   { payload: '7', text: 'Filter 7', toggle: true},
   { payload: '8', text: 'Filter 8', toggle: true},
   { payload: '9', text: 'Filter 9', toggle: true}
];



var Main = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  componentWillMount: function() {
    ThemeManager.setPalette({
      accent1Color: Colors.deepOrange800
    });

    ThemeManager.setComponentThemes({
      appBar: {
        color: Colors.orange900
      }
    });
  },

  componentDidMount: function() {
    var el = this.getDOMNode();
    
    Chart.create(el);
  },

  gg:function(){
    this.refs.leftNav.toggle();
  },

  render: function() {

    return (
      <div className="chart" >
        
        <AppBar title='Nexusguard' onLeftIconButtonTouchTap={this.gg}  iconClassNameRight="muidocs-icon-navigation-expand-more"/>
        <LeftNav docked={false} menuItems={menuItems} ref='leftNav' />
        <div style={ {float:'right'}} >
          <Menu menuItems={filterMenuItems} autoWidth={false}/>
        </div>
      </div>
    );
  }
  
});

module.exports = Main;
