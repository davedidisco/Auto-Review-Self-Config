let svgElm;


const startClear = document.getElementById("load");
startClear.addEventListener("click", function() {
    load();
  });
startClear.click();

let elmIn = document.getElementById("target-zoomIn");
let elmOut = document.getElementById("target-zoomOut");
let elmReset = document.getElementById("target-reset");
let elmKeyIcon = document.getElementById("target-keyIcon");
let elmKey = document.getElementById("target-key");
let elmDetail = document.getElementById("target-detail");

elmIn.addEventListener("click", ZoomIn);
elmOut.addEventListener("click", ZoomOut); 
elmReset.addEventListener("click", ZoomReset); 
elmKeyIcon.addEventListener("click", ShowKey); 

function ShowKey(){
  elmDetail.style="display:none";
  elmKey.style="width:100%; display:block;";
  elmModal.style="display:block";

}

function ZoomIn(){
  let sWidth=svgElm.getAttribute("width");
  let iWidth=parseInt(sWidth.substring(0,sWidth.length-1));
  iWidth=iWidth+10;
  svgElm.setAttribute("width", iWidth+"%");
  elmReset.style="position:fixed; left:300px; top:30px;"
}

function ZoomOut(){
  let sWidth=svgElm.getAttribute("width");
  let iWidth=parseInt(sWidth.substring(0,sWidth.length-1));
  iWidth=iWidth-10;
  svgElm.setAttribute("width", iWidth+"%");
  elmReset.style="position:fixed; left:300px; top:30px;;"
}

function ZoomReset(){
  svgElm.setAttribute("width", "100%");
  elmReset.style="position:fixed; left:300px; top:30px; display:none;"
}

document.querySelector('svg').onclick = function (e) { 
  let sName=e.target.attributes['data-name'].value;
  let oTrigger=JSON.parse(sessionStorage.getItem("trigger"));
  let sModal;
  let sModal2;
  if(sName.substring(0,1)!="*"){
    let aActions=oData.actionArray;
   
    let oAction=aActions.find((item)=>
      item.name.replace(/[":\[|{}()\]]+/g, '')==sName
    )

    sModal="<b>Name:</b> "+oAction.name+"<br><b>ID:</b> "+oAction.id+"<br><b>Type:</b> "+oAction.type+"<br><b>Step: </b>"+oAction.step+"<br><b>Index:</b> "+oAction.index+"<br><b>Detail:</b> "+oAction.detail;
    sModal2="<b>Tier: </b>"+oAction.tier+"<br><b>Filter:</b> "+oAction.filter+"<br><b>Pagination:</b> "+oAction.pagination+"<br><b>Secure: </b>"+oAction.secure+"<br><b>Retry:</b> "+oAction.retry+"<br><b>Detail: </b>"+oAction.timeout;
    if(oAction.imgURL==null){
      document.getElementById("target-image").src="assets/img/autoreview icon 300 v2.png";
    }else{
      document.getElementById("target-image").src=oAction.imgURL;
    }
  }else{
    sModal="<b>Trigger: </b>"+oTrigger.trigger+"<br><b>Parameters: </b>"+oTrigger.triggerParam+"<br><b>Configs: </b>"+oTrigger.triggerConfig;
    sModal2="<br><b>Expession: </b>"+oTrigger.triggerExpress+"<br><b>Inputs: </b>"+oTrigger.triggerInputs+"<br><b>Recurrance: </b>"+oTrigger.triggerRecur;
    document.getElementById("target-image").src="assets/img/autoreview icon 300 v2.png";
  }
    
    document.getElementById("target-modal").innerHTML=sModal;
    document.getElementById("target-modal2").innerHTML=sModal2;

    elmKey.style="display:none";
    elmDetail.style="display:block";
    elmModal.style="display:block";
  
}

 function load() {
    let sSource;
    let elmCanvas = document.getElementById("target-canvas");
    let elmName = document.getElementById("target-flowName");
    let elmId = document.getElementById("target-id");


    elmName.innerHTML=oData.name;
    elmId.innerHTML=oData.id;

    sSource=sDiagram;
    
    //nomnoml.draw(elmCanvas, sSource);
    let a=nomnoml.renderSvg(sSource);
    document.getElementById("target-svgDom").innerHTML=a;
    svgElm=document.getElementsByTagName("svg")[0]
    svgElm.setAttribute("width", "100%");
    svgElm.setAttribute("height","100%");
    console.log("Powered By: https://www.nomnoml.com/",sSource);
    

}

let elmModal = document.getElementById("myModal");
let elmSpan = document.getElementsByClassName("close")[0];

elmSpan.onclick = function() {
  elmModal.style.display = "none";
}


window.onclick = function(event) {
  if (event.target == elmModal) {
    elmModal.style.display = "none";
  }
}

function downloadSVGAsText() {
  const svg = document.querySelector('svg');
  const base64doc = btoa(unescape(encodeURIComponent(svg.outerHTML)));
  const a = document.createElement('a');
  const e = new MouseEvent('click');
  a.download = oData.name;+'.svg';
  a.href = 'data:image/svg+xml;base64,' + base64doc;
  a.dispatchEvent(e);
}

function downloadSVGAsPNG(e){
  const canvas = document.createElement("canvas");
  const svg = document.querySelector('svg');
  const base64doc = btoa(unescape(encodeURIComponent(svg.outerHTML)));
  const w = parseInt(svg.getAttribute('width'));
  const h = parseInt(svg.getAttribute('height'));
  const img_to_download = document.createElement('img');
  img_to_download.src = 'data:image/svg+xml;base64,' + base64doc;
  console.log(w, h);
  img_to_download.onload = function () {
    console.log('img loaded');
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);
    const context = canvas.getContext("2d");
    //context.clearRect(0, 0, w, h);
    context.drawImage(img_to_download,0,0,w,h);
    const dataURL = canvas.toDataURL('image/png');
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(canvas.msToBlob(), sessionStorage.getItem("name")+".png");
      e.preventDefault();
    } else {
      const a = document.createElement('a');
      const my_evt = new MouseEvent('click');
      a.download = sessionStorage.getItem("name")+'.png';
      a.href = dataURL;
      a.dispatchEvent(my_evt);
    }
    //canvas.parentNode.removeChild(canvas);
  }  
}

const downloadSVG = document.getElementById('target-downloadSVG');
downloadSVG.addEventListener('click', downloadSVGAsText);
const downloadPNG = document.getElementById('target-downloadPNG');
downloadPNG.addEventListener('click', downloadSVGAsPNG);