function backUpExpiredOnes() {
  var dateInfo = new MyCurrentDateClass();
  var todaysDate = dateInfo.currentDate;
  var currentMonth = dateInfo.currentMonth+1;
  var currentYear = dateInfo.currentYear;
  
  const thisSpreadSheet = SpreadsheetApp.getActiveSpreadsheet();

  var allSheets = thisSpreadSheet.getSheets();
  var allSheetsNames = [];

  const setUpSheet = thisSpreadSheet.getSheetByName("SETUP").getRange('A2:C10').getValues();

  const activated = setUpSheet[0][1];
  
  if(activated =="NO"){
    console.log("Active Status: "+activated +"- Detected, No Bulletin");
    return 
  }

    // loop to get all the sheet tabs name
  for(let i = 0; i<allSheets.length;i++){
    var individualSheetName = allSheets[i].getSheetName();
    //only insert valid date
    if(dateIsValid(new Date(individualSheetName))){
      allSheetsNames.push(individualSheetName);
    }
  }
    
    // filter out all the dates that are 4 days or more than today's date
    let today = new Date();
    let expiredOnes = allSheetsNames.filter(eachSheetName=>{
      return Math.floor((today - new Date(eachSheetName))/1000/60/60/24) > 3
    })
    if(expiredOnes.length == 0){
      console.log('no tabs are 3 days older')
    }
    let expiredCollection = SpreadsheetApp.openById('spreadsheet-id');

    for(let i = 0; i <expiredOnes.length; i ++){
      let expiredSheet = thisSpreadSheet.getSheetByName(expiredOnes[i])
        try{
            var newBackedUp = expiredSheet.copyTo(expiredCollection).setName(expiredOnes[i]);
   //----------------------------- Locking the sheet ----------------------------//
          var currentDateInfo = `${currentYear}-${currentMonth}-${todaysDate}`;
          var sheetProtection = newBackedUp.protect().setDescription(`${currentDateInfo}- Locked`);

          var me = Session.getEffectiveUser();
              sheetProtection.addEditor(me);
              sheetProtection.removeEditors(sheetProtection.getEditors());

        }catch(e){
          console.log(`${expiredSheet} already backed up`)
        }

      console.log(`${expiredOnes[i]} copied`);
      thisSpreadSheet.deleteSheet(expiredSheet);
    } 
    //  createMultipleTabs();
}
