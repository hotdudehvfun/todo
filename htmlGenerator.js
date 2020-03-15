document.addEventListener('DOMContentLoaded', function ()
{
 
  addEventListeners();

});



getHtmlContentForList = (list, index) => {

  let html = "";
  if (list != null && list != undefined)
  {
    html += `<div class="list-panel-item" onclick="handleLoadListevent(${index})">`;
    html+=`<div style='display:flex;justify-content: space-between;'>`;
    if (index == appObject.selectedListIndex)
      html += `<article class="selected">${list.title}</article>`;
    else
      html += `<article>${list.title}</article>`;

      html += `<span class=list-sub-text>${timeSince(list.dateCreated)}</span>`;
    html+=`</div>`;
    html += `<list-progress style="background-size:${List.getListProgress(list)}% 100%"></list-progress>`;
    html += `<span class=list-sub-text>${List.getProgressText('/', list)} tasks done</span>`;
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