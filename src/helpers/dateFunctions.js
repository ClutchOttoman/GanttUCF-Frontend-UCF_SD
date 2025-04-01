export function monthDiff(firstMonth, lastMonth) {
  let months;
  months = (lastMonth.getFullYear() - firstMonth.getFullYear()) * 12;
  months -= firstMonth.getMonth();
  months += lastMonth.getMonth();
  return months <= 0 ? 0 : months;
}

export function dayDiff(startDate, endDate) {
  const difference =
    new Date(endDate).getTime() - new Date(startDate).getTime();
  const days = Math.ceil(difference / (1000 * 3600 * 24)) + 1;
  return days;
}

export function weekDiff(startMonth,startDate,endDate){
    
    var i = 0;
    var startWeek = new Date(startDate)
    while(true){
        const currentWeekStart = new Date(startMonth)
        currentWeekStart.setDate(currentWeekStart.getDate() + i * 7)
        const currentWeekEnd = new Date(currentWeekStart);
        currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
        currentWeekEnd.setHours(23, 59, 59, 999);
        if(isTaskHappeningInWeek(startDate,endDate,currentWeekStart,currentWeekEnd)){
            startWeek.setDate(currentWeekStart.getDate());
            break;
        }
        else{
            i++;
        }
    }
    let weekDiff = findTaskWeekDuration(startWeek,endDate);
    return weekDiff;

}

function isTaskHappeningInWeek(taskStart, taskEnd, weekStart, weekEnd) {
    taskStart = new Date(taskStart);
    taskEnd = new Date(taskEnd);
    weekStart = new Date(weekStart);
    weekEnd = new Date(weekEnd);
    weekEnd.setHours(23, 59, 59, 999);

    return (
      (taskStart >= weekStart && taskStart <= weekEnd) ||
      (taskEnd >= weekStart && taskEnd <= weekEnd) ||
      (taskStart < weekStart && taskEnd > weekEnd)
    );
  }
  function findTaskWeekDuration(currentWeekStart, endDate){
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
    console.log("dateHelper: " + currentWeekStart);
    let weekDif = 0;

    do{
      weekDif++;
      currentWeekStart.setDate(currentWeekEnd.getDate() + 1);
      currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
    }while(endDate > currentWeekEnd)

    if(endDate > currentWeekStart){
      weekDif++;
    }

    return weekDif;
  }

export function monthDiffPattern(startDate,endDate){
    console.log
}

export function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

export function getDayOfWeek(year, month, day) {
  const daysOfTheWeekArr = ['Mon,', 'Tues,', 'Wed,', 'Thurs,', 'Fri,', 'Sat,', 'Sun,'];
  const dayOfTheWeekIndex = new Date(year, month, day).getDay();
  return daysOfTheWeekArr[dayOfTheWeekIndex];
}

export function createFormattedDateFromStr(year, month, day) {
  let monthStr = month.toString();
  let dayStr = day.toString();

  if (monthStr.length === 1) {
    monthStr = `0${monthStr}`;
  }
  if (dayStr.length === 1) {
    dayStr = `0${dayStr}`;
  }
  return `${year}-${monthStr}-${dayStr}`;
}

export function createFormattedDateFromDate(date) {
  let monthStr = (date.getMonth() + 1).toString();
  let dayStr = date.getDate().toString();

  if (monthStr.length === 1) {
    monthStr = `0${monthStr}`;
  }
  if (dayStr.length === 1) {
    dayStr = `0${dayStr}`;
  }
  return `${date.getFullYear()}-${monthStr}-${dayStr}`;
}

export function getNextDateFromStr(year,month,day){
    var newDay,newMonth,newYear;
    day += 1;
    if(day > getDaysInMonth(year,month)){
        newDay = 0;
        newMonth = month + 1
        if(newMonth > 11){
            newMonth = 0;
            newYear = year+1;
        }
        else{
            newYear = year;
        }
    }
    else{
        newDay = day;
        newMonth = month;
        newYear = year;
    }

    return createFormattedDateFromStr(year,month,day);
}

