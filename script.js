// Create a "close" button and append it to each list item
var myNodelist;
document.addEventListener('DOMContentLoaded',function()
{
  //createGUI();
  readFromLocal();
  addEventListeners();
});

function addEventListeners()
{

  //on enter press add new element
  document.getElementById('myInput').addEventListener('keyup',function(e)
  {
    if (e.keyCode==13)
    {
      newElement();
    }
  });

  markItem();

}

function removeItem(e)
{
      var div = e.target.parentElement;
      console.log('close',div);
      document.getElementById('myUL').removeChild(div);
      saveToLocal();
}

function createGUI()
{
  //create close buttons
  myNodelist= document.getElementsByTagName("LI");
  var i;
  for (i = 0; i < myNodelist.length; i++)
  {
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    span.addEventListener('click',function(event)
      {
        removeItem(event);
      });
    myNodelist[i].appendChild(span);
  }

}









// Create a new list item when clicking on the "Add" button
function newElement()
{
  if (document.getElementsByTagName('li').length==0)
  {
    document.getElementById('myUL').innerHTML="";
  }
  var li = document.createElement("li");
  var inputValue = document.getElementById("myInput").value;
  var t = document.createElement('span');
  t.innerHTML=inputValue;
  li.appendChild(t);
  if (inputValue === '')
  {
    alert("You must write something!");
  } else
  {
    document.getElementById("myUL").appendChild(li);
  }
  document.getElementById("myInput").value = "";
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  markItem();
  saveToLocal();
}
function markItem()
{
  var list=document.getElementsByTagName('li');
  console.log(list);
  for (var i = 0; i < list.length; i++)
  {
    list[i].addEventListener('click',function(ev)
    {
        if (!ev.target.classList.contains('close'))
        {
          if (ev.target.tagName === 'LI')
          {
            ev.target.classList.toggle('checked');
            ev.target.children[0].classList.toggle('strike');
          }
          if(ev.target.tagName==='SPAN')
          {
            ev.target.parentElement.classList.toggle('checked');
            ev.target.classList.toggle('strike');
          }
        }else
        {
          try{
            document.getElementById('myUL').removeChild(ev.target.parentElement);
          }catch(e){}
        }
        saveToLocal();
    });
  }
}


function saveToLocal()
{
  //check is empty
  if (document.getElementById('myUL').childElementCount==0)
  {
      document.getElementById('myUL').innerHTML="<div class=empty>Hurray!! You have completed everything!</div>";
  }
  localStorage.todolist=document.getElementById('myUL').innerHTML;
}

function readFromLocal()
{
  if (localStorage.todolist==undefined||localStorage.todolist==null)
  {
    document.getElementById('myUL').innerHTML="<div class=empty>Welcome to TO Do Task App!</div>";
  }else
  {
    document.getElementById('myUL').innerHTML=localStorage.todolist.trim();
  }
}