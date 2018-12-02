var fs = require('fs');
var data = require('./selection.json');
var classPrefix = '.uil-icon-';
var fileClassList = 'icons-list.less';
var fileClassUse = 'icons.less';

if (data && data.icons) {
  formatIconsList(data.icons);
}



function formatIconsList(icons) {
  var stylesList = '';
  var stylesUse = '';
  var stylesDocList = '';
  var stylesUses;

  for (let index = 0; index < icons.length; index++) {
    const props = icons[index].properties;
    stylesList += createClass(props);
    stylesUse += createUseCase(props);
    stylesDocList += createDocList(props);
  }

  prepareClassesUseFile(stylesDocList, stylesUse);
  prepareIconListFile(stylesList);
}


function createClass(props) {
  return `
  ${classPrefix}${props.name}() {
    &:before {
      content: "\\${props.code.toString(16)}";
    }
  }`;
}


function createUseCase(props) {
  return `
    &${classPrefix}${props.name} {
      ${classPrefix}${props.name}();
    }`;
}

function createDocList(props) {
  return `  // ${classPrefix}${props.name} - ${props.name} \n`;
}

function prepareClassesUseFile(stylesDocList, stylesUse) {
  const template = `
  @import '../../assets/fonts.less';
  @import '../../utilities/icons/icons-list.less';
  
  // Icons
  //
  // Style guide: content.icons
  //
  // Icons (DO NOT USE ICON CODE)
  //
  //
  // Markup: icons.hbs
  //\n${stylesDocList}
  
  @font-face {
    font-family: 'uil-font-icons-regular';
    src:
      url('./icon/font-icons/fonts/uil-font-icons-regular.ttf?sk6p3c') format('truetype'),
      url('./icon/font-icons/fonts/uil-font-icons-regular.woff?sk6p3c') format('woff'),
      url('./icon/font-icons/fonts/uil-font-icons-regular.svg?sk6p3c#uil-font-icons-regular') format('svg');
    font-weight: normal;
    font-style: normal;
  }
  
  [class^="uil-icons"], [class*=" uil-icons"] {
    /* use !important to prevent issues with browser extensions that change fonts */
    font-family: 'uil-font-icons-regular' !important;
    speak: none;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
  
    /* Better Font Rendering =========== */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  .uil-icons { \n${stylesUse} \n  }\n`;
  write(fileClassUse, template);
}

function prepareIconListFile(stylesList) {
  write(fileClassList, stylesList);
}

function write(filename, data) {
  fs.writeFile("./" + filename, data.toString(), function(err) {
    if(err) {
      return console.log(err);
    }
    console.log(`The file ${filename} was saved!`);
  }); 
}