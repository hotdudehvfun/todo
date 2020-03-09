

addEventListeners = () => {

    newListPanelEvents();
    selectedListPanelEvents();
    viewTotalLists();
    viewMoreOptions();
    handleAddAlarmOnTask();
    handleRemoveCompletedTasks();
    handleRemoveAllTasks();
    handleDeleteList();
    handlePastEvent();
    handleSearchEvent();

}







//--------------------------
addtoggleEventOnTaskFavButton = (rootId) => {
    let button = document.querySelector(rootId).querySelector(".toggle-priority-task-button");
    button.addEventListener("click", event => {
        button.classList.toggle("fav_color") == true ? button.innerHTML = "favorite" : button.innerHTML = "favorite_border";
    });
}

//same function for new and current list
handleSaveTaskEvent = (rootId) => {
    $(rootId + " .save-task-button").click(() => {

        let taskContent = $(rootId + " .new-task-content").html().trim();
        let newTask = new Task(taskContent);
        newTask.isPriorityTasked = document.querySelector(rootId + " .toggle-priority-task-button").classList.contains("fav_color");
        newTask.taskIcon = Icons.getTaskIcon(newTask);

        let taskDate = getScheduleDate(rootId);
        if (taskDate.hasError) {
            showToast(taskDate.msg);
        } else
        {
            newTask.dateToBoCompletedBy = taskDate.msg;
        }

        let activePanel;
        let onSuccess=false;
        if (rootId == "#add-task-panel-with-selected-list")
        {
            //no need to create new list
            if (appObject.getSelectedList() != null && taskContent.length>0 && !taskDate.hasError )
            {
                appObject.listArray[appObject.selectedListIndex].taskArray.push(newTask);
                activePanel = document.querySelector("#open-add-new-task-panel")
                showToast("New task added");
                onSuccess=true;
            } else
            {
                if(appObject.getSelectedList()==null)
                {
                    showToast("Problem getting lists...");
                }
                if(taskContent.length==0)
                {
                    showToast("Please write something...");
                }
                if(taskDate.hasError)
                {
                    showToast(taskDate.msg);
                }                  
            }
        } else {
            //create new list and add task to it
            let newListTitle=document.querySelector("#new-list-title").innerText.trim();
            if(newListTitle.length==0)
            {
                showToast("Please give a title to List")
            }else
            {
                let newList = new List(newListTitle);
                newList.taskArray.push(newTask);
                appObject.selectedListIndex = appObject.listArray.push(newList) - 1;
                activePanel = document.querySelector("#open-add-new-list-panel")
                showToast(`Task added to ${newListTitle}`);
                onSuccess=true;
            }
        }
        if(onSuccess)
        {
            appObject.loadList(appObject.selectedListIndex);
            appObject.saveData();
            togglePanelState(rootId, false, activePanel);
        }
});
}

getScheduleDate = (rootId) => {
    let obj =
    {
        msg: "",
        hasError: false
    };
    if (document.querySelector(rootId + " .schedule-message-holder").getAttribute("data-isapplied") == "true") {
        let id = document.querySelector(rootId).getAttribute("data-dateId");
        let temp = $(id).data("DateTimePicker").date()._d;
        let milli = new Date(temp).getTime();
        if (isNaN(milli) || milli == 0) {
            //not a valid format
            obj.msg = "Please select a valid time and date";
            obj.hasError = true;
        }
        else if (milli < Date.now()) {
            obj.msg = "You need to select a time in future";
            obj.hasError = true;
        } else {
            obj.msg = milli;
            obj.hasError = false;
        }
    } else {
        obj.msg = Task.NOT_SCHEDULED;
        obj.hasError = false;
    }
    return obj
}


handleRemoveCompletedTasks = () => {
    document.querySelector("#remove-completed-tasks-button").onclick = () => {
        appObject.removeCompletedTasks();
    }
}

handleRemoveAllTasks = () => {

    document.querySelector("#remove-all-tasks-button").onclick = () => {
        appObject.purgeList();
    }
}

handleDeleteList = () => {

    document.querySelector("#delete-list-button").onclick = () => {
        //show only delete list buttons
        if (appObject.listArray.length > 0) {
            let dist = 70;
            document.querySelectorAll(".more-options-item").forEach((element, index) => {
                if (index < 4) {
                    element.style.bottom = "0px";
                } else {
                    element.style.bottom = dist;
                    dist += 60;
                }
            });
        }
    }

    $("#delete-list-cancel").click(() => {
        //back to normal positions
        let dist = 70;
        document.querySelectorAll(".more-options-item").forEach(element => {
            if (element.classList.contains("skip")) {
                element.style.bottom = "0px";
            } else {
                element.style.bottom = dist;
                dist += 60;
            }
        });
    })

    $("#delete-list-ok").click(() => {
        if (appObject.selectedListIndex >= 0) {
            //close panel
            toggleMoreOptionsState(false);
            //show message removed
            if (appObject.removeList())
                showToast("List Deleted!");
            else
                showToast("Unable to delete list")
        }
    });


}

handleLoadListevent = (index) => {
    try {
        appObject.loadList(index);
        
        //also close panel
        document.querySelector("#view-lists-panel").style.display="none";
        document.querySelector("#block-screen").setAttribute("class", "hide-block-screen");

    } catch (e) { console.log(e) }
}

handlePastEvent=()=>{
    document.querySelector("#new-task-content-1").addEventListener("paste",function(e)
    {
        //e.preventDefault();
        console.log(e);
        
        setTimeout(function(){
            document.querySelector("#new-task-content-1").innerHTML=document.querySelector("#new-task-content-1").innerText.trim();
        },1);
    });

}




function handleSearchEvent()
{
    
    //click button to open dialog
    $("#search-button").click(function()
    {
        if (appObject.listArray.length > 0)
        {
            //show search dialog
            $("#search-dialog").css({
                display:"flex",
                opacity:1,
                bottom:"80px"
            });
            toggleMoreOptionsState(false);
        }
    });

    //close dialog
    $("#search-dialog .close-button").click(function(){
        //back to normal positions
        $("#search-dialog").css({
            display:"none"
        });

        //load last selected list
        appObject.loadList(appObject.selectedListIndex);
    });
    

    //show results
    document.querySelector("#search-text").addEventListener("input",function(){

        //search as when type
        let text=document.querySelector("#search-text").value.trim();
        let searchResultAray=appObject.getSearchResults(text);
        //load search
        loadSearchResults(searchResultAray);
    });
}

function loadSearchResults(items)
{
    console.log(items);
    $("#selectedList").html("Search Results...");
    let parent=document.querySelector("#tasks-container");

    let html="Sorry no results found!!!";
    if(items.length>0)
    {
        html="";
        items.forEach(function(element,index)
        {
            html += `<div id="${element.tempListNo},${element.dateCreated}" class="task"`;
            html += `onClick="handleClickOnTask(this)">`;
            html += `<i class="material-icons">${element.taskIcon}</i>`;
            html += `<span>${element.title.trim()}</span> `;
            html += `</div>`;
        });

    }
    parent.innerHTML=html;
}
