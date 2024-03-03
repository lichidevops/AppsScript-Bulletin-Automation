function sendStaffBulletin(){
  
  const bulletinSpreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  const setUpSheet = bulletinSpreadSheet.getSheetByName("SETUP").getRange('A2:C15').getValues();
  const folderUrl = setUpSheet[1][1];    
  const staffBulletinFileUrl = setUpSheet[3][1];
  const studentBulletinUrl = setUpSheet[9][1];

  const activated = setUpSheet[0][1];

  const studentActivated = setUpSheet[7][1];

  const staffReceivingParty = setUpSheet[4][1];
  const studentReceivingParty = setUpSheet[10][1];

  const principalMessage = setUpSheet[5][1];
  const messageToStudent = setUpSheet[11][1];

  var dateTime = new MyCurrentDateClass();
  var todaysDate = dateTime.currentDate;
  var currentMonth = dateTime.currentMonth+1;
  var currentYear = dateTime.currentYear;
  var monthInEnglish = dateTime.getCurrentEnglishMonth();
  var weekDayEnglish = dateTime.getWeekDayEnglishName();

  // console.log(staffBulletinFileUrl);
  console.log("Activation: "+activated);

  if(activated =="NO"){
    console.log("Activation: "+activated +"- Detected, No Bulletin");
    return 
  }
  
  var weekDay = dateTime.currentWeekDay;

  if(weekDay === 6 || weekDay === 0){                   // on weekend
    console.log("Activation: "+activated+":" +"Weekend Detected, No Bulletin");
    return
  }else{

  // --------------------------- Creating Bulletin --------------------------- // 
    console.log("Not weekend, Bulletin ongoing")        // on a working day
    
    updateStaffBulletin();                           // create a new staff bulletin
    updateStudentBulletin();                         // create a new student bulletin
    
    console.log("updateStaffBulletin / updateStudentBulletin function went");  
                                                       // self message
  }

  let subjectDate = `${weekDayEnglish}-${monthInEnglish} ${todaysDate}-${currentYear}`;

  // --------------------------- Staff Email Module --------------------------- // 

  var staffMailObject = {};              // create Mail Body Object to package everything
  
  console.log(subjectDate)

  // add a year range : 2022-2023
  let semester = `${currentYear}-${currentYear+1}`;

  if(currentMonth < 6 && currentMonth > 0){
    semester = `${currentYear-1} - ${currentYear}`
  }

  console.log(semester);

  if(staffReceivingParty ==""){
    var staffRecipients = "";
  }else{
    var staffRecipients = staffReceivingParty;           // to whom / receiver
  }

  staffMailObject['to'] = staffRecipients;                  // recipient:
  staffMailObject['subject'] = "Daily Bulletin: "+subjectDate;   // Subject
  staffMailObject['name'] = "Daily Bulletin";
  var linebreak = "<br/><br/>";


  let staffBulletinHTMLurl = "<b><a href='"+staffBulletinFileUrl+"'>Daily Bulletin "+semester+"</a></b>"

// email message body algorithm: 
if(principalMessage!==""){
    staffMailObject['htmlBody'] = "Good morning " + linebreak + principalMessage+ linebreak + staffBulletinHTMLurl;

}else if(principalMessage==""&&dateTime.currentWeekDay === 5){    // if it's Friday
    staffMailObject['htmlBody'] = "Good morning "+ linebreak +"Here's today's Bulletin, Have a great Weekend!"+ linebreak + staffBulletinHTMLurl;

  }else if(principalMessage==""&&dateTime.currentWeekDay === 1){      // if it's Monday
    staffMailObject['htmlBody'] = "Good morning"+ linebreak +"Here's today's Bulletin, Have a great start of the week!"+ linebreak + staffBulletinHTMLurl;

  }else if(principalMessage==""){                          
     // if it's over the week
    staffMailObject['htmlBody'] = "Good morning"+ linebreak +"Here's today's Bulletin, Have a great day" + linebreak + staffBulletinHTMLurl;
  }

// ------------------------------ Send Staff Email function------------------------------- //
  
  MailApp.sendEmail(staffMailObject)         // send email
  console.log('Email to Staff Sent')
  // email is sent



  // --------------------------- Student Email Module --------------------------- // 

  var studentMailObject = {};       // build the mail object
  var studentRecipients;            // initialize mail recipients variable

  let sttudentBulletinHTMLurl = "<b><a href='"+studentBulletinUrl+"'>Upper School Daily Bulletin "+semester+"</a></b>";

  if(studentReceivingParty ==""){
    studentRecipients = 'lchi@dwight.or.kr';
  }else{
    console.log(studentReceivingParty)
    studentRecipients = studentReceivingParty;
  }

  studentMailObject['to'] = studentRecipients;
  studentMailObject['subject'] = "Daily Bulletin: "+subjectDate;
  studentMailObject['name'] = 'Students Daily Bulletin';
  
  if(messageToStudent!==""){
    studentMailObject['htmlBody'] ="Good morning  students: "+ linebreak+ messageToStudent + linebreak + sttudentBulletinHTMLurl;
  }else if(messageToStudent=="" &&dateTime.currentWeekDay === 5){
    studentMailObject['htmlBody'] = "Good morning  students: "+ linebreak +"Here's today's Bulletin" + linebreak + sttudentBulletinHTMLurl + linebreak +"Have a great Weekend!";

  }else if(messageToStudent==""&&dateTime.currentWeekDay === 1){
       studentMailObject['htmlBody'] = "Good morning  students: "+ linebreak +"Here's today's Bulletin"+ linebreak + sttudentBulletinHTMLurl + linebreak +"Have a great start of the week!";

  }else if(messageToStudent==""){                          
     // if it's during the week
    studentMailObject['htmlBody'] = "Good morning  students: "+ linebreak +"Here's today's Bulletin" + linebreak + sttudentBulletinHTMLurl + linebreak + "Have a great day!";;
  }

  console.log(studentMailObject);

  // ------------------------------ Send email function------------------------------- //
  if(studentActivated =="YES"){
    // MailApp send
    if(weekDay === 6 || weekDay === 0){                   // on weekend
      console.log("Weekend Detected, No Bulletin");
      return
    }else{
      MailApp.sendEmail(studentMailObject);
      console.log(`student bulletin activation status: ${studentActivated}, sent`);
    }
  }
}



