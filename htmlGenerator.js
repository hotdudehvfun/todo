
document.addEventListener('DOMContentLoaded', function () {
  addEventListeners();
});



getHtmlContentForList = (list, index) => {
  let html = "";
  if (list != null && list != undefined) {
    html += `<div class="list-panel-item" onclick="handleLoadListevent(${index})">`;

    if (index == appObject.selectedListIndex)
      html += `<article class="selected">${list.title}</article>`;
    else
      html += `<article>${list.title}</article>`;

    html += `<list-age>${timeSince(list.dateCreated)}</list-age>`;
    html += `<list-progress style="background-size:${List.getListProgress(list)}% 100%"></list-progress>`;
    html += `<span class="list-progress-text">${List.getProgressText('/', list)} tasks done</span>`;
    //get today and tommorrow upcoming tasks
    let upComingTasks = List.getUpcomingTasks(list, List.PENDING);
    //here i is index and days diff
    upComingTasks.forEach(function (array, key) {
      html += `<div class="list-upcoming-tasks-headline">${key}</div>`;
      html += "<div>";
      array.forEach(function (item) {
        if (!item.task.isTaskCompleted) {
          html += `<div class="upcoming-task-overview">`;
          html += `<i class="material-icons">${item.task.taskIcon}</i>`;
          html += `<span>${item.task.title}</span>`;
          html += `</div>`;
        }
      });
      html += "</div>";
    });
    html += `</div>`;
  }
  return html;
}

handleNoListState=()=>
{
  document.querySelector("#selectedList").style.display="none";
  document.querySelector("list-age").style.display="none";
  
  document.querySelector("#open-view-lists-panel").setAttribute("class","nav-bar-item disabled");
  document.querySelector("#open-more-panel").setAttribute("class","nav-bar-item disabled");
  document.querySelector("#open-add-new-task-panel").setAttribute("class","nav-bar-item disabled");
  
  let html="";
  html+=SVGS.DESERT;
  html+="<no-list-msg>You have no task list!</no-list-msg>";
  html+="<no-list-msg>Lets Create One</no-list-msg>";
  html+=`<no-list-msg onclick="openCreateListFromEmptyState()">Tap to Create</no-list-msg>`;
  document.querySelector("#tasks-container").innerHTML=html;
}


handleNoTasksState=()=>
{
  let html="";
  html+=SVGS.DESERT;
  html+="<no-list-msg>You have no tasks in this list!</no-list-msg>";
  html+="<no-list-msg>Add tasks</no-list-msg>";
  document.querySelector("#tasks-container").innerHTML=html;
}