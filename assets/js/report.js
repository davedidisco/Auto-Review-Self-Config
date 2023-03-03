
////For Report HTML file

const actionSelectElem = document.getElementById("actionSelect");
const apiSelectElem = document.getElementById("apiSelect");
const varSelectElem = document.getElementById("variablesSelect");
const inputSelectElem = document.getElementById("inputSelect");
const downloadElem = document.getElementById("logo");


const actionIElem = document.getElementById("actionInput");
const apiElm = document.getElementById("apiInput");
const varElem = document.getElementById("variablesInput");
const inputElem = document.getElementById("inputInput");


function download(){

let sHTML=document.querySelector("html").innerHTML;
let sName=document.getElementById("flowName").innerHTML;
sHTML=sHTML.replaceAll('assets/','https://wyattdave.github.io/Auto-Review/Auto-Review%20Demos/assets/')
sHTML=sHTML.replaceAll('mu/js/mui.min.js','https://wyattdave.github.io/Auto-Review/Auto-Review%20Demos/mu/js/mui.min.js')

const element = document.createElement('a');
element.setAttribute('href', 'data:text/plain;charset=utf-8,' + 
encodeURIComponent(sHTML));
element.setAttribute('download', sName+'.html');
element.style.display = 'none';
document.body.appendChild(element);
element.click();
document.body.removeChild(element);

}


downloadElem.addEventListener("click", function() {
  download()
});


actionSelectElem.addEventListener("change", function() {
  actionIElem.value="";
  filterActionTable("actionTable","actionInput",-1);
});
apiSelectElem.addEventListener("change", function() {
  apiElm.value="";
  filterActionTable("apiTable","apiInput",-1);
});
varSelectElem.addEventListener("change", function() {
  varElem.value="";
  filterActionTable("variablesTable","variablesInput",-1);
});
inputSelectElem.addEventListener("change", function() {
  inputElem.value="";
  filterActionTable("inputTable","inputInput",-1);
});


actionIElem.addEventListener("change", function() {
  filterActionTable("actionTable","actionInput",actionSelectElem.value);
});

apiElm.addEventListener("change", function() {
  filterActionTable("apiTable","apiInput",apiSelectElem.value);
});

varElem.addEventListener("change", function() {
  filterActionTable("variablesTable","variablesInput",varSelectElem.value);
});

inputElem.addEventListener("change", function() {
  filterActionTable("inputTable","inputInput",inputSelectElem.value);
});




const startClear = document.getElementById("restScroll");
startClear.click();

const variablesElem = document.getElementById("clickVariables");
variablesElem.addEventListener("click", function(e) {
  e.stopPropagation();
  showComments("divVariables");
});

const actionsElem = document.getElementById("clickActions");
actionsElem.addEventListener("click", function(e) {
  e.stopPropagation();
  showComments("divActions");
});

const apiElem = document.getElementById("clickApi");
apiElem.addEventListener("click", function(e) {
  e.stopPropagation();
  showComments("divApi");
});

const inpElem = document.getElementById("clickInput");
inpElem.addEventListener("click", function(e) {
  e.stopPropagation();
  console.log(11)
  showComments("divInput");
});


const exceptElem = document.getElementById("clickExcept");
exceptElem.addEventListener("click", function(e) {
  e.stopPropagation();
  showComments("divExcept");
});

const connectElem = document.getElementById("clickConnect");
connectElem.addEventListener("click", function(e) {
  e.stopPropagation();
  showComments("divConnect");
});

function showComments(sElem){
  let commentsElem=document.getElementById(sElem);

  if(commentsElem.style.display=='block'){
    commentsElem.style.display='none'
  }else{
    commentsElem.style.display='block'
  }
}

function filterActionTable(sTableID,sInputID,col) {
  let i=0;
  let sFilter = document.getElementById(sInputID).value.toUpperCase();
  let tableElem = document.getElementById(sTableID);
  let tr = tableElem.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
 
    if(sFilter=="" || col==-1){
      tr[i].style.display = "";
    }else{
      let td = tr[i].getElementsByTagName("td")[col];
      if (td) {  
        let sTxtValue = td.textContent || td.innerText;
        if (sTxtValue.toUpperCase().indexOf(sFilter) > -1 || (sTxtValue=="" && sFilter==" ")) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }   
    }    
  }
}
