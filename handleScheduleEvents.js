$('#datetimepicker1').datetimepicker({
    minDate: 'now',
    date: new Date(20,10,2020,12,12),
    format: 'DD/MMM/YYYY HH:mm',
});

//picker1 is for with selected list
$("#datetimepicker1").on("dp.change", function () {
    document.querySelector("#st1-message").style.display = "flex";
    document.querySelector("#st1-message").setAttribute("data-isapplied", "true");
    document.querySelector("#st1").innerHTML = document.querySelector("#datetimevalue1").value;
    if (isTimeInPast("#datetimepicker1"))
        showToast("Please select future time!!!");
});






//picker2 is for with new list
$('#datetimepicker2').datetimepicker({
    minDate: 'now'
});

$("#datetimepicker2").on("dp.change", function () {
    document.querySelector("#st2-message").style.display = "flex";
    document.querySelector("#st2-message").setAttribute("data-isapplied", "true");
    document.querySelector("#st2").innerHTML = document.querySelector("#datetimevalue2").value;
});

document.querySelectorAll(".cancel-schedule-button").forEach(button => {

    button.addEventListener("click", event => {
        button.parentElement.setAttribute("data-isapplied", "false");
        button.parentElement.style.display = "none";
        $("#datetimepicker1").data("DateTimePicker").hide();
        $("#datetimepicker2").data("DateTimePicker").hide();
    });
});



isTimeInPast = (pickerId) =>
{
    let time = new Date($(pickerId).data("DateTimePicker").date()._d).getTime();
    return time < Date.now();
}



handleAddAlarmOnTask = () => {
    document.querySelectorAll(".toggleAlarmButton").forEach(button => {
        button.addEventListener("click", event => {
            let pickerId = button.getAttribute("data-dateId");
            console.log(pickerId);
            $(pickerId).data("DateTimePicker").toggle();
            button.classList.toggle("selectedOption");
        });
    });
}


handleRemoveAlarmFromTask = () => {
    document.querySelectorAll(".schedule-message-holder>i").forEach(button => {
        button.addEventListener("click", event => {
            let pickerId = button.getAttribute("data-dateId");
            console.log(pickerId);
            $(pickerId).data("DateTimePicker").toggle();
            button.classList.toggle("selectedOption");
        });
    });
}

setCurrentDateinPicker=()=>
{
    let d = new Date();
    let month = d.getMonth();
    let day = d.getDate();
    let year = d.getFullYear();
    let h=d.getHours();
    if( (h+"").length==1)
        h="0"+h;
    
    let m=d.getMinutes();
    if( (m+"").length==1)
        m="0"+m;
        
    document.querySelector("#datetimevalue1").value=`${day}/${month+1}/${year} ${h}:${m}`;
}