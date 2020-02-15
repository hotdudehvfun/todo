document.addEventListener("DOMContentLoaded",function(){


handleColorPicker("#add-new-task-with-new-list");
})
handleColorPicker=(rootId)=>
{
    document.querySelector(rootId+" .color-lens").addEventListener("click",function()
    {
        document.querySelector(rootId+" .color-palette").classList.toggle("show-color-palette");

    });
}
