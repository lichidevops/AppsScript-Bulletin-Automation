
class MyCurrentDateClass{

  constructor(){
    this.monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
    this.weekdayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

    this.currentYear = new Date().getFullYear();
    this.currentMonth = new Date().getMonth();
    this.currentDate = new Date().getDate();
    this.currentWeekDay = new Date().getDay();
  }

  getEnglishMonth(month){
    if(!Number.isInteger(month)){
      return false;
    }
    return this.monthNames[month];
  }

  getCurrentEnglishMonth(){
    return this.monthNames[new Date().getMonth()]
  }
  
  getWeekDayEnglishName(){
    return this.weekdayNames[new Date().getDay()]
  }

}
