  const onOpen=()=>{
  SpreadsheetApp.getUi()
  .createMenu('Options')
  .addItem('Increase To 25 Tabs','createMultipleTabs')
  .addItem('Back up and Remove expired','backUpExpiredOnes')
  .addItem('Manually Send Bulletins','sendStaffBulletin')
  
  .addToUi();
}

//----------------------------- ----------- ----------------------------//


