//var a = [];
//a.push(JSON.parse(localStorage.getItem('session')));
//localStorage.setItem('session', JSON.stringify(a));
function SaveDataToLocalStorage(data)
{
    var a = [];
    // Parse the serialized data back into an aray of objects
    a = JSON.parse(localStorage.getItem('session')) || [];
    // Push the new data (whether it be an object or anything else) onto the array
    a.push(data);
    // Alert the array value
    //alert(a);  // Should be something like [Object array]
    // Re-serialize the array back into a string and store it in localStorage
    localStorage.setItem('session', JSON.stringify(a));
  
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
         document.getElementById("demo").innerHTML = this.responseText;
      }
   };
        xhttp.open("GET", "https://muf2nupa71.execute-api.ap-south-1.amazonaws.com/crome_extention_time_track?time=2021-03-09T12:16:19.212Z&email=prakhars472@gmail.com&url=http://www.marcorpsa.com/ee/", true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      //var input = localStorage.getItem("session");
        xhttp.send();
    
   
}

//localStorage.setItem('obj', JSON.stringify(obj));

// Retrieve the object from storage
//var retrievedObject = localStorage.getItem('obj');

//console.log('retrievedObject: ', JSON.parse(retrievedObject));
 var obj={
    "url":null,
    "time":null,
    "mail-id":null
 }


chrome.tabs.onUpdated.addListener((tabId,change,tab) => {
   if(change.url){
    //console.log(change.url);
    var key1=change.url;
    obj["url"]=key1;
    var d=new Date();
    var value_=d.toISOString();
    obj["time"]=value_;
    chrome.identity.getProfileUserInfo(function(info) { obj["mail-id"] = info.email; });

    
       SaveDataToLocalStorage(obj);  
       chrome.storage.local.get(["url","time","mail-id"],function(result){
          console.log(result);
      

      });

  
   
    
    //console.log(tab);
   }
});


chrome.tabs.onActivated.addListener(function(activeInfo) {
  // how to fetch tab url using activeInfo.tabid
  chrome.tabs.get(activeInfo.tabId, function(tab){
     //console.log(tab.url);
     var key2=tab.url;
     var d1=new Date();
     obj["url"]=key2;
     var val=d1.toISOString();
     obj["time"]=val;
     chrome.identity.getProfileUserInfo(function(info) { obj["mail-id"] = info.email; });
     SaveDataToLocalStorage(obj);
       chrome.storage.local.get(["url","time"],function(result){
          console.log(result);
       
      });
   
     
  });
}); 
/*
var a = [];
a.push(JSON.parse(localStorage.getItem('session')));
localStorage.setItem('session', JSON.stringify(a));
function SaveDataToLocalStorage(data)
{
    var a = [];
    // Parse the serialized data back into an aray of objects
    a = JSON.parse(localStorage.getItem('session')) || [];
    // Push the new data (whether it be an object or anything else) onto the array
    a.push(data);
    // Alert the array value
    alert(a);  // Should be something like [Object array]
    // Re-serialize the array back into a string and store it in localStorage
    localStorage.setItem('session', JSON.stringify(a));
}

localStorage.setItem('obj', JSON.stringify(obj));

// Retrieve the object from storage
var retrievedObject = localStorage.getItem('obj');

console.log('retrievedObject: ', JSON.parse(retrievedObject));
*/

  


/*
chrome.tabs.onCreated.addListener(function(tab){
    chrome.storage.local.set({tab.id : performance.now()});
}); 

const tabTimeObjectKey = "tabTimeObject";
const lastActiveTabkey ="lastActiveTab";

/*chrome.runtime.onInstalled.addListener(function(){
   chrome.declarativeContent.onPageChanged.removeRules(undefined,function() {
      chrome.declarativeContent.onPageChanged.addRules([{
         conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {},
         })
         ],
            actions: [new chrome.declarativeContent.showPageAction()]
      }]);
   });
});*/
/*
chrome.windows.onFocusChanged.addListener(function(windowId){
   if(windowId== chrome.windows.WINDOW_ID_NONE){
      processTabChange(false);
   } else{
      processTabChange(true);
   }
});

function processTabChange(isWindowActive){
   chrome.tabs.query({'active':true},function(tabs){

      console.log("isWindowActive:" + isWindowActive);
      console.log(tabs);

      if(tabs.length > 0 && tabs[0]!=null){
         let currentTab=tabs[0];
         let url=currentTab.url;
         let title=currentTab.title;
         let hostName = url;
         try{
            let urlObject= new URL(url);
            hostName=urlObject.hostname;
         } catch(e){
            console.log(`could not construct url from ${currentTab.url}, error: ${e}`);
         }
         chrome.storage.local.get([tabTimeObjectKey,lastActiveTabkey],function(result){
            let lastActiveTabString= result[lastActiveTabkey];
            let tabTimeObjectString= result[tabTimeObjectKey];
            //console.log("background.js, get result");
            console.log(result);
            tabTimeObject ={};
            if(tabTimeObjectString !=null){
               tabTimeObject = JSON.parse(tabTimeObjectString);
            }
            lastActiveTab={};
            if(lastActiveTabString !=null){
               lastActiveTab =JSON.parse(lastActiveTabString);
            }
            
            if(lastActiveTab.hasOwnProperty("url") && lastActiveTab.hasOwnProperty("lastDateVal")){
               let lastUrl = lastActiveTab["url"];
               let currentDateVal_= Date.now();
               let passedSeconds= (currentDateVal_ - lastActiveTab["lastDateVal"]) * 0.001;

               if(tabTimeObject.hasOwnProperty(lastUrl)){
                  let lastUrlObjectInfo = tabTimeObject[lastUrl];
                  if(lastUrlObjectInfo.hasOwnProperty("trackedSeconds")){
                     lastUrlObjectInfo["trackedSeconds"] = lastUrlObjectInfo["trackedSeconds"]+passedSeconds;
                  } else {
                     lastUrlObjectInfo["trackedSeconds"]= passedSeconds;
                  }
                  lastUrlObjectInfo["lastDateVal"]=currentDateVal_;
               } else{

                  let newUrlInfo = {url: lastUrl, trackedSeconds: passedSeconds, lastDateVal:currentDateVal_};
                  tabTimeObject[lastUrl]= newUrlInfo;
               }
            }

            let currentDateValue = Date.now();

            let lastTabInfo= {"url": hostName, "lastDateVal": currentDateValue};
            if(!isWindowActive){
               lastTabInfo = {};
            }
            let newLastTabObject ={};
            newLastTabObject[lastActiveTabkey] = JSON.stringify(lastTabInfo);

            chrome.storage.local.set(newLastTabObject, function(){
               console.log("lastActiveTab stored:" + hostName);
               const tabTimesObjectString = JSON.stringify(tabTimeObject);
               let newTabTimesObject ={};
               newTabTimesObject[tabTimeObjectKey]=tabTimesObjectString;
               chrome.storage.local.set(newTabTimesObject, function(){

               });

         });
      });
    }
   });

}
   function onTabTrack(activeInfo){
      let tabId= activeInfo.tabId;
      let windowId= activeInfo.windowId;

   }

   chrome.tabs.onActivated.addListener(onTabTrack);

*/