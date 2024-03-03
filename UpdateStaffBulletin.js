function updateStaffBulletin(){

  var dateInfo = new MyCurrentDateClass();
  var todaysDate = dateInfo.currentDate;
  var currentMonth = dateInfo.currentMonth+1;
  var currentYear = dateInfo.currentYear;
  var monthInEnglish = dateInfo.getCurrentEnglishMonth();
  var weekDayEnglish = dateInfo.getWeekDayEnglishName();
  
  // get template from url
//----------------------------- variables ----------------------------//
  const bulletinSpreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  const setUpSheet = bulletinSpreadSheet.getSheetByName("SETUP").getRange('A2:C10').getValues();
  const bulletinUrl = setUpSheet[3][1];
  const docFileId = bulletinUrl.match(/.*[^-\w]([-\w]{25,})[^-\w]?.*/)[1];
  const templateUrl = setUpSheet[2][1];
  
  const templateUrlHidden = "https://docs.google.com/document/d/your-google-doc-template-id"

  const templateFileId = templateUrl.match(/.*[^-\w]([-\w]{25,})[^-\w]?.*/)[1];

  var currentDateInfo = `${currentYear}-${currentMonth}-${todaysDate}`;

  let todaysNewsSheet = bulletinSpreadSheet.getSheetByName(currentDateInfo);

  if(!todaysNewsSheet){
     createANewTab();
     bulletinSpreadSheet.getSheetByName(currentDateInfo);
  }

//------------------------ Locking the sheet as it expires ----------------------------//

    var sheetProtection = todaysNewsSheet.protect().setDescription(`${currentDateInfo}- Locked`);

    var me = Session.getEffectiveUser();
    sheetProtection.addEditor(me);

    sheetProtection.removeEditors(sheetProtection.getEditors());
    sheetProtection.addEditor("editorOneEMail");
    sheetProtection.addEditor("editorTwoEMail");
    
    if (sheetProtection.canDomainEdit()) {
      sheetProtection.setDomainEdit(false);
    }
    
//----------------------------- preparation ----------------------------//

// prepare bulletin file to start insersion;----------------------------//

  let bulletinFile = DocumentApp.openById(docFileId);
  // break page to clear new space for new bulletin
  bulletinFile.getBody().insertPageBreak(0);

// prepare spreadsheet to get info;----------------------------//

  let endRange = todaysNewsSheet.getLastRow();

  let newsContent = todaysNewsSheet.getRange(`A1:B${endRange}`).getRichTextValues();
  let newsObjectArray =[];

  for(let i = 0; i < newsContent.length;i++){

    if(newsContent[i][0].getText()!==""||newsContent[i][1].getText()!==""){
      //&&newsContent[i][1].getText()!=="" // don't need this part now. 
      let fromWho = newsContent[i][0].getText();      // get Column A - 'from'
  
      let newsText;
      
      if(newsContent[i][1].getText()==""){
         newsText = ""
      }else{
         newsText = newsContent[i][1].getText();    // get Column B - news content
      }
      
// need to use this reducer to grab the url link if there is one.
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

// need to use this reducer to grab the url link if there is one.
      let fromUrlLink = newsContent[i][0].getRuns().reduce((array,e)=>{
        var url = e.getLinkUrl();
        if(url){
          array.push({
            url:url,
            text:e.getText()
          });
        }
        return array;
      },[])
            // console.log(urlLink);
      newsObjectArray.push({from:{text:fromWho,url:fromUrlLink},message:{text:newsText,url:messageUrlLink}});
    }
  }

// get the rows of news ready
  let upComingNewsLength;
    for(let i = 0; i < newsObjectArray.length;i++){
      //loop down the table untill seeing "From":
      if(newsObjectArray[i]['from']['text']=="From"&& newsObjectArray[i]['message']['text']=="Message"){                  // news table(row) starts after "From"and"Message" row;
        upComingNewsLength = i+1;        // so that From and two doesn't get copied in  
      }
  }
  console.log(`Table length: ${upComingNewsLength}`)

// use the cell number of upcoming to determin the loop of upcoming
  //-----------------------------------------------------------------------------//
  let upComingContent=[];

  for(let i = 1; i <upComingNewsLength-1;i++){
    // i=1 is for skipping the first row "Upcoming Events:",
    // upComingNewsLength-1 is for not getting the "From" word
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
  }
  console.log("upComing news length: "+upComingContent.length);

  // then start using upcoming to loop to get the rest content
  let otherNews = [];                        // put news in an array
  for(let i = upComingNewsLength; i <newsObjectArray.length;i++){  // start at 'From' row
    otherNews.push(newsObjectArray[i])          // add news into 'otherNews'
  }

//----------------------------- insert new content  ----------------------------//
//prepare template to copy into newBulletin
  const templateBody = DocumentApp.openById(templateFileId).getBody();
  var templateElementsNum = templateBody.getNumChildren();
  var newBulletinBody = bulletinFile.getBody();

//INSERTING TABLE use loop to copy each element from template  
  for(let i = 0; i <templateElementsNum;i++){
    var element = templateBody.getChild(i).copy();

// detect the tables in bulletin doc and copy/insert into target new bulletin
    if(element.getType() == DocumentApp.ElementType.TABLE){
      let insertBulletinTable = newBulletinBody.insertTable(0,element); 
    }
  }

//-------------------------------Styling----------------------------------//

  var textStyle = {};
  textStyle[DocumentApp.Attribute.FONT_FAMILY]="Calibri";
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
  var urlPackage = [];                // create a array of objects of url/text
  for(let i = 0; i <upComingContent.length;i++){
    upComingCombined += upComingContent[i]['content']['text'];

    if(upComingContent[i]['content']['url'].length>0){
      var urlName = upComingContent[i]['content']['url'][0]['text'];
      var urlAddress = upComingContent[i]['content']['url'][0]['url'];
      urlPackage.push({text:urlName,url:urlAddress})
    }
  }

  var upComingMessages = newBulletinTable[0].getCell(3,0).setText(upComingCombined.trim())
  upComingMessages.setAttributes(upcomingStyle);
  var upComingMessagesText = upComingMessages.getText();


// ---------------- adding in the urls to a paragraph ----------------------//
    for(let i = 0; i < urlPackage.length;i++){
      var urlName = urlPackage[i]['text'];
      var urlTextIndex = upComingMessagesText.indexOf(urlName);
      if(urlTextIndex!==-1){
        upComingMessages.editAsText().setLinkUrl(urlTextIndex,urlTextIndex+urlName.length,urlPackage[i]['url']);

        var urlNameReplacement = "*".repeat(urlName.length);
        upComingMessagesText= upComingMessagesText.slice(0,urlTextIndex)+ upComingMessagesText.slice(urlTextIndex,urlName.length)+urlNameReplacement+upComingMessagesText.slice(urlTextIndex+urlName.length);
      }
    }

  //-----------------------inline differentiate styling---------------------------//
  
  for(let i =0; i <otherNews.length;i++){
    
    let newsSection = newBulletinTable[0].insertTableRow(5+i);

    if(otherNews[i]['from']['text']=="Student Notices" || otherNews[i]['from']['text']=="Today’s News"){

      newsSection.appendTableCell().setText(otherNews[i]['from']['text']).setAttributes(titleStyle);               // title bar setting
      newsSection.appendTableCell().setText(otherNews[i]['message']['text']).setAttributes(titleStyle);          //title bar setting
    }else{
   // ----------------------------- multi-link   ----------------------------------//
// ----------------------------- From-link   ----------------------------------//
      if(otherNews[i]['from']['url'].length >0){
        var fromUrls = otherNews[i]['from']['url'];

        var fromCell = newsSection.appendTableCell().setText(otherNews[i]['from']['text']).setAttributes(textStyle);
        for(let i = 0; i < fromUrls.length;i++){
          var urlName = fromUrls[i]['text'];
          var urlTextIndex = fromCell.getText().indexOf(urlName);
          if(urlTextIndex!==-1){
            fromCell.editAsText().setLinkUrl(urlTextIndex,urlTextIndex+urlName.length,fromUrls[i]['url'])
          }
        }
      }else{
         newsSection.appendTableCell().setText(otherNews[i]['from']['text']).setAttributes(textStyle);     // Build 'From' cell
      }
      // ----------------------------- Message-link   ----------------------------------//
      if(otherNews[i]['message']['url']!=""){
        var urls = otherNews[i]['message']['url'];        // get all urls
        
        var messageCell = newsSection.appendTableCell().setText(otherNews[i]['message']['text']).setAttributes(textStyle);    // build Message text
        var messageCellText = messageCell.getText();

        for(let i = 0; i <urls.length;i++){
          var urlName = urls[i]['text'];              // get url name
          var urlTextIndex = messageCellText.indexOf(urlName);     // locate the url
          
          try{
            if(urlTextIndex!==-1){
              messageCell.editAsText().setLinkUrl(urlTextIndex,urlTextIndex+urlName.length-1,urls[i]['url']);    
              var urlNameReplacement = "*".repeat(urlName.length);
                 //this is to replace used url name with ****s so it'd keep going if it's same name
              messageCellText= messageCellText.slice(0,urlTextIndex)+ messageCellText.slice(urlTextIndex,urlName.length)+urlNameReplacement+messageCellText.slice(urlTextIndex+urlName.length);
              }
          }catch(e){
              console.log(e)
          }

        }
// ---------------------------------- multi-link  ----------------------------------//
      }else{
        newsSection.appendTableCell().setText(otherNews[i]['message']['text']).setAttributes(textStyle);
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
  style[DocumentApp.Attribute.BOLD] = true;
// set bulletin styles
  updatedBulletinHeading
  .setAttributes(style)
  .setAlignment(DocumentApp.HorizontalAlignment.CENTER);
}
// end of function - 

