function showNotification(type,params,click_callback,title){if(!BrowserNotification.notifications.hasOwnProperty(type)&&!(type.toLowerCase()=='custom'||type.toLowerCase()=='bn_custom'))
throw"No such notification "+ type;if(!BrowserNotification.supported())return;var notification=null;if((' '+ type.toLowerCase()+' ').indexOf('custom')>-1){notification={title:"Script Notification",properties:{body:"%1"}}}else{notification=BrowserNotification.notifications[type];}
var properties=$.extend(notification.properties,BrowserNotification.defaultProperties);if($.isArray(params)&&params.length>0){var fin=properties.body;for(pInd=0,bInd=1;pInd<params.length;pInd++,bInd++){fin=fin.replace('%'+bInd,params[pInd]);}
properties.body=fin;}
properties.icon='https://i.imgur.com/atFETJi.png';properties.notifyClick=function(){if(typeof click_callback==='function')
click_callback();}
if(title===null||typeof title!=='string'||title.length==0){title=notification.title;}
new Notify(title,properties).show();}
