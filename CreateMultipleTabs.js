
function createMultipleTabs(){

  // get all sheets ready
  const thisSpreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var templateSheet = thisSpreadSheet.getSheetByName("Template");

  var allSheets = thisSpreadSheet.getSheets();        // get how many tabs are there already
  var allSheetsNames = [];      // using sheet(tab) names to find out if tab exist or total amount of tabs exist.

// loop to get all the sheet tabs name
  for(let i = 0; i<allSheets.length;i++){
    var individualSheetName = allSheets[i].getSheetName();      // need sheet name to check if tab already exist.
    //only insert valid date
    if(dateIsValid(new Date(individualSheetName))){
      allSheetsNames.push(individualSheetName);           // push names of all tabs into allSheetNames[]
    }
  }
  console.log(allSheetsNames);

// analyze current tabs and see how many more to create? 
  let numOfSheetsExisting = allSheetsNames.length;
    // add new sheets

  // need to set a date , month, year variable specifically for the loop;
// use math and loop + current date to create a date, test if it's valid.
  let dateToStart = new Date(Math.max(...allSheetsNames.map(element =>{
    return new Date(element)
        }
      )
    )
  );
//---------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------//

  let loopMonth = dateToStart.getMonth()+1;
  let loopDate = dateToStart.getDate();
  let loopYear = dateToStart.getFullYear();

  let months31days=[1,3,5,7,8,10,12];
  let months30days = [4,6,9,11];
  let february = 2;

  for (let i =0; i< 25 - numOfSheetsExisting; i++){          
    // this is make sure it to not create more than 25 in total
    
    let fullDate = `${loopYear}-${loopMonth}-${loopDate}`;
    let fullFormattedDate = new Date(fullDate);

    if(fullFormattedDate.getDay() === 5){
      // if it's friday, first check if adding two days would be valid date
      if(validateDates(`${loopYear}-${loopMonth}-${loopDate+2}`)){
        // console.log("made here?"+loopDate);
        loopDate+=3;

      }else{

        // change month if adding 2 date is invalid
          changeMonthDate();
        // get new date
      }
    }else{

      if(validateDates(`${loopYear}-${loopMonth}-${loopDate+1}`)){
        loopDate+=1;
      }else{
        // change month if date is invalid
        // console.log(validateDates(`${loopYear}-${loopMonth}-${loopDate+1}`))
        changeMonthDate();
      }
    }
    console.log(`All the months: ${loopYear}-${loopMonth}-${loopDate}`);

    var newSheet = templateSheet.copyTo(thisSpreadSheet).setName(`${loopYear}-${loopMonth}-${loopDate}`);

    var firstRowrange = newSheet.getRange('A1:B1');   // Upcoming Events
    var firstRowProtection = firstRowrange.protect().setDescription(`firstRowLock- ${fullDate}`);
    
    var fromRowRange = newSheet.getRange('A7:B8');    // From - Message / Student Notice
    var fromRowProtection = fromRowRange.protect().setDescription(`fromRowLock- ${fullDate}`);

    var todaysNewsRange = newSheet.getRange('A13:B13');   // Today's News
    var todaysNewsProtection = todaysNewsRange.protect().setDescription(`todaysNewsLock- ${fullDate}`);

    var editorsToRemove = ['allpyp@dwight.or.kr','msaito@dwight.or.kr','staff@dwight.or.kr','allmypdp@dwight.or.kr','lsbulletin@dwight.or.kr','businesssuport@dwight.or.kr'];

// this section is to add protecctions to those cells / rows
    var me = Session.getEffectiveUser();

    firstRowProtection.addEditor(me);
    firstRowProtection.removeEditors(firstRowProtection.getEditors());
      console.log("First Row before "+firstRowProtection.getEditors().toString())

    firstRowProtection.addEditor("cforbes@dwight.or.kr");
    //   console.log("First Row after "+firstRowProtection.getEditors().toString())

    if (firstRowProtection.canDomainEdit()) {
      firstRowProtection.setDomainEdit(false);
    }


    fromRowProtection.addEditor(me);
    
    fromRowProtection.removeEditors(fromRowProtection.getEditors());
        console.log("from row Row before "+fromRowProtection.getEditors().toString())

    fromRowProtection.addEditor("cforbes@dwight.or.kr");
        console.log("from row Row after "+fromRowProtection.getEditors().toString())

    if (fromRowProtection.canDomainEdit()) {
      fromRowProtection.setDomainEdit(false);
    }


    todaysNewsProtection.addEditor(me);

    todaysNewsProtection.removeEditors(todaysNewsProtection.getEditors());
        console.log("todaynews row Row after "+todaysNewsProtection.getEditors().toString())
    todaysNewsProtection.addEditor("cforbes@dwight.or.kr");

        console.log("todaynews row Row before "+todaysNewsProtection.getEditors().toString())

  


    if (todaysNewsProtection.canDomainEdit()) {
      todaysNewsProtection.setDomainEdit(false);
    }
  }

// ----------------------- change date functions ----------------------//

  function changeMonthDate(){
    // if(loopMonth)
    if(months31days.includes(loopMonth)){
          // if months are 31 days
        // console.log("made here 2?" + loopDate)
      if(loopDate+1 >31||loopDate+2 >31){
          if(loopMonth+1>12){
            loopYear = loopYear+1;
            loopMonth = 1;
            loopDate = 1;
          }else{
            loopMonth+=1;
            loopDate = 1;
          }
        }
    }else if(months30days.includes(loopMonth)){
        // console.log("made here 3?" + loopDate)
          // if months are 30 days
      if(loopDate+1>30||loopDate+2>30){
            loopMonth+=1;
            loopDate = 1;
        }
    }else if(loopMonth == 2) {
      console.log('is it month 2?');
        if(loopDate+1>28 || loopDate+2>28){
            console.log("made here 4?" + loopDate);
              loopMonth+=1;
              loopDate = 1;
          }
    }
  }
// ----------------------- change date functions ----------------------//
}
