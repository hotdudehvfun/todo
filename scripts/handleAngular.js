let app = angular.module("myapp", []);

console.log("version:3")

app.filter("sanitize", ['$sce', function($sce)
{
  return function(htmlCode){
      return $sce.trustAsHtml(htmlCode);
  }
}]);

app.controller('myctrl', function ($scope, $sce) {

  
  $scope.init = function ()
  {
    console.log("init");
    $scope.listArray = readData();
    $scope.taskArray = [];
    console.log($scope.listArray);
    $scope.defaultPageTitle = "Notebooks";
    $scope.pageTitle = $scope.defaultPageTitle;
  };
  
  $scope.init();
  $scope.loadList = function (index) {
    //appObject.loadList(index);
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

  $scope.handleCreateList = function () {
    if ($scope.newListName.length > 1) {
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

  $scope.handleClickOnTask=function($event)
  {
    $event.stopPropagation();
    console.log($event.target);
    $scope.taskI=$event.target;
    openTaskMoreOptions($event.target);     
  }

  $scope.deleteTask=function()
  {
    let taskI=$scope.selectedTask.getAttribute("data-i");
    console.log(taskI);    
  }
  $scope.moveTask=function(){

  }
  $scope.mergeTask=function(){

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