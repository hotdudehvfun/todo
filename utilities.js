
let dialogStates=
{
  "moreOptions":false,
  "createList":false,
  "addTask":false,
  "viewLists":false
}


//@date: milliseconds
timeSince = (date) => {
  let minute = 60;
  let hour = minute * 60;
  let day = hour * 24;
  let month = day * 30;
  let year = day * 365;

  let suffix = ' ago';

  let elapsed = Math.floor((Date.now() - date) / 1000);

  if (elapsed < minute) {
    return 'just now';
  }

  // get an array in the form of [number, string]
  let a = elapsed < hour && [Math.floor(elapsed / minute), 'minute'] ||
    elapsed < day && [Math.floor(elapsed / hour), 'hour'] ||
    elapsed < month && [Math.floor(elapsed / day), 'day'] ||
    elapsed < year && [Math.floor(elapsed / month), 'month'] ||
    [Math.floor(elapsed / year), 'year'];

  // pluralise and append suffix
  return a[0] + ' ' + a[1] + (a[0] === 1 ? '' : 's') + suffix;
}


timeToGo = (date) =>
{
  if(date==Task.NOT_SCHEDULED)
    return "Normal Tasks";

  let minute = 60;
  let hour = minute * 60;
  let day = hour * 24;
  let month = day * 30;
  let year = day * 365;
  let suffix = ' to go ';
  let elapsed = Math.floor((date - Date.now()) / 1000);

  if(elapsed<0)
  {
    return "Past tasks"    
  }
  if (elapsed < minute && elapsed>0)
  {
    return 'in few moments';
  }

  // get an array in the form of [number, string]
  let a = elapsed < hour && [Math.floor(elapsed / minute), 'minute'] ||
    elapsed < day && [Math.floor(elapsed / hour), 'hour'] ||
    elapsed < month && [Math.floor(elapsed / day), 'day'] ||
    elapsed < year && [Math.floor(elapsed / month), 'month'] ||
    [Math.floor(elapsed / year), 'year'];

  // pluralise and append suffix
  return a[0] + ' ' + a[1] + (a[0] === 1 ? '' : 's') + suffix;
}


function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}



Array.prototype.getRandomItem = function () {

  return this[getRandomInt(0, this.length - 1)];
}

getRandomInt = (min, max) => {
  return Math.round((Math.random() * (max - min)) + min);
}

getRandomPlaceHolderForNewTask = () => {
  let randomPlaceHolders = [
    "Remind me to call...",
    "Type new task here",
    "Don't forget to get groceries",
    "Remind to drink water at 4 pm",
    "Remind to wish birthday to my best friend in evening",
    "Need to complete project by thursday"
  ];
  return randomPlaceHolders.getRandomItem();
}


showToast = (msg) => {
  
  document.querySelector(".toast").innerHTML = msg.trim();
  $(".toast").css("z-index", 1000);
  let durationToShow = 500;
  let durationToStay = 1500;
  let durationToHide = 1500;
  $(".toast").animate(
    {
      //first show toast
      opacity: 1
    }, durationToShow, "swing",
    function () {
      //do something when toast is shown
      $(".toast").animate(
        {
          opacity: 1
        }, durationToStay, "swing",
        function () {
          //do something when toast have stayed
          $(".toast").animate(
            {
              opacity: 0
            }, durationToHide, "swing",
            function () {
              //do something when opcaity is 0
              $(".toast").css("z-index", -99);
            }
          );
        });
    }
  );
}


parseBool=(str)=>
{
  return str=="true";
}


function handleScrollShadow(){

  document.querySelector("#tasks-container").addEventListener("scroll",function(e)
  {
    if(this.scrollTop>0)
    {
      document.querySelector("#selected-list-info").style.boxShadow="0px 1px 4px #b8b8b8";
    }else if(this.scrollTop==0)
    {
      document.querySelector("#selected-list-info").style.boxShadow="0px 0px gray";
    }
  })

}