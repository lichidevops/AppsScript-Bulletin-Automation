function updateStudentBulletin() {
//----------------------------- setup dates ----------------------------//
  var dateInfo = new MyCurrentDateClass();
  var todaysDate = dateInfo.currentDate;
  var currentMonth = dateInfo.currentMonth+1;
  var currentYear = dateInfo.currentYear;
  var monthInEnglish = dateInfo.getCurrentEnglishMonth();
  var weekDayEnglish = dateInfo.getWeekDayEnglishName();
  console.log(monthInEnglish)
//----------------------------- Files & variables ----------------------------//

  const bulletinSpreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  const setUpSheet = bulletinSpreadSheet.getSheetByName('SETUP').getRange('A2:C14').getValues();

//----------------------------- Check acitve ----------------------------//

  const activated = setUpSheet[7][1];
  if(activated =="NO"){
    console.log("Active Status: "+activated +"- Detected, No Bulletin");
    return 
  }
//----------------------------- Check acitve ----------------------------//

  const studentBulletinUrl = setUpSheet[9][1];
  const docFileId = studentBulletinUrl.match(/.*[^-\w]([-\w]{25,})[^-\w]?.*/)[1];
  const studentTemplateUrl = setUpSheet[8][1];
  const templateFileId = studentTemplateUrl.match(/.*[^-\w]([-\w]{25,})[^-\w]?.*/)[1];

  var currentDateInfo = `${currentYear}-${currentMonth}-${todaysDate}`

  var todaysNewsSheet = bulletinSpreadSheet.getSheetByName(currentDateInfo);

//----------------------------- shouldn't need this ----------------------------//
  // if(!todaysNewsSheet){
  //   createANewTab();
  //    todaysNewsSheet = bulletinSpreadSheet.getSheetByName(currentDateInfo);
  // }
//----------------------------- shouldn't need this ----------------------------//
  if(!todaysNewsSheet){
    console.log("todaysNewsSheet does not exist - through student bulletin");
    console.log("Operation ended")
    return 
  }

//----------------------------- don't need protection either ---------------------//

//----------------------------- preparation ----------------------------//
  // find the doc file and  inserting the page break
  let bulletinFile = DocumentApp.openById(docFileId);

  bulletinFile.getBody().insertPageBreak(0);

  // -------------- get spreadsheet data ---------------//

  let endRange = todaysNewsSheet.getLastRow();


  let newsContent = todaysNewsSheet.getRange(`A1:B${endRange}`).getRichTextValues();
  let newsObjectArray =[];

  for(let i = 0; i <newsContent.length;i++){
    // loop through the rows that has content;

    if(newsContent[i][0].getText() !=="" || newsContent[i][1].getText()!==""){
      let fromWho = newsContent[i][0].getText();       // get Column A -'from'

      let newsText;

      if(newsContent[i][1].getText()==""){
        newsText ="";
      }else{
        newsText = newsContent[i][1].getText();
      }

// need to use this reducer to grab the url links in Message Column if there is one.
      let messageUrlLink = newsContent[i][1].getRuns().reduce((array,e)=>{
        var url = e.getLinkUrl();
        if(url){
          if(!array.some(e=>e.url == url)){
            array.push({
              url:url,
              text:e.getText()
            })
          }
        };
        return array;
      },[]);

// need to use this reducer to grab the url link in fromWho Column if there is one.
      let fromUrlLink = newsContent[i][0].getRuns().reduce((array,e)=>{
        var url = e.getLinkUrl();
        if(url){
          array.push({
            url:url,
            text:e.getText()
          })
        }
        return array;
      },[]);

      newsObjectArray.push({from:{text:fromWho,url:fromUrlLink},message:{text:newsText,url:messageUrlLink}});
    }
  }
  // end for loop

// get the rows of news ready
  let newsTableLength;
  let studentsNewsEnd;
    for(let i = 0; i < newsObjectArray.length;i++){
      //loop down the table untill seeing "From":
      if(newsObjectArray[i]['from']['text']=="From"&& newsObjectArray[i]['message']['text']=="Message"){      // news table(row) starts after "From"and"Message" row;
        newsTableLength = i+1;        // so that From and two doesn't get copied in  
      }
      if(newsObjectArray[i]['from']['text']=="Today’s News"){
        studentsNewsEnd = i;      // if run into "todays news", stop and set student end
      }
  }
  console.log(`Table length: ${newsTableLength}`)
  
// use the cell number of newsTable to determin the loop of upcoming
  //-----------------------------------------------------------------------------//
  let upComingContent=[];
  //---------------------------------- URl links if needed------------------------------//
  for(let i = 1; i <newsTableLength-1;i++){
    // i=1 is for skipping title"Upcoming Events:",newsTableLength -1 is for stopping before "From / Message"
    // newsTableLength-1 is for not getting the "From" word
    let upComingLink = newsContent[i][0].getRuns().reduce((array,e)=>{
        var url = e.getLinkUrl();
        if(url){
          array.push({
            url:url,
            text:e.getText()
          })
        };
        return array;
      },[]);

    upComingContent.push({content:{text:newsContent[i][0].getText()+"\n",url:upComingLink}})                          // collect all rows of upcoming 
  }     // endfor
//----------------------------- URl links if needed -------------------------------//

  let studentsNews = [];

  for(let i = newsTableLength; i<studentsNewsEnd;i++){
    studentsNews.push(newsObjectArray[i]);
  }
  console.log(studentsNews)

//----------------------------- insert new content  ----------------------------//
//prepare template to copy into newBulletin
  const templateBody = DocumentApp.openById(templateFileId).getBody();
  var templateElementsNum = templateBody.getNumChildren();
  var newBulletinBody = bulletinFile.getBody();

//INSERTING TABLE use loop to copy each element from template  
  for(let i = 0;i<templateElementsNum;i++){
    var element = templateBody.getChild(i).copy();

    // detect the tables in bulletin doc and copy/insert into target new bulletin
    if(element.getType() == DocumentApp.ElementType.TABLE){
      let insertBulletinTable = newBulletinBody.insertTable(0,element); 
    }
  }

//-------------------------------Styling----------------------------------//

  var textStyle = {};
  textStyle[DocumentApp.Attribute.FONT_FAMILY]="Arial";
  textStyle[DocumentApp.Attribute.FOREGROUND_COLOR]="#000000";
  textStyle[DocumentApp.Attribute.BOLD] = false;
  textStyle[DocumentApp.Attribute.FONT_SIZE]=11;

  var titleStyle ={};
  titleStyle[DocumentApp.Attribute.FONT_FAMILY] ="Calibri"
  titleStyle[DocumentApp.Attribute.FONT_SIZE]= 10;
  titleStyle[DocumentApp.Attribute.BOLD]=true;
  titleStyle[DocumentApp.Attribute.FOREGROUND_COLOR]="#ff00ff";
  titleStyle[DocumentApp.Attribute.BACKGROUND_COLOR]="#c9daf8";

  var upcomingStyle={};
  upcomingStyle[DocumentApp.Attribute.FONT_FAMILY]="Calibri";
  upcomingStyle[DocumentApp.Attribute.FOREGROUND_COLOR]="#000000";
  upcomingStyle[DocumentApp.Attribute.BOLD] = true;
  upcomingStyle[DocumentApp.Attribute.FONT_SIZE]=11;
  // upcomingStyle[DocumentApp.Attribute.BACKGROUND_COLOR]="#c9daf8";

//-------------------------------Styling-----------------------------------//
  var newBulletinTable = newBulletinBody.getTables();

  //-----------------------inline differentiate styling---------------------------//
  var upComingCombined="";          //text used in setText()

  // ------------ don't need this, just in case -------------- //
  var urlPackage =[];
    for(let i = 0; i <upComingContent.length;i++){
    upComingCombined += upComingContent[i]['content']['text'];

    if(upComingContent[i]['content']['url'].length>0){
      var urlName = upComingContent[i]['content']['url'][0]['text'];
      var urlAddress = upComingContent[i]['content']['url'][0]['url'];
      urlPackage.push({text:urlName,url:urlAddress})
    }
  }
  // ------------ don't need this, just in case -------------- //

  var upComingMessages = newBulletinTable[0].getCell(3,0).setText(upComingCombined.trim())
      upComingMessages.setAttributes(upcomingStyle);

  var upComingMessagesText = upComingMessages.getText();

  for(let i =0; i <studentsNews.length;i++){
    
    let newsSection = newBulletinTable[0].insertTableRow(5+i);

    if(studentsNews[i]['from']['text']=="Student Notices"){
      newsSection.appendTableCell().setText(studentsNews[i]['from']['text']).setAttributes(titleStyle);               // title bar setting
      newsSection.appendTableCell().setText(studentsNews[i]['message']['text']).setAttributes(titleStyle);          //title bar setting
    }else{

   // ----------------------------- multi-link   ----------------------------------//
// ----------------------------- From-link   ----------------------------------//
      if(studentsNews[i]['from']['url'].length >0){
        var fromUrls = studentsNews[i]['from']['url'];

        var fromCell = newsSection.appendTableCell().setText(studentsNews[i]['from']['text']).setAttributes(textStyle);
        for(let i = 0; i < fromUrls.length;i++){
          var urlName = fromUrls[i]['text'];
          var urlTextIndex = fromCell.getText().indexOf(urlName);
          if(urlTextIndex!==-1){
            fromCell.editAsText().setLinkUrl(urlTextIndex,urlTextIndex+urlName.length,fromUrls[i]['url'])
          }
        }
      }else{
         newsSection.appendTableCell().setText(studentsNews[i]['from']['text']).setAttributes(textStyle);     // Build 'From' cell
      }
      // ----------------------------- Message-link   ----------------------------------//
      if(studentsNews[i]['message']['url']!=""){
        var urls = studentsNews[i]['message']['url'];        // get all urls
        
        var messageCell = newsSection.appendTableCell().setText(studentsNews[i]['message']['text']).setAttributes(textStyle);    // build Message text
        var messageCellText = messageCell.getText();

        for(let i = 0; i <urls.length;i++){
          var urlName = urls[i]['text'];              // get url name
          var urlTextIndex = messageCellText.indexOf(urlName);     // locate the url
          try{
            if(urlTextIndex!==-1){
              messageCell.editAsText().setLinkUrl(urlTextIndex,urlTextIndex+urlName.length-1,urls[i]['url']);    
              var urlNameReplacement = "*".repeat(urlName.length);
              messageCellText= messageCellText.slice(0,urlTextIndex)+ messageCellText.slice(urlTextIndex,urlName.length)+urlNameReplacement+messageCellText.slice(urlTextIndex+urlName.length);
              }
          }catch(e){
            console.log(e);
          }

        }
// ---------------------------------- multi-link  ----------------------------------//
      }else{
        newsSection.appendTableCell().setText(studentsNews[i]['message']['text']).setAttributes(textStyle);
      }
    }
  }

//----------------  insert heading(current date) at end(top) -------------------------//
// INSERT HEADER AFTER TABLE(ON TOP) add bulletin into the new broken page;

  let bulletingDateName = `${weekDayEnglish} - ${monthInEnglish} ${todaysDate} - ${currentYear}`;
  var updatedBulletin = bulletinFile.getBody().insertParagraph(0,bulletingDateName);
  var updatedBulletinHeading = updatedBulletin.setHeading(DocumentApp.ParagraphHeading.HEADING3);

// create bulletin headingstyles;
  var style = {};
  style[DocumentApp.Attribute.SPACING_AFTER] = 0;
  style[DocumentApp.Attribute.SPACING_BEFORE] = 0;
  style[DocumentApp.Attribute.FOREGROUND_COLOR]="#0078AA";
// set bulletin styles
  updatedBulletinHeading
  .setAttributes(style)
  .setAlignment(DocumentApp.HorizontalAlignment.CENTER);

}  // end updateStudentBulletin function

