let app = angular.module("myapp", []);
//use this to create new properties on previous version
let patchApplied=false;
console.log("version:3.1.0")

app.filter("sanitize", ['$sce', function($sce)
{
  return function(htmlCode){
      return $sce.trustAsHtml(htmlCode);
  }
}]);

app.controller('myctrl', function ($scope, $sce) {

  //for searching made easy
  $scope.getTasksOnly = function()
  {
    var allTasks = [];
    $scope.listArray.forEach(list =>
    {
      allTasks=allTasks.concat(list.taskArray)      
    });
    //console.log(allTasks);
    return allTasks;
  };
  


  $scope.loadList = function (index)
  {

    // a valid list is selected
    if(index>=0)
    {
     
      $scope.taskArray = $scope.listArray[index].taskArray;
      $scope.selectedListName = $scope.listArray[index].title;
      $scope.selectedListIndex = index;
      $scope.pageTitle = $scope.selectedListName;
      console.log($scope.taskArray); 
      
      //hide list view
      document.querySelector("#view-lists").style.display = "none";
      
      //show its content
      document.querySelector("#view-list-items").style.display = "block";
      
      if($scope.moveInProgress)
      {
        //save task to move
        $scope.taskArray.push($scope.noteToMove);
        showToast("Note moved!")
        $scope.moveInProgress=false
        $scope.noteToMove=null;
        $scope.saveData();
      }
      
    }


  }


  $scope.handleBackButton = function () {
    //on back button show notebooks
    //hide notes
    document.querySelector("#view-lists").style.display = "block";
    document.querySelector("#view-list-items").style.display = "none";
    $scope.search="";
    $scope.pageTitle = $scope.defaultPageTitle;
  }

  $scope.init_hammer_touch_events=function()
  {
    var hammertime = new Hammer(document.querySelector("body"));
    //console.log(hammertime)
    hammertime.on('swiperight', function(ev)
    {
      //handle back button here
      $scope.handleBackButton()
    });
  }


  $scope.checkIfEnterPressed=function(e)
  {
    if(e.keyCode==13)
    {
      $scope.handleCreateList()
      e.target.value="";
    }
  }

  $scope.handleCreateList = function ()
  {
    if ($scope.newListName.length > 1)
    {
      let newList = new List($scope.newListName);
      $scope.selectedListIndex = $scope.listArray.push(newList) - 1;
      showToast(`Notebook create:  ${newList.title}`);

      $scope.saveData();
    }
  }


  $scope.handleSaveTask = function () {

    var newTaskContent=document.querySelector("#newTaskContent").innerHTML.trim();
    if (newTaskContent.length > 1 && $scope.selectedListIndex != undefined)
    {
      let newTask = new Task(newTaskContent);
      $scope.listArray[$scope.selectedListIndex].taskArray.push(newTask);
      showToast(`Note added`);

      //close panel and clean up
      $("#newTaskContent").html("");

      //at last save to local storage
      $scope.saveData();
    }
  }


  $scope.saveData = function () {
    //save data about app in local
    let json = angular.toJson($scope.listArray);
    localStorage.appData = json;
    //save selectedListIndex
    localStorage.selectedListIndex = $scope.selectedListIndex;
  }

  $scope.emptyList = handleNoTasksState();


  $scope.handleDeleteList = function () {
    if ($scope.selectedListIndex >= 0) {
      //close panel
      toggleMoreOptionsState(false);
      //show message removed
      showToast("List Deleted!");
      let removedList = $scope.listArray.splice($scope.selectedListIndex, 1);
      $scope.saveData();
      $scope.handleBackButton();

    }
  }

  $scope.handleClickOnTask=function($event,key)
  {
   
    if($scope.mergeInProgress)
    {
      //merge in progress no need to show options
      //merger with selected task
      $scope.taskI=key;
      if($scope.taskI==$scope.oldTaskI)
      {
        showToast("Cannot merge with same Note");
      }else{
        
        //concat selected content at the end
        $scope.taskArray[$scope.taskI].title+="\n"+$scope.taskArray[$scope.oldTaskI].title;
  
        //remove old note now
        $scope.deleteTask($scope.oldTaskI);
        $scope.oldTaskI=-1;
        
        $scope.mergeInProgress=false;
        
        showToast("Merge complete");
        $scope.saveData();
      }
      
    }else
    {
      //key is the index number of note in list
      console.log(key);
      $scope.taskI=key;
      openTaskMoreOptions(); 
      //also get completed status of task to change value of strike out or not
      $scope.task_completed_state=$scope.taskArray[$scope.taskI].isTaskCompleted    
    }
  }

  $scope.deleteTask=function(index)
  {
    let indexToRemove=-1;
    if(index!==undefined)
    {
      //use supplied argument
      indexToRemove=index;
    }else
    {
      //no args try getting selected note
      if($scope.taskI>=0)
      {
        indexToRemove=$scope.taskI;
        $scope.taskI=-1;  
      }
    }
      
    if(indexToRemove!=-1)
    {
      let removed=$scope.taskArray.splice(indexToRemove,1);
      $scope.saveData();
      closeTaskMoreOptions();
      showToast("Note deleted!");
    }else
    {
      showToast("Error while removing note");      
    }    
  }


  $scope.moveTask=function()
  {
    //move to another list
    $scope.noteToMove=$scope.taskArray[$scope.taskI];
    $scope.moveInProgress=true;
    showToast("Tap on List to move note in List");
    closeTaskMoreOptions();
    $scope.handleBackButton();

  }
  
  
  $scope.mergeTask=function()
  {
    //save selected note position
    $scope.oldTaskI=$scope.taskI;
    
    //close panel
    closeTaskMoreOptions();
    
    //show message
    showToast("Tap on note to merge selected note");

    //active merge task in progress
    $scope.mergeInProgress=true;
  }

  $scope.cancelAction=function()
  {
    //cancel move or merge
    $scope.mergeInProgress=false;
    $scope.oldTaskI=-1
    
    $scope.moveInProgress=false;
    $scope.noteToMove=null;
    console.log("action cancelled")
    showToast("Action Cancelled")
  }
  
  $scope.editTask=function()
  {
    //open add box done from event open close nav bar js
    //close more options
    closeTaskMoreOptions();
    
    //set content
    $("#newTaskContent").html($scope.taskArray[$scope.taskI].title)
    
    //change add to edit
    document.querySelector("#confirm-change-button").style.display="block";
    document.querySelector("#add-new-task-ok").style.display="none";
    
  }

  $scope.updateTask=function()
  {
    $scope.taskArray[$scope.taskI].title=document.querySelector("#newTaskContent").innerHTML.trim();
    
    //revert back
    document.querySelector("#confirm-change-button").style.display="none";
    document.querySelector("#add-new-task-ok").style.display="block";
    $("#newTaskContent").html("")
    showToast("Note updated");
    $scope.saveData()
  }

  $scope.cancelNewTask=function()
  {
    document.querySelector("#confirm-change-button").style.display="none";
    document.querySelector("#add-new-task-ok").style.display="block";
    $("#newTaskContent").html("")
  }
  
  $scope.purgeList=function()
  {
    $scope.taskArray=[]
    showToast("List is empty now")
    $scope.saveData();
    closeTaskMoreOptions()
  }


  $scope.strike_out_task=function()
  {

    if($scope.taskI>=0)
    {
      $scope.taskArray[$scope.taskI].isTaskCompleted=!$scope.taskArray[$scope.taskI].isTaskCompleted;
      //also add strike out class
      $scope.saveData();
      closeTaskMoreOptions();
      showToast("Note Strike out!");

    }   
  }


  //define all funcions above init
  $scope.init = function ()
  {
    console.log("init");
    $scope.moveInProgress=false
    $scope.mergeInProgress=false
    $scope.listArray = readData();
    if(patchApplied)
    {
      //if new property added to previous version
      //save these properties now
      $scope.saveData();
    }

    $scope.taskArray = [];
    console.log($scope.listArray);
    $scope.defaultPageTitle = "Notebooks";
    $scope.pageTitle = $scope.defaultPageTitle;
    $scope.taskI=-1;
    $scope.allTasks=$scope.getTasksOnly();
    $scope.init_hammer_touch_events()
  };
  
  $scope.init();

});



function readData() 
{
  try {
    let appData = localStorage.appData;
    if (appData == undefined || appData=="[]")
    {
      return setupDemoList();
    } else
    {
      //load
      let json = JSON.parse(appData);
      // document.querySelector("#back").value=appData;
      //apply border color theme patch
      json=borderColorThemePatch(json);
      return json;
    }
  } catch (error)
  {
    return setupDemoList();
  }
}

function setupDemoList()
{
  let list = new List("Your First Notebook");
  let task = new Task("We have added first note!");
  list.taskArray.push(task);
  return [list];
}

function borderColorThemePatch(json)
{
  json.forEach(item=>
  {
    item.borderColor=item.borderColor || {};
    console.log(item.borderColor)
    if(item.borderColor.length==undefined)
    {
      //newly created property
      //assign random color
      item.borderColor=getRandomColor();
      patchApplied=true;
    }
  })

  return json;
}
