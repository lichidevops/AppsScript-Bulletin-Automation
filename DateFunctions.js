function dateIsValid(date) {
  const testDate = new Date(date);
  return testDate instanceof Date && !isNaN(testDate);
}

function isWeekend(date= new Date()){
  return date.getDay()===6 || date.getDay === 0;
}

function isDateInFuture(date){
  const today = new Date();
  today.setHours(23,59,59,998);
  return date > today;
}

function checkDate(date){
  return validateDates("2022-3-29")
}


function validateDates(date){
  let formattedDate = new Date(date);
  let fullYear = [];

  let startingMonth = formattedDate.getMonth()+1;
  // console.log(startingMonth);

  let allMonths = [1,2,3,4,5,6,7,8,9,10,11,12];

  let startingMonthIndex = allMonths.indexOf(startingMonth);

  let months31days=[1,3,5,7,8,10,12];
  let months30days = [4,6,9,11];
  let year = new Date().getFullYear();

  let totalMonth = 0;
  for(let month = startingMonth; month < 12+formattedDate.getMonth(); month ++){
    if(totalMonth>12){
      break;
    }
    if(month >12){
      month = month -12;
      if(months31days.includes(month)){
        for(let date = 1; date <=31; date++){
          fullYear.push(`${year}-${month}-${date}`)
        }
      }else if(months30days.includes(month)){
        for(let date = 1; date <=30; date++){
          fullYear.push(`${year}-${month}-${date}`)
        }
      }else if(month ===2){
        for(let date = 1; date <=28; date++){
          fullYear.push(`${year}-${month}-${date}`)
        }
      }
      totalMonth+=1;
    }else{
      if(months31days.includes(month)){
        for(let date = 1; date <32; date++){
          fullYear.push(`${year}-${month}-${date}`)
        }
      }else if(months30days.includes(month)){
        for(let date = 1; date <31; date++){
          fullYear.push(`${year}-${month}-${date}`)
        }
      }else if(month ===2){
        for(let date = 1; date <29; date++){
          fullYear.push(`${year}-${month}-${date}`)
        }
      }
    }
    totalMonth+=1;
  }
  // console.log(fullYear)
  console.log("this date is valid: "+fullYear.includes(date))

  return fullYear.includes(date);

}


function createNewBulletin(){

    // locate template by url
  const setUpSheet = bulletinSpreadSheet.getSheetByName("SETUP").getRange('A2:C10').getValues();  
  // use folder url to create a new doc with template
  const folderUrl = setUpSheet[1][1];
  
  var folderId = folderUrl.match(/.*[^-\w]([-\w]{25,})[^-\w]?.*/)[1];
  
  var bulletinFolder = DriveApp.getFolderById(folderId);

  var docName = `Upper School bulletin - ${todaysDate} / ${monthNames[currentMonth]} / ${currentYear}`;

  // var templateLink = "";
  var createNewDoc = DocumentApp.create(docName);
  var body = createNewDoc.getBody();
  body.insertParagraph(0,"hello")
  // maybe change to make a copy of template by link
  
  // with document you first create it, get id of it, then MOVE to the folder
  var newDocFile = DriveApp.getFileById(createNewDoc.getId());
  newDocFile.moveTo(bulletinFolder);

  console.log(docName)
  // add date to it (date range - e.g Sept 01 - 07)
  //
}


