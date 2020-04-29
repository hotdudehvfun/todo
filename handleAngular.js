let app = angular.module("myapp", ['ngSanitize']);
app.controller('myctrl', function ($scope, $sce) {

  $scope.init = function () {
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
    $scope.pageTitle = $scope.defaultPageTitle;
  }

  $scope.handleCreateList = function ()
  {
    if($scope.newListName.length>1)
    {
      let newList = new List($scope.newListName);
      $scope.selectedListIndex=$scope.listArray.push(newList) - 1;
      showToast(`Notebook create:  ${newList.title}`);
      document.querySelector("#add-new-task-with-new-list").style.display="none";
      document.querySelector("#block-screen").setAttribute("class","hide-block-screen");
      $scope.saveData();
    }
  }


  $scope.handleSaveTask = function ()
  {

    if($scope.newTaskContent.length>1 && $scope.selectedListIndex!=undefined)
    {
      let newTask = new Task($scope.newTaskContent);
      $scope.listArray[$scope.selectedListIndex].taskArray.push(newTask);
      showToast(`Note added`);
      document.querySelector("#add-task-panel-with-selected-list").style.display="none";
      document.querySelector("#block-screen").setAttribute("class","hide-block-screen");
      $scope.saveData();
    }
  }


  $scope.saveData=function()
  {
      //save data about app in local
      let json = angular.toJson($scope.listArray);
      localStorage.appData = json;
      //save selectedListIndex
      localStorage.selectedListIndex = $scope.selectedListIndex;
  }

  $scope.emptyList=handleNoTasksState();


  $scope.handleDeleteList=function()
  {
    if ($scope.selectedListIndex >= 0)
    {
        //close panel
        toggleMoreOptionsState(false);
        //show message removed
        showToast("List Deleted!");
        let removedList=$scope.listArray.splice($scope.selectedListIndex,1);
        $scope.saveData();
        $scope.handleBackButton();

    }
  }




});



function readData() {
  try {
    let appData = localStorage.appData;
    if (appData == undefined){
      return -1;
    } else {
      //load
      let json = JSON.parse(appData);
      return json;
    }
  } catch (error) {
    console.log("Error occurred while reading Data" + error);
    return 0;
  }
}