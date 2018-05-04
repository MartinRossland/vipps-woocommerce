// IOK 2018-05-04 Call ajax methods determining if and order is complete or not from the "confirm" waiting screen
jQuery(document).ready(function () {
 console.log("Loaded");
 var start = new Date();
 var fkey = jQuery("#fkey").val();
 var fkey404 = false;
 var iterate = 0;
 var statusok = 0;
 var done=0;
 var aminute = 1 * 60 * 1000;
 var data  = jQuery("#vippsdata").serialize();

 function checkStatusReady() {
   console.log("Checking status");
   var now = new Date();
   iterate++;
   // If we have a fkey that hasn"t responed 404 yet and a minute hasn"t passed,  call that directly and often IOK 2018-05-04
   if (!statusok && fkey && !fkey404 && (now.getTime() - start.getTime()) < aminute) {
     // Use post to hide data slightly and to avoid caches
     var url = fkey + "?v="+iterate;
     jQuery.ajax(url,
      {"cache":false,
       "dataType":"json",
       "error": function (xhr, statustext, error) {
         console.log("Error checking status: " + statustext + " : "  + error);
         if (error == 'timeout')  {
          return setTimeout(checkStatusReady,500);
         }
         // Could be other errors but we"ll treat them the same - assume that we can't find the signal and call the ajax method
         fkey404 = true;
         statusok= true;
         setTimeout(checkStatus,500);
       }, 
       "method": "POST", // We realy don"t want this cached
       "success": function (result,statustext, xhr) {
         console.log("Found it!" + statustext + ": "  + result + " : " + (now.getTime() - start.getTime()) + " : " + aminute);
         statusok=result*1;
         if (!statusok) {
           // No result yet, check often as this is cheap
           setTimeout(checkStatusReady,500);
         } else {
           // We have a result, so check what it is
           setTimeout(checkStatus,500);
         }
       },
       "timeout": 3000
     });
   } else {
     // This happens when we've waited for a minute or moe, if we don't have a key and so forth.
     console.log("Doesnt look as if this is going anyhere");
     statusok=1;
     setTimeout(checkStatus,500);
   }
};

 // Actually check order status by calling admin-ajax
 function checkStatus()  {
   jQuery.ajax(vippsajaxurl, {
    "method": "POST",
    "data":data,
    "cache":false,
    "dataType": "json",
    "error": function (xhr, statustext, error) {
      console.log("Error checking order status " + statustext + " " + error);
      done=1;
      jQuery("#waiting").hide();
      jQuery("#success").hide();
      jQuery("#failure").hide();
      jQuery("#error").show();
    },
    "success": function (result, statustext, xhr) {
     if (result["status"] == "waiting") {
       console.log("Waiting reuslt result");
       console.log("Waiting for Vipps callback..");
       // Do some update here.
       done=0;
       setTimeout(checkStatus,3000);
     } else if (result["status"] == "ok") {
       console.log("Success result");
       done=1;
       setTimeout(function () {
         var next = jQuery("#continueToThankYou").attr("href");
         console.log("Redirecting to  " +next );
         window.location.href = next;
       }, 500);
      jQuery("#waiting").hide();
       jQuery("#success").show(); 
       jQuery("#failure").hide();
       jQuery("#error").hide();
     } else if (result["status"]=="failed") {
       console.log("Failure result");
       done=1;
      jQuery("#waiting").hide();
       jQuery("#success").hide(); 
       jQuery("#failure").show();
       jQuery("#error").hide();
     } else {
       console.log("Error result %j",result);
       done=1;
       jQuery("#waiting").hide();
       jQuery("#success").hide(); 
       jQuery("#failure").hide();
       jQuery("#error").show();
     }
    },
    "timeout": 0
   });
 }; 
   
   

 checkStatusReady();

});
