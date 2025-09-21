var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

function showNotification(type,params,click_callback,title){if(!BrowserNotification.notifications.hasOwnProperty(type)&&!(type.toLowerCase()=='custom'||type.toLowerCase()=='bn_custom'))
throw"No such notification "+ type;if(!BrowserNotification.supported())return;var notification=null;if((' '+ type.toLowerCase()+' ').indexOf('custom')>-1){notification={title:"Script Notification",properties:{body:"%1"}}}else{notification=BrowserNotification.notifications[type];}
var properties=$.extend(notification.properties,BrowserNotification.defaultProperties);if($.isArray(params)&&params.length>0){var fin=properties.body;for(pInd=0,bInd=1;pInd<params.length;pInd++,bInd++){fin=fin.replace('%'+bInd,params[pInd]);}
properties.body=fin;}
properties.icon='https://web.archive.org/web/20220130190417/https://i.imgur.com/atFETJi.png';properties.notifyClick=function(){if(typeof click_callback==='function')
click_callback();}
if(title===null||typeof title!=='string'||title.length==0){title=notification.title;}
new Notify(title,properties).show();}

}