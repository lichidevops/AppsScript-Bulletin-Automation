
function createANewTab(){
  var dateInfo = new MyCurrentDateClass();
  var todaysDate = dateInfo.currentDate;
  var currentMonth = dateInfo.currentMonth+1;
  var currentYear = dateInfo.currentYear;
  var currentWeekDay = dateInfo.currentWeekDay;

  const thisSpreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var templateSheet = thisSpreadSheet.getSheetByName("Template");
  // ---------------- get all sheet names in an array ---------------- //
  var allSheets = thisSpreadSheet.getSheets();
  var allSheetsNames = [];

  for(let i = 0; i<allSheets.length;i++){
    var individualSheetName = allSheets[i].getSheetName();
    //only insert valid date
    if(dateIsValid(new Date(individualSheetName))){
      allSheetsNames.push(individualSheetName);
    }
  }
  //-------------------------------------------------------------------------//
  //check if todays date are in the sheet names and passed previous dates //
  var currentDate = `${currentYear}-${currentMonth}-${todaysDate}`;
                console.log(isDateInFuture(new Date(currentDate)));

  if(!allSheetsNames.includes(currentDate)){
      if(currentWeekDay==6 || currentWeekDay ==7){
        //weekend detected, no sheet tab created;
        return ;
        }
    templateSheet.copyTo(thisSpreadSheet).setName(`${currentYear}-${currentMonth}-${todaysDate}`);
  } 
}
