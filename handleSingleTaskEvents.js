let swipe =
{
    style: null,
    isTouched: false,
    startPosition: 0,
    max: 0,
    percent: 0,
    width: 0,
    height: 0
}
let oldClass;
handleTouchStartOnTask = (el) => {
    swipe.isTouched = true;
    swipe.startPosition = event.touches[0].clientX;
    swipe.style = getComputedStyle(el);
    let widthWithPadding = (parseInt(swipe.style.width) - (parseInt(swipe.style.paddingLeft) * 2));
    swipe.max = widthWithPadding;
    swipe.height = 3;//(parseInt(swipe.style.height)*0.6);

    el.querySelector(".dashed").style.height = swipe.height + "px";
    oldClass = el.getAttribute("class");
    console.log(oldClass);
    console.log(swipe.style.height);
}


handleTouchMoveOnTask = (el) => {
    if (swipe.isTouched) {
        // swipe.width=event.touches[0].clientX - el.offsetLeft;
        swipe.width = (event.touches[0].clientX - swipe.startPosition);
        swipe.percent = ((swipe.width / swipe.max) * 100);
        //console.log(swipe.percent);
        if (swipe.percent > 10 && swipe.percent <= 100) {
            el.querySelector(".dashed").style.width = swipe.width;
            //el.style.backgroundSize=`${swipe.percent}% 100%`;
        }
    }
}

handleTouchEndOnTask = (el) => {
    swipe.isTouched = false;
    //on finger up
    console.log(swipe.percent);
    if (swipe.percent > 60)
    {
        showToast("task done");
        appObject.updateTaskState(el.id, true, swipe.max, swipe.height);
        el.querySelector(".dashed").style.width = swipe.max;

        if (oldClass.search("priority") >= 0)
            el.setAttribute("class", "task completed priority")
        else
            el.setAttribute("class", "task completed");

    } else if (swipe.percent > 10 && swipe.percent < 60)
    {
        //showToast("task pending");
        el.querySelector(".dashed").style.width = 0;
        appObject.updateTaskState(el.id, false, 0, swipe.height);
        
        if (oldClass.search("priority") >= 0)
            el.setAttribute("class", "task priority")
        else
            el.setAttribute("class", "task ");
    } else
    {
        el.querySelector(".dashed").style.width = 0;
    }
}


//handl on click task
handleClickOnTask = (el) =>
{   
    openTaskMoreOptions(el);   
}


let currentSelectedTask=null;
function openTaskMoreOptions(el)
{
    let p=document.querySelector(".taskMoreOptionsConatiner");
    if(!p.classList.toggle("hide-task-more-options"))
    {
        //more options visible
        currentSelectedTask=el;
        handleTaskStatusChange(currentSelectedTask);
        document.querySelector("#block-screen").className="";
    }else
    {
        //hidden
        currentSelectedTask=null;
        document.querySelector("#block-screen").className="hide-block-screen";
    }
}

function handleTaskStatusChange(el)
{
    //change menu text when more options are shown
    //if completed
    if(appObject.getTaskState(el.id)==true)
    {
        document.querySelector("#taskChangeStatus").innerHTML="Change to Uncomplete";
    }else if(appObject.getTaskState(el.id)==false)
    {
        document.querySelector("#taskChangeStatus").innerHTML="Set Completed";
    }
    
    //change text of set priority
    if(appObject.getTaskPriority(el.id)==true)
    {
        document.querySelector("#taskChangePriority").innerHTML="Remove Priority";
    }else if(appObject.getTaskPriority(el.id)==false)
    {
        document.querySelector("#taskChangePriority").innerHTML="Set Priority";
    }
}


function taskChangeStatus()
{
    if(currentSelectedTask!=null)
    {   
        let negateState=!appObject.getTaskState(currentSelectedTask.id);
        let changedState= appObject.updateTaskState(currentSelectedTask.id,negateState);
        if(changedState)
        {
            //task complete
            showToast("Task Completed");
        }else if(changedState==false)
        {
            //task still pending
            showToast("Task is still pending");
        }
       closeTaskMoreOptions();
    }
}

function taskChangePriority()
{
    if(currentSelectedTask!=null)
    {   
        let negateState=!appObject.getTaskPriority(currentSelectedTask.id);
        let changedState= appObject.updateTaskPriority(currentSelectedTask.id,negateState);
        if(changedState)
        {
            //task complete
            showToast("Task is on Priority");
        }else if(changedState==false)
        {
            //task still pending
            showToast("Task is not on Priority");
        }
       closeTaskMoreOptions();
    }
}



function taskRemove()
{
    if(currentSelectedTask!=null)
    {   
        appObject.removeTask(currentSelectedTask.id);
        showToast("Task Removed");
        closeTaskMoreOptions();
    }
}


function closeTaskMoreOptions()
{
    document.querySelector("#block-screen").className="hide-block-screen";
    document.querySelector(".taskMoreOptionsConatiner").className="taskMoreOptionsConatiner hide-task-more-options";    
}
