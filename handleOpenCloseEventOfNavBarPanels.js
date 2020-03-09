

newListPanelEvents = () => {

    let id = "#add-new-task-with-new-list";
    //open
    $("#open-add-new-list-panel").click(function ()
    {
        console.log("clicked on button");
        $(this).data('state', !$(this).data('state'));
        togglePanelState(id, $(this).data('state'), this, () => {
            
            //settings to be applied when panel is opened
            $("#new-list-title").html("");
            document.querySelector(id + " .toggle-priority-task-button").innerHTML = "favorite_border";
            $(id + " .new-task-content").html("");

            document.querySelector("#st2-message").setAttribute("data-isapplied", "false");
            document.querySelector("#st2-message").style.display = "none";
            document.querySelector("#st2").innerHTML = "";

        });
    });

    //close
    $(id + " .close-button").click(() => {
        togglePanelState(id, false, document.querySelector("#open-add-new-list-panel"));
    });

    //toggle priority
    addtoggleEventOnTaskFavButton(id);

    //save task with new list
    handleSaveTaskEvent(id);
}


selectedListPanelEvents = () => {

    let id = "#add-task-panel-with-selected-list";
    //open
    $("#open-add-new-task-panel").click(function () {
        console.log("clicked on button");
        if (appObject.listArray.length > 0) {
            $(this).data('state', !$(this).data('state'));
            togglePanelState(id, $(this).data('state'), this, () => {
                $("#add-task-to-this-list").html(appObject.getSelectedList().title);
                document.querySelector(id + " .toggle-priority-task-button").innerHTML = "favorite_border";
                $(id + " .new-task-content").html("");

                document.querySelector("#st1-message").setAttribute("data-isapplied", "false");
                document.querySelector("#st1-message").style.display = "none";
                document.querySelector("#st1").innerHTML = "";
            });
        }else
        {
            showToast("Create a list first!");
        }

    });

    //close
    $(id + " .close-button").click(() => {
        togglePanelState(id, false, document.querySelector("#open-add-new-task-panel"));
    });

    //toggle priority
    addtoggleEventOnTaskFavButton(id);

    //save task with new list
    handleSaveTaskEvent(id);
}

viewTotalLists = () => {
    //open view list panel
    document.querySelector("#open-view-lists-panel").addEventListener("click",function()
    {
        console.log("clicked on button");
        if(appObject.listArray.length>0)
        {
            //console.log(this.getAttribute("data-state"));
            togglePanelState("#view-lists-panel", $(this).data('state'),this, () =>
            {
                //refresh list
                appObject.loadListsInViewPanel();
            });
        }else
        {
            showToast("You have no lists to view!");
        }
    });
}


viewMoreOptions = () => {

    //open view list panel
    $("#open-more-panel").click(function ()
    {
        if(appObject.listArray.length>0)
        {
            //false to hide
            //true to show
            toggleMoreOptionsState();

        }
    });
}

let others = [
    {
        "id": "#add-new-task-with-new-list",
        "trigger": document.querySelector("#open-add-new-list-panel")
    },
    {
        "id": "#add-task-panel-with-selected-list",
        "trigger": document.querySelector("#open-add-new-task-panel")
    },
    {
        "id": "#view-lists-panel",
        "trigger": document.querySelector("#open-view-lists-panel")
    }
];


openCreateListFromEmptyState=()=>
{
    let id="#add-new-task-with-new-list";
    togglePanelState(id,true,document.querySelector("#open-add-new-list-panel"),()=>
    {
            $("#new-list-title").html("");
            document.querySelector(id + " .toggle-priority-task-button").innerHTML = "favorite_border";
            $(id + " .new-task-content").html("");

            document.querySelector("#st2-message").setAttribute("data-isapplied", "false");
            document.querySelector("#st2-message").style.display = "none";
            document.querySelector("#st2").innerHTML = "";
    })
}




//@state:true false
toggleMoreOptionsState = (state) => {
    
    //open options
    open = () => {
        let dist = 70;
        document.querySelectorAll(".more-options-item").forEach(element =>
        {
            if(!element.classList.contains("skip"))
            {
                element.style.bottom = dist;
                dist += 60;
            }
        });

        //close others panels
        others.forEach(item =>
        {
            document.querySelector(item.id).style.display="none";
            item.trigger.setAttribute("class","nav-bar-item");
            
        });

        document.querySelector("#open-more-panel").setAttribute("class", "nav-bar-item selected");
        document.querySelector("#block-screen").setAttribute("class", "");
    }

    close = () => {
        document.querySelector("#block-screen").setAttribute("class", "hide-block-screen");
        document.querySelector("#open-more-panel").setAttribute("class", "nav-bar-item");
        document.querySelectorAll(".more-options-item").forEach(element => {
            element.style.bottom = "0px";
        });
    }

    dialogStates.moreOptions=!dialogStates.moreOptions;
    if(state==undefined)
    {
        state=dialogStates.moreOptions;
    }
    state == true ? open() : close();

}

//same function for three panels
togglePanelState = (id, state, trigger, whatToDO) => {

    open = () => {
        document.querySelector(id).style.display = "flex";
        trigger.setAttribute("class", "nav-bar-item selected")
        $(id).css(
            {
                bottom: "80px",
                opacity: 1
            });
        
        //execute call back
        whatToDO();

        
        //also close other  panels
        others.forEach(item =>
        {
            if (id != item.id)
            {
                document.querySelector(item.id).style.display="none";
                item.trigger.setAttribute("class","nav-bar-item");
            }
        });
        //hide search dialog
        $("#search-dialog").css({display:"none"});

        toggleMoreOptionsState(false);
        document.querySelector("#block-screen").setAttribute("class", "");
    }

    close = () => {
        document.querySelector("#block-screen").setAttribute("class", "hide-block-screen");
        if(trigger.classList.contains("disabled"))
            trigger.setAttribute("class", "nav-bar-item disabled");
        else
            trigger.setAttribute("class", "nav-bar-item");
        
        $(id).css(
            {
                bottom: "60px",
                opacity: 0,
                display:"none"
            });
            document.querySelector(id).style.display = "none";
    }

    if(document.querySelector(id).style.display=="flex")
        close();
    else
        open();
}