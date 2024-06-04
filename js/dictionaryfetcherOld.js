
const baseUrl = "https://script.google.com/macros/s/AKfycbw_2MknLmC2cm5PO_twWLLoIcF2rE_WpDxrzojlfcBJY-XBANs1JGpjtE_foUQGgr3r/exec";  // Please set your Web Apps URL.
const para = {
  spreadsheetId: "1UGaoVI-6SvUeJ-Ysdpdsg04bebRy3kfz5v9TYiUEHsk",  // Please set your Google Spreadsheet ID.
  sheetName: "convertedDictionary"  // Please set the sheet name you want to retrieve the values.
};

const q = new URLSearchParams(para);
const url = baseUrl + "?" + q;
fetch(url)
  .then(res => res.json())
  .then(res => {
    let fetched = res.values;
    for(let i of fetched){
        let word = i[1].toLowerCase();
        if(i[4] == '1.1 v.' || i[4] == '1.2 v.' || i[4] == '1.3 v.' || i[4] == '2 v.'||  i[4] == '3.1 v.' || i[4] == '3.2 v.'){
            verbsAndGroup[word] = i[4].slice(0,-3);
        }
        dictionary[word] = i.slice(0, 1).concat(i.slice(2));
    }
    console.log(dictionary);
    //document.getElementById("loadingDictionary").style.display = "none";
    //document.getElementById("toLoad").style.display = "block";
  });