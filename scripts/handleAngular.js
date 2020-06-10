let app = angular.module("myapp", []);

console.log("version:3")

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
  
  $scope.init = function ()
  {
    console.log("init");
    $scope.listArray = readData();
    $scope.taskArray = [];
    console.log($scope.listArray);
    $scope.defaultPageTitle = "Notebooks";
    $scope.pageTitle = $scope.defaultPageTitle;
    $scope.taskI=-1;
    $scope.allTasks=$scope.getTasksOnly();
  };
  
  $scope.init();

  $scope.loadList = function (index) {
    //taskArray holds current list loaded in view
    $scope.taskArray = $scope.listArray[index].taskArray;
    $scope.selectedListName = $scope.listArray[index].title;
    $scope.selectedListIndex = index;
    $scope.pageTitle = $scope.selectedListName;
    console.log($scope.taskArray);
    document.querySelector("#view-lists").style.display = "none";
    document.querySelector("#view-list-items").style.display = "block";
  }


  $scope.handleBackButton = function () {
    //on back button show notebooks
    //hide notes
    document.querySelector("#view-lists").style.display = "block";
    document.querySelector("#view-list-items").style.display = "none";
    $scope.search="";
    $scope.pageTitle = $scope.defaultPageTitle;
  }

  $scope.handleCreateList = function ()
  {
    if ($scope.newListName.length > 1)
    {
      let newList = new List($scope.newListName);
      $scope.selectedListIndex = $scope.listArray.push(newList) - 1;
      showToast(`Notebook create:  ${newList.title}`);

      document.querySelector("#open-add-new-list-panel").classList.toggle("rotate");
      document.querySelector("#add-new-task-with-new-list").classList.toggle("visible");
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
      //close panel
      document.querySelector("#open-add-new-task-panel").classList.toggle("rotate");
      document.querySelector("#add-task-panel-with-selected-list").classList.toggle("visible");
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
    //key is the index number of note in list
    console.log(key);
    $scope.taskI=key;
    openTaskMoreOptions();     
  }

  $scope.deleteTask=function()
  {
    if($scope.taskI>=0)
    {
      let removed=$scope.taskArray.splice($scope.taskI,1);
      $scope.taskI=-1;
      $scope.saveData();
      closeTaskMoreOptions();
      showToast("Note deleted!");  
    }else
    {
      showToast("Error while removing note");      
    }
  }
  $scope.moveTask=function(){

  }
  $scope.mergeTask=function(){

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
    document.querySelector("#open-add-new-task-panel").classList.toggle("rotate");
    document.querySelector("#add-task-panel-with-selected-list").classList.toggle("visible");
    
    //revert back as it was to avoid making changes to older functions 
    document.querySelector("#confirm-change-button").style.display="none";
    document.querySelector("#add-new-task-ok").style.display="block";
    $("#newTaskContent").html("")
  }

  $scope.cancelNewTask=function()
  {
    document.querySelector("#confirm-change-button").style.display="none";
    document.querySelector("#add-new-task-ok").style.display="block";
    $("#newTaskContent").html("")
  }
  



  

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