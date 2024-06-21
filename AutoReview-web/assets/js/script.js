let oReport,oLiveReport,sReview,aConnectionTier,oSaved,oSavedDef,oSolution,oDependencies,sDefinition="",sDefinitionParsed="",sCustomList=null,i=0,iWarning=0,iDefinitionFind=0,iDefinitionCount=0,user="",oRatings=oRatingsTemplate,oNaming=oNamingTemplate,aComplexity=aComplexityTemplate,aScoring=aScoringTemplate,oConfigReference=oConfigReferenceTemplate,sSolutionHTML="",bResetStorage=!1,aEnvironmentVar=[];const iResetStorage=8,sHtml='<html><head><meta name="color-scheme" content="dark"></head><body>',regExpNewLine=new RegExp("(?:\r\n|\n\r|\r|\n|  )","gm"),regExpFormat=new RegExp("(?:{|})","gm"),sPrem='<img src="assets/img/premium-32.png" class="smallIcon" />',sPrev='<img src="assets/img/preview-32.png" class="smallIcon" />';let sortOrder;const pLoading=document.getElementById("loading"),spanVersion=document.getElementById("version"),divCSV=document.getElementById("csvDropdown"),divAdmin=document.getElementById("admin"),butReview=document.getElementById("review-button"),butShortcut=document.getElementById("shortcut-button"),divDivider=document.getElementById("solution-divider"),butData=document.getElementById("data-button"),butDefinition=document.getElementById("definition-button"),lSolution=document.getElementById("solution-container"),tSolution=document.getElementById("solution-title"),iLoad=document.getElementById("loadSaved"),divConfig=document.getElementById("admin"),buLiveFlow=document.getElementById("loadLive");function OpenReview(){sessionStorage.setItem("actions",JSON.stringify(oReport.actionArray)),i=sessionStorage.getItem("windowCounter");window.open("","Review"+(new Date).getTime()+i).document.write(sReview),i++,sessionStorage.setItem("windowCounter",i)}function OpenData(){i=sessionStorage.getItem("windowCounter");window.open("","Data"+(new Date).getTime()+i).document.write(sHtml+'<p>Schema:<a href="/Configs/AutoReview-Schema.json">https://wyattdave.github.io/Auto-Review/Config/AutoReview-Schema.json</a></p><pre>'+JSON.stringify(oReport,void 0,2)+"</pre></body></html>"),i++,sessionStorage.setItem("windowCounter",i)}function OpenDefinition(){SaveData(),i=sessionStorage.getItem("windowCounter");window.open("","Definition"+(new Date).getTime()+i).document.write(sHtml+'<p>Schema:<a href="https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#">https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#</a></p><pre>'+JSON.stringify(sDefinitionParsed,void 0,2)+"</pre></body></html>"),i++,sessionStorage.setItem("windowCounter",i)}function review(){}function checkArray(e,t,n){let i=0;for(i=0;i<n.length;i++){if(!Object.hasOwn(n[i],e))return!1;if(!Object.hasOwn(n[i],t))return!1}return!0}function checkRatings(e){return!!Object.hasOwn(e,"complexityAm")&&(!!Object.hasOwn(e,"complexityRe")&&(!!Object.hasOwn(e,"actionsAm")&&(!!Object.hasOwn(e,"actionsRe")&&(!!Object.hasOwn(e,"variablesAm")&&(!!Object.hasOwn(e,"variablesRe")&&(!!Object.hasOwn(e,"exceptionsAm")&&!!Object.hasOwn(e,"exceptionsRe")))))))}function generateReport(e){sReview=sReviewTemplate;let t=0;iWarning=0;const n='<span style="color:orange">&#9888;</span>',o='<span style="color:red">&#10006;</span>';let a="",r=e.name;e.exceptionHandleScope||t++,e.exceptionScope||t++,e.mainScope||t++,1==e.composes?iWarning+=e.composes:e.composes>2&&t++;const l="<p>Com:"+oConfigReference.complexity+" | Rat:"+oConfigReference.ratings+" | Nam:"+oConfigReference.naming+" | Sco:"+oConfigReference.score+"</p>";""!=pLoading.innerHTML&&null!=pLoading.innerHTML&&(r=pLoading.innerHTML.replace("_img src=_assets_img_old flow grey fill.svg__&nbsp;","").replace('<img src="assets/img/old flow grey fill.svg">',""));const s=[e.varNameUse,e.varNaming].every((e=>1==e))||0==e.variables;sReview=sReview.replace("{references}",l),sReview=sReview.replace("{flowName}",r),sReview=sReview.replace("{flowId}",e.id),sReview=sReview.replace("{owner}",e.owner),sReview=sReview.replace("{variable}",s),sReview=sReview.replace("{exception}",e.exceptionScope&&e.exceptionTerminate&&e.exceptionLink),sReview=sReview.replace("{main}",e.mainScope),sReview=sReview.replace("{composes}",e.composes),sReview=sReview.replace("{date}",getToday()),sReview=sReview.replace("{complexity}",e.complexity);let c="";e.premium&&(c=sPrem),sReview=sReview.replace("{premium}",c),e.complexity>oRatings.complexityRe?(sReview=sReview.replace('id="complexity" style="text-align: center; background-color:green;','id="complexity" style="text-align: center; background-color:red;'),iWarning++):e.complexity>oRatings.complexityAm&&(sReview=sReview.replace('id="complexity" style="text-align: center; background-color:green;','id="complexity" style="text-align: center; background-color:orange;'),t++),sReview=sReview.replace("{actions}",e.steps),e.steps>oRatings.actionRe?(sReview=sReview.replace('id="actions" style="text-align: center; background-color:green;','id="actions" style="text-align: center; background-color:red;'),iWarning++):e.steps>oRatings.actionsAm&&(sReview=sReview.replace('id="actions" style="text-align: center; background-color:green;','id="actions" style="text-align: center; background-color:orange;'),t++),sReview=sReview.replace("{variables}",e.variables),e.variables>oRatings.variablesRe?(sReview=sReview.replace('id="variables" style="text-align: center; background-color:green;','id="variables" style="text-align: center; background-color:red;'),iWarning++):e.variables>oRatings.variablesAm&&(sReview=sReview.replace('id="variables" style="text-align: center; background-color:green;','id="variables" style="text-align: center; background-color:orange;'),t++),sReview=sReview.replace("{exceptions}",e.exception),e.exception<=oRatings.exceptionsRe?(sReview=sReview.replace('id="exceptions" style="text-align: center; background-color:green;','id="exceptions" style="text-align: center; background-color:red;'),iWarning++):e.exception<oRatings.exceptions&&(sReview=sReview.replace('id="exceptions" style="text-align: center; background-color:green;','id="exceptions" style="text-align: center; background-color:orange;'),t++);let p='<table class="mui-table mui-table--bordered" id="variablesTable" ><thead><tr><th>Name</th><th>Type</th><th>Value</th><th>Used</th><th>Named</th><th>Constant</th></tr></thead><tbody>';e.variableArray.forEach((e=>{a="",e.local||(iWarning++,a=n),e.used||(t++,a=o),e.named||(t++,a=o),p=p+"<tr><td>"+a+" "+e.name+"</td><td>"+e.type+"</td><td><div contentEditable='true' style='overflow-y:auto; resize:both; background-color:white;'><pre>"+inputFormat(e.value)+"</pre></div></td><td>"+e.used+"</td><td>"+e.named+"</td><td>"+e.local+"</td></tr>"})),p+="</tbody></table>",sReview=sReview.replace("{variablesTable}",p);let d='<table class="mui-table mui-table--bordered"><thead><tr><th>Action</th><th>Name</th><th>Runafter</th></tr></thead><tbody>';e.exceptionArray.forEach((e=>{a="",e.runAfter.includes("TimedOut")||(t++,a=o),d=d+"<tr><td>"+a+" "+e.step+"</td><td>"+e.name+"</td><td>"+e.runAfter+"</td></tr>"})),d+="</tbody></table>",sReview=sReview.replace("{exceptionsTable}",d);let m='<table class="mui-table mui-table--bordered" id="actionTable"><thead><tr><th style="max-width:24%">Name</th><th style="max-width:24%">Type</th><th style="max-width:24%">Run After</th><th style="max-width:24%">Notes</th><th>Nested</th><th>Id</th></tr></thead><tbody>';for(i=0;i<e.actionArray.length;i++)m=m+"<tr><td id='"+e.actionArray[i].hashId+"'><a href='#"+e.actionArray[i].hashId+"-IN'>"+e.actionArray[i].name+"</a></td><td>"+apiLink(e.actionArray[i].type,e.actionArray[i].step,e.actionArray[i].hashId)+"</td><td>"+e.actionArray[i].runAfter+"</td><td><div contentEditable='true' style='max-height=100px; overflow-y:auto; resize:vertical;'><pre>"+e.actionArray[i].notes.replaceAll("<","-").replaceAll("£$","")+"</pre></div></td><td>"+e.actionArray[i].nested+"</td><td>"+e.actionArray[i].index+"</td></tr>";m+="</tbody></table>",sReview=sReview.replace("{actionsTable}",m);let u='<table class="mui-table mui-table--bordered" id="inputTable"><thead><tr><th style="width:24%">Name</th><th style="width:14%">Type</th><th style="width:6%">Env</th><th>Inputs</th></tr></thead><tbody>';e.actionArray.forEach((e=>u=u+"<tr><td id='"+e.hashId+"-IN'><a href='#"+e.hashId+"'>"+e.name+"</a></td><td>"+e.step+"</td><td>"+e.environmentB+"</td><td><div contentEditable='true' style='max-height=100px; overflow-y:auto; resize:vertical;'><pre>"+inputFormat(e.detail)+"</pre></div></td></tr>")),u+="</tbody></table>",sReview=sReview.replace("{inputTable}",u);let g='<table class="mui-table mui-table--bordered"><thead><tr><th>Name</th><th>Id</th><th>Count</th></tr></thead><tbody>';e.connectionArray.forEach((e=>g=g+"<tr><td>"+e.conName+'</td><td style="max-width:200px">'+e.appId+"</td><td>"+e.count+"</td></tr>")),g+="</tbody></table>",sReview=sReview.replace("{connectionsTable}",g);let f='<table class="mui-table mui-table--bordered" id="apiTable"><thead><tr><th>Name</th><th>Type</th><th>Connector</th><th>Filter</th><th>Pagination</th><th>Retry</th></tr></thead><tbody>';e.apiActionArray.forEach((e=>{a="",""==e.filter&&"GetItems"==e.step&&(iWarning++,a=n),""!=e.pagination||"GetItems"!=e.step&&!e.step.includes("ListMyTasks")||(iWarning++,a=n),""==e.retry&&"PatchItem"==e.step&&(iWarning++,a=n),"Standard"!=e.tier&&(""!=a&&(a+=" "),"Premium"==e.tier&&(a+=sPrem)),f=f+"<tr><td id='"+e.hashId+"-API'><a href='#"+e.hashId+"'>"+a+" "+e.name+"</td><td>"+e.step+'</td><td style="max-width:200px">'+e.connector+'</td><td style="max-width:200px; max-height:100px; overflow-y:auto;">'+e.filter+"</td><td>"+e.pagination+'</td><td style="max-width:200px; max-height:100px; overflow-y:auto;">'+e.retry+"</td></tr>"})),f+="</tbody></table>",sReview=sReview.replace("{apiTable}",f);const h=rating(e);let y='<div style="background-color:#EEEEEE"><div style="width:'+h+'%; background-color:{barColour}; color:white; text-align:center">'+h+"</div></div>";y=h<75?y.replace("{barColour}","red"):h<90?y.replace("{barColour}","orange"):y.replace("{barColour}","green"),y=y+'<table class="mui-table mui-table--bordered"><thead><tr><th></th><th></th></tr></thead><tbody><tr><td><h2>Warnings</h2></td><td><h2>'+iWarning+"</h2></td></tr><tr><td><h2>Failures</h2></td><td><h2>"+t+"</h2></td></tr></tbody></table>",sReview=sReview.replace("{ratingBar}",y);let b="<div style='padding-left:10px'<b>Type: "+e.trigger+"</b><br><p><b>Data: </b>"+e.triggerData+"</b><br><p><b>Parameters: </b>"+e.triggerParam.replaceAll("£$","")+"</p><p><b>Configuration:</b> "+e.triggerConfig.replaceAll("£$","")+"</p><b>Inputs:</b> "+e.triggerInputs.replaceAll("£$","")+"</p><p><b>Recurrence: </b>"+e.triggerRecur+"</p><p><b>Expressions:</b> "+e.triggerExpress+"</p></div>";sReview=sReview.replace("{trigger}",b);document.getElementById("actionNotes");let v="";e.actionArray.filter((e=>""!=e.notes&&null!=e.notes)).forEach((e=>{v=v+e.name+": "+e.notes+"\n"})),sReview=sReview.replace("{connectorsTable}","")}function rating(e){let t=0;e.exceptionScope&&e.exceptionTerminate&&e.exceptionLink&&(t+=aScoring.find((e=>"exceptionScope"==e.Name)).Score),e.mainScope&&(t+=aScoring.find((e=>"mainScope"==e.Name)).Score),e.varNaming&&(t+=aScoring.find((e=>"varNaming"==e.Name)).Score),e.varNameUse&&(t+=aScoring.find((e=>"varUsed"==e.Name)).Score),e.varNameConsts&&(t+=aScoring.find((e=>"varConstant"==e.Name)).Score);let n=aScoring.find((e=>"composes"==e.Name)).Score-e.composes*aScoring.find((e=>"composesDeduction"==e.Name)).Score;n<0&&(n=0),t+=n;let i,o=aScoring.find((e=>"variables"==e.Name)).Score-e.variables*aScoring.find((e=>"variablesDeduction"==e.Name)).Score;o<0&&(o=0),t+=o,i=e.connectionRefs>aScoring.find((e=>"connectionsMin"==e.Name)).Score?aScoring.find((e=>"connections"==e.Name)).Score-(e.connectionRefs-aScoring.find((e=>"connectionsMin"==e.Name)).Score)*aScoring.find((e=>"connectionsDeduction"==e.Name)).Score:aScoring.find((e=>"connections"==e.Name)).Score,i<0&&(i=0),t+=i;let a=aScoring.find((e=>"complexityGreen"==e.Name)).Score;e.complexity>oRatings.complexityRe?a=aScoring.find((e=>"complexityRed"==e.Name)).Score:e.complexity>oRatings.complexityAm&&(a=aScoring.find((e=>"complexityAmber"==e.Name)).Score),t+=a;let r=aScoring.find((e=>"actionsGreen"==e.Name)).Score;return(e.steps>oRatings.actionRe||e.steps>oRatings.actionsAm)&&(r=aScoring.find((e=>"actionsAmber"==e.Name)).Score),t+=r,t}function getToday(){let e=new Date;return[e.getFullYear(),e.getMonth()+1,e.getDate()].join("/")}let result;function apiLink(e,t,n){return"OpenApiConnection"==e?"<a href='#"+n+"-API'>"+t+"</a>":t}function inputFormat(e){if(null==e||null==e)return"";let t=e.replaceAll("<","&lt;").replaceAll("£$","");return t=t.replace(/\\n/g,"\n"),t=t.replace(/\\r/g,""),t=t.replace(/\\t/g,""),t.replaceAll("{","{ \n").replaceAll("}","} \n")}function listSolution(e){let t=sSolutionTemplate,n="",i="",o="";if(t=t.replace("{flowName}",oDependencies.ImportExportXml.SolutionManifest.UniqueName),t=t.replace("{flowId}",oDependencies.ImportExportXml.SolutionManifest.Version),t=t.replace("{owner}",oDependencies.ImportExportXml.SolutionManifest.Publisher.UniqueName),t=t.replace("{date}",getToday()),e.ConnectionRefs.length>0&&(console.log(e.ConnectionRefs),o='<table class="mui-table mui-table--bordered"><thead><tr><th>Name</th><th>Type</th><th>id</th><th>Cusomizable</th></tr></thead><tbody>',e.ConnectionRefs.forEach((e=>{let t=1==e.iscustomizable;o=o+"<tr><td>"+e.connectionreferencedisplayname+"</td><td>"+e.connectorid.split("/apis/")[1]+"</td><td>"+e.connectionreferencelogicalname+"</td><td>"+t+"</td></tr>"})),o+="</tbody></table>"),null!=oDependencies?.ImportExportXml?.SolutionManifest?.MissingDependencies?.MissingDependency){let e=oDependencies.ImportExportXml.SolutionManifest.MissingDependencies.MissingDependency;e&&(n='<table class="mui-table mui-table--bordered"><thead><tr><th>Name</th><th>Type</th><th>Dependent</th></tr></thead><tbody>',e.forEach((e=>{n=n+"<tr><td>"+e.Required.displayName+"</td><td>"+e.Required.type+"</td><td>"+e.Dependent.displayName+"</td></tr>"})),n+="</tbody></table>")}return aEnvironmentVar.length>0&&(i='<table class="mui-table mui-table--bordered"><thead><tr><th>Name</th><th>Type</th><th>Cusomizable</th></tr></thead><tbody>',aEnvironmentVar.forEach((e=>{let t=1==e.environmentvariabledefinition.iscustomizable;i=i+"<tr><td>"+e.environmentvariabledefinition.displayname.default+"</td><td>"+e.environmentvariabledefinition.type+"</td><td>"+t+"</td></tr>"})),i+="</tbody></table>"),t=t.replace("{connectionsTable}",o),t=t.replace("{variablesTable}",i),t=t.replace("{dependenciesTable}",n),t=t.replace("{json}",JSON.stringify(e,void 0,2)),t}async function fetchAPIData(e,t){try{const n={headers:{Authorization:t}},i=await fetch(e,n);if(!i.ok)throw new Error(`HTTP error! status: ${i.status}`);return await i.json()}catch(e){console.error("Error fetching API data:",e)}}document.getElementById("review-button").addEventListener("click",OpenReview),document.getElementById("data-button").addEventListener("click",OpenData),document.getElementById("definition-button").addEventListener("click",OpenDefinition),(()=>{if("undefined"==typeof TransformStream){const e=document.createElement("script");e.src="lib/web-streams-polyfill.min.js",document.body.appendChild(e)}const e={getEntries:(e,t)=>new zip.ZipReader(new zip.BlobReader(e)).getEntries(t),getURL:async(e,t)=>URL.createObjectURL(await e.getData(new zip.BlobWriter,t))};(()=>{const t=document.getElementById("file-input"),n="utf-8",i=document.getElementById("file-input-button"),o="";let a,r;async function l(t,n){try{const i=await e.getURL(t,{password:o.value,onprogress:(e,t)=>{unzipProgress.value=e,unzipProgress.max=t}});$.ajax({url:i,success:function(e){if("flow"==n){sDefinitionParsed=JSON.parse(e),butReview.style="display:block;  width:100%;",butDefinition.style="width:100%; display:block",oReport=null;let t="";if(request.fileName.match(regExpFileID)&&(t=request.fileName.match(regExpFileID)[0]),oReport=CreateReview(e,"unknown",t,aComplexity,oNaming,aConnectionTier,""),""==oReport.error){if(pLoading.innerHTML='<img src="assets/img/old flow grey fill.svg"/>&nbsp;'+oReport.name,"unknown"==oReport.name&&null!=sCustomList){let e;try{e=sCustomList.ImportExportXml.Workflows.Workflow.find((e=>e.WorkflowId.toUpperCase()=="{"+oReport.id+"}".toUpperCase()))}catch(t){e=sCustomList.ImportExportXml.Workflows.Workflow}null!=e&&(pLoading.innerHTML='<img src="assets/img/old flow grey fill.svg"/>&nbsp;'+e.Name,oReport.name=e.Name)}oSavedDef=sDefinitionParsed,oSaved=oReport,generateReport(oReport),butReview.style="display:block;  width:100%;",butData.style="display:block;",spanVersion.style="display:none;",divCSV.style="display:block; width:100%;",divAdmin.style="display:none;"}else pLoading.innerHTML=oReport.error,spanVersion.style="display:block;",divCSV.style="display:none;"}else if("customizations"==n){sCustomList=xmlToJson.parse(e);let t="",n="",i="",o="",a="",r="",l="";t=null!=sCustomList?.ImportExportXml?.connectionreferences?.connectionreference?sCustomList.ImportExportXml.connectionreferences.connectionreference:[],n=null!=sCustomList?.ImportExportXml?.Entities?.Entity?sCustomList.ImportExportXml.Entities.Entity:[],i=null!=sCustomList?.ImportExportXml?.FieldSecurityProfiles?.FieldSecurityProfile?sCustomList.ImportExportXml.FieldSecurityProfile.FieldSecurityProfiles:[],o=null!=sCustomList?.ImportExportXml?.CanvasApps?.CanvasApp?sCustomList.ImportExportXml.CanvasApps.CanvasApp:[],a=null!=sCustomList?.ImportExportXml?.CustomControls?.CustomControl?sCustomList.ImportExportXml.CustomControls.CustomControl:[],r=null!=sCustomList?.ImportExportXml?.Roles?.Role?sCustomList.ImportExportXml.Roles.Role:[],l=null!=sCustomList?.ImportExportXml?.Languages?.Language?sCustomList.ImportExportXml.Languages.Language:"",oSolution={Flows:sCustomList.ImportExportXml.Workflows.Workflow,ConnectionRefs:t,Tables:n,SecurityProfile:i,CanvasApps:o,CustomControls:a,Roles:r,LanguageCode:l}}else if("solution"==n)oDependencies=xmlToJson.parse(e);else if("environmentVar"==n)aEnvironmentVar.push(xmlToJson.parse(e));else if("complexity"==n){pLoading.innerHTML=pLoading.innerHTML.replace("No Flows Found in Zip","<b>Config Updates:</b>");let t=JSON.parse(e).aComplexityTemplate;checkArray("Name","Complexity",t)?(console.log("complex"),oConfigReference={...oConfigReference,complexity:JSON.parse(e).sReference},aComplexity=t,pLoading.innerHTML=pLoading.innerHTML+"<p>Complexity Config Updated</p>"):(pLoading.innerHTML=pLoading.innerHTML+"<p>Complexity Config Failed, please check JSON</p>",pLoading.style.color="red")}else if("naming"==n){pLoading.innerHTML=pLoading.innerHTML.replace("No Flows Found in Zip","<b>Config Updates:</b>");let t=JSON.parse(e).oNamingTemplate;checkArray("Type","Letter",t.data)&&Object.hasOwn(t,"char")?(console.log("naming"),oConfigReference={...oConfigReference,naming:t.sReference},oNaming=t,pLoading.innerHTML=pLoading.innerHTML+"<p> Naming Config Updated</p>"):(pLoading.innerHTML=pLoading.innerHTML+"<p> Naming Config Failed, please check JSON</p>",pLoading.style.color="red")}else if("scoring"==n){pLoading.innerHTML=pLoading.innerHTML.replace("No Flows Found in Zip","<b>Config Updates:</b>");let t=JSON.parse(e).aScoringTemplate;checkArray("Name","Score",t)&&20==t.length?(console.log("scoring"),oConfigReference={...oConfigReference,score:JSON.parse(e).sReference},aScoring=t,pLoading.innerHTML=pLoading.innerHTML+"<p>Scoring Config Updated</p>"):(pLoading.innerHTML=pLoading.innerHTML+"<p>Scoring Config Failed, please check JSON</p>",pLoading.style.color="red")}else if("ratings"==n){pLoading.innerHTML=pLoading.innerHTML.replace("No Flows Found in Zip","<b>Config Updates:</b>");let t=JSON.parse(e).oRatingsTemplate;checkRatings(t)?(console.log("rating"),oConfigReference={...oConfigReference,ratings:JSON.parse(e).sReference},oRatings=t,pLoading.innerHTML=pLoading.innerHTML+"<p>Ratings Config Updated</p>"):(pLoading.innerHTML=pLoading.innerHTML+"<p>Ratings Config Failed, please check JSON</p>",pLoading.style.color="red")}}}).fail((function(e){pLoading.innerHTML="Unexpected Error: "+e.responseText}))}catch(e){pLoading.innerHTML="Unexpected Error: "+e,pLoading.style.color="red"}}t.onchange=async function(){try{i.disabled=!0,n.disabled=!0,r=t.files[0],pLoading.style.color=null,pLoading.innerHTML="Loading.....",await async function(t){if(sSolutionHTML="",pLoading.innerHTML="Loading...",a=await e.getEntries(r,{filenameEncoding:t}),a&&a.length){lSolution.style="display: none",divDivider.style="display: none",tSolution.style="display: none",lSolution.innerHTML="",sCustomList=null,oSolution=null,iDefinitionFind=0,iDefinitionCount=0;const e=Boolean(!a.find((e=>!e.filenameUTF8))),i=Boolean(a.find((e=>e.encrypted)));n.value=e?"utf-8":t||"cp437",n.disabled=e,o.value="",o.disabled=!i,a.forEach(((e,t)=>{if(e.filename.includes("definition.json")||e.filename.includes("Workflows/")){if(iDefinitionFind==iDefinitionCount){pLoading.innerHTML="Flow Found...Loading...",l(e,"flow");let n=document.createElement("li");n.innerHTML=e.filename.replace("Workflows/","").split("-")[0],n.value=t,lSolution.appendChild(n),n.addEventListener("click",(function(){l(a[this.value],"flow")}))}else{tSolution.style="display: block",divDivider.style="display: block",lSolution.style="display: block; height:124px; overflow-y:auto; overflow-x:hidden";const n=document.createElement("li"),i=document.createTextNode(e.filename.replace("Workflows/","").split("-")[0]);n.appendChild(i),n.value=t,lSolution.appendChild(n),n.addEventListener("click",(function(){l(a[this.value],"flow")}))}iDefinitionCount++}else e.filename.includes("customizations.xml")?l(e,"customizations"):e.filename.includes("solution.xml")?l(e,"solution"):e.filename.includes("environmentvariabledefinition.xml")?l(e,"environmentVar"):e.filename.includes("complexityConfig.json")?l(e,"complexity"):e.filename.includes("namingConfig.json")?l(e,"naming"):e.filename.includes("scoringConfig.json")?l(e,"scoring"):e.filename.includes("ratingsConfig.json")&&l(e,"ratings")}))}0==iDefinitionCount&&(pLoading.innerHTML="No Flows Found in Zip")}()}catch(e){pLoading.innerHTML=e}finally{i.disabled=!1,t.value=""}},i.onclick=()=>t.dispatchEvent(new MouseEvent("click"))})()})(),$.ajax({url:urlConnectors,success:function(e){aConnectionTier=JSON.parse(e).value}}).fail((function(e){aConnectionTier=null}));let sActiveTab,owner="",aActionReturn=[],sFlowAPI="",sAPIflow="";const regExFlow=new RegExp("/flows/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"),regExEnvir=new RegExp("/environments/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"),regExEnvirD=new RegExp("/environments/Default-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}");function CreateReview(e,t,n,i,o,a,r,l){let s;const c=new RegExp("@parameters(.*?)\\)","gm"),p=new RegExp("@{parameters(.*?)\\)","gm");aActionReturn.length=0;let d=[],m=[],u=[],g=[],f=[],h="unknown",y="none",b="none",v="none",w="none",R="none",x="none";""!=r&&null!=r||(r="please input"),s=JSON.parse(e),null!=s.properties?.displayName?(t=s.properties.displayName,n=s.name):null!=s.name&&(n=s.name);const S=getChildren(s.properties.definition,new Array,0,"root");Object.keys(s.properties.definition.triggers).forEach((e=>{value=s.properties.definition.triggers[e],h=e,null!=value?.inputs?.schema&&(y=JSON.stringify(value.inputs)),null!=value?.inputs?.parameters&&(y=JSON.stringify(value.inputs)),null!=value?.inputs?.parameters&&(b=JSON.stringify(value.inputs.parameters)),null!=value?.recurrance&&(x=e.recurrance),null!=value?.conditions&&null!=value.conditions[0]?.expression&&(w=value.conditions[0].expression),null!=value?.inputs?.schema?.properties&&(R=JSON.stringify(value.inputs.schema.properties)),null!=value?.runtimeConfiguration&&(v=JSON.stringify(value.runtimeConfiguration))})),S.forEach(((e,t)=>{let n="MISSING";null!=e.metadata?.operationMetadataId&&(n=e.metadata.operationMetadataId);let o="",r="",l="";"OpenApiConnection"==e.type?(o=e.inputs.host.operationId,r=e.inputs.host.connectionName,l=e.inputs.host.apiId):(OpenApiConnection=e.type,o=e.type);let s="Standard",d=null;if(""!=r){let e=a.find((e=>e.name.includes(r.substring(0,r.length-2).trim())));"shared_sendmail"==r||"shared_teams"==r?s="Standard":null!=e?(s=e.properties.tier,d=e.properties.iconUri):s="Premium"}let m="",u="|",g="Non-Exception";null==e.runAfter&&(e.runAfter=e.parent);let h;Object.keys(e.runAfter).forEach((t=>{u+=t+"|",m=t+":"+JSON.stringify(e.runAfter[t]).replaceAll(","," | "),JSON.stringify(e.runAfter[t]).includes("Failed")&&(g="Exception")})),"|"==u&&0==e.nestedLevel&&(u="|trigger|"),"|"==u&&0!=e.nestedLevel&&(u="|"+e.parent+"|"),m.length>1&&(m=m.substring(0,m.length-1));let y=i.find((t=>t.Name.includes(o+r)||t.Name==e.type));h=null!=y?Number(y.Complexity):1;let b="";null!=e?.inputs?.parameters?.$filter&&(b=e.inputs.parameters.$filter);let v="",w="";null!=e?.inputs?.retryPolicy&&(v=e.inputs.retryPolicy.type,w=JSON.stringify(e.inputs.retryPolicy));let R="";null!=e?.runtimeConfiguration?.paginationPolicy&&(R=e.runtimeConfiguration.paginationPolicy.minimumItemCount);let x="";null!=e?.runtimeConfiguration?.secureData&&(x=JSON.stringify(e.runtimeConfiguration.secureData));let S="";null!=e?.limit?.timeout&&(S=e.limit.timeout);let L="";null!=e?.description&&(L=e.description);let C=e;C.hasOwnProperty("actions")&&delete C.actions;let N=JSON.stringify(C).match(c),E=!1;N&&(N=N.filter((e=>"@parameters('$authentication')"!=e)),N.length>0&&(E=!0)),E||(N=JSON.stringify(C).match(p),N&&(N=N.filter((e=>"@{parameters('$authentication')"!=e)),N.length>0&&(E=!0)));let T="";e.nestedLevel>0&&(T="Internal");let A="";A=null==e.inputs?"":e.inputs.hasOwnProperty("parameters")?JSON.stringify(e.inputs.parameters):JSON.stringify(e.inputs),e.hasOwnProperty("foreach")&&(A=JSON.stringify(e.foreach)),e.hasOwnProperty("expression")&&(A=JSON.stringify(e.expression));let I={name:e.operationName,step:o,type:e.type,id:n,hashId:n+"###"+(t+1),tier:s,connector:r,imgURL:d,runAfter:m.replace(/[\[\]""]/g,""),exception:g,index:t+1,object:e,complexity:h,detail:A,filter:b,pagination:R,secure:x,retry:v,timeout:S,position:u,positionInfo:T,environmentVariables:JSON.stringify(N),environmentB:E,notes:L,parent:e.parent,apiId:l,branch:e.branch};aActionReturn.push(I),I={step:o,connector:r,name:e.operationName,id:n,hashId:n+"###"+(t+1),object:JSON.stringify(e),type:e.type,index:t+1,parent:e.parent},f.push(I)})),aActionReturn.forEach((e=>{if("|trigger|"==e.position)e.positionIndex="|0",e.positionType="|trigger",e.nested="";else{e.positionIndex="",e.positionType="",e.nested="";aActionReturn.filter((t=>e.position.includes("|"+t.name+"|"))).forEach((t=>{e.positionIndex+="|"+Number(t.index),e.positionType+="|"+t.type;let n=getNesting(e.parent)+"";"|0"==n.substring(n.length-2,2)&&(n=n.substring(0,n.length-2)),"0"!=n&&null!=n&&null!=n&&"undefined"!=n||(n=""),e.nested=n}))}}));const L=aActionReturn.filter((e=>null!=e.detail&&null!=e.detail&&"InitializeVariable"!=e.type));let C,N,E;S.filter((e=>"InitializeVariable"==e.type)).forEach((e=>{let t="",n=!1,i=!1;const a=e.inputs.variables[0],r=L.filter((e=>"string"==typeof e.detail&&e.detail.includes(a.name)));o.data.filter((e=>e.Type==a.type)).length>0&&(t=o.data.find((e=>e.Type==a.type)).Letter),a.name.substring(0,o.char)==t&&(n=!0),""!=a.value&&null!=a.value&&null!=a.value?a.name.substring(1,a.name.length-1)===a.name.substring(1,a.name.length-1).toUpperCase()&&(i=!0):i=!0;let l="";l=isObject(a.value)?JSON.stringify(a.value):null==a.value?"":a.value+"",null==a.value&&(a.value=""),d.push({name:a.name,type:a.type,value:l,used:r.length>0,named:n,local:i})})),getDistinct(aActionReturn).forEach((e=>{const t=aActionReturn.find((t=>t.connector==e));m.push({conName:e,appId:t.apiId,opId:t.step,count:aActionReturn.filter((t=>t.connector==e)).length})})),g=aActionReturn.filter((e=>"OpenApiConnection"==e.type)),u=aActionReturn.filter((e=>"Exception"==e.exception)),C=0==d.length||d.every((e=>!0===e.named)),N=0==d.length||d.every((e=>!0===e.local)),E=0==d.length||d.every((e=>!0===e.used));let T=u.filter((e=>"Exception"==e.name)),A=!1,I=!1;return T&&(A=T.length>0&&JSON.stringify(T[0].object).includes("Terminate"),I=T.length>0&&(JSON.stringify(T[0].object).includes("concat('https://make.powerautomate.com/manage/environments/', workflow()?['tags']?['environmentName']")||JSON.stringify(T[0].object).includes("concat('https://make.powerautomate.com/manage/environments/',workflow()?['tags']?['environmentName']"))),aActionReturn.forEach((e=>{delete e.object,delete e.apiId;let t=aActionReturn.find((t=>t.name==e.parent));null!=t&&"If"!=t.type&&"Switch"!=t.type&&(e.branch="")})),{name:t,id:n,environment:l,owner:r,trigger:h,triggerData:b,triggerParam:y,triggerConfig:v,triggerExpress:w,triggerInputs:R,triggerRecur:x,premium:!aActionReturn.every((e=>"Standard"===e.tier)),connectionRefs:m.length,connectors:g.length,steps:aActionReturn.length,variables:d.length,complexity:sumObj(aActionReturn,"complexity"),varNaming:C,varNameConsts:N,varNameUse:E,composes:aActionReturn.filter((e=>"Compose"==e.type)).length,exception:u.length,exceptionHandleScope:u.filter((e=>"Scope"==e.step)).length>0,exceptionScope:T.length>0,exceptionTerminate:A,exceptionLink:I,mainScope:aActionReturn.filter((e=>"Main"==e.name)).length>0,variableArray:d,actionArray:aActionReturn,apiActionArray:g,exceptionArray:u,connectionArray:m,error:"",actionObjectArray:f}}function getNesting(e){let t;if("root"!=e){let n=aActionReturn.find((t=>t.name==e));t=n.index,"root"!=n.parent&&(t+="|"+getNesting(n.parent))}return t}function getChildren(e,t,n,i){if(null!=e?.actions){Object.keys(e.actions).forEach((o=>{let a=e.actions[o];a.operationName=o,a.nestedLevel=n,a.parent=i,a.branch="Yes",t.push(a),t=getChildren(a,t,n+1,o)}))}if(null!=e?.else){Object.keys(e.else.actions).forEach((o=>{let a=e.else.actions[o];a.operationName=o,a.nestedLevel=n,a.parent=i,a.branch="No",t.push(a),t=getChildren(a,t,n+1,o)}))}if(null!=e?.cases){Object.keys(e.cases).forEach((o=>{let a=e.cases[o];Object.keys(a.actions).forEach((a=>{let r=e.cases[o].actions[a];r.operationName=a,r.nestedLevel=n,r.parent=i,r.branch=o,t.push(r),t=getChildren(r,t,n+1,a)}))}));Object.keys(e.default.actions).forEach((o=>{let a=e.default.actions[o];a.operationName=o,a.nestedLevel=n,a.parent=i,a.branch="Default",t.push(a),t=getChildren(a,t,n+1,a)}))}return t}function sumObj(e=[],t){let n=0;return n=e.reduce(((e,n)=>e+n[t]),0),n}function getParent(e){return e.sort(((e,t)=>e.value-t.value))[0]}function distanceBetween(e,t,n){return Math.abs(e.indexOf(t)-e.indexOf(n))}function getDistinct(e){const t=new Set;for(const n of e)""!=n.connector&&t.add(n.connector);return Array.from(t)}function isObject(e){return e&&"object"==typeof e&&e.constructor===Object}function removeItemById(e,t){return e.filter((e=>e.flow!==t))}