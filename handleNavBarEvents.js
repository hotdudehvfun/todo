

addEventListeners = () => {

    handleShowHideCreateNewListDialog();
    handleShowHideCreateTaskDialog();
    viewMoreOptions();
    handleRemoveCompletedTasks();
    handleRemoveAllTasks();
    handleDeleteList();
}


function handleShowHideCreateNewListDialog()
{

    let id = "#add-new-task-with-new-list";
    //open
    $("#open-add-new-list-panel").click(function ()
    {
        console.log("clicked on butnew-task-cofffffffn");
        document.querySelector("#add-new-task-with-new-list").setAttribute("class","nav-bar-panel visible");
    });

    //close
    $(id + " .close-button").click(() =>
    {
        document.querySelector("#add-new-task-with-new-list").setAttribute("class","nav-bar-panel");        
    });
}

function handleShowHideCreateTaskDialog()
{

    let id = "#add-task-panel-with-selected-list";
    //open
    $("#open-add-new-task-panel").click(function ()
    {   
        console.log("clicked on button");
        document.querySelector("#open-add-new-task-panel").style.transform="rotate(90deg)";
        document.querySelector("#add-task-panel-with-selected-list").setAttribute("class","nav-bar-panel visible");
    });

    //close
    $(id + " .close-button").click(() =>
    {
        document.querySelector("#open-add-new-task-panel").style.transform="rotate(0deg)";
        document.querySelector("#add-task-panel-with-selected-list").setAttribute("class","nav-bar-panel");        
    });
}






//--------------------------

//same function for new and current list

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

function handleDeleteList()
{
    document.querySelector("#delete-list-button").onclick = () => {
        //show only delete list buttons
            let dist = 70;
            document.querySelectorAll(".more-options-item").forEach((element, index) => {
                if (index <=2)
                {
                    element.style.bottom = "0px";
                } else
                {
                    element.style.bottom = dist;
                    dist += 60;
                }
            });
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

}



