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

export function getDayLengthTask(startDate,endDate){
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(Math.abs((startDate - endDate) / oneDay));
    return diffDays;
}
