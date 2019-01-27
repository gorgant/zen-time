// This custom service worker overrides the click action to open a window (which is not supported by default)
// Merge this with the ngsw-worker in the sw-master.js
// Courtesy of: http://jakubcodes.pl/2018/06/13/enhancing-angular-ngsw/
(function () {
  'use strict';
  
  self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
      clients.matchAll({  
        type: "window"  
      })
      .then(function(clientList) {  
        // Check if window is already open, if so, just switch focus
        for (var i = 0; i < clientList.length; i++) {  
          var client = clientList[i];  
          if (client.url == '/' && 'focus' in client)  
            return client.focus();  
        }  
        // Otherwise just open a new window with the url
        if (clients.openWindow && event.notification.data.url) {
          return clients.openWindow(event.notification.data.url);  
        }
      })
    );
  });
}());