const cacheName = 'v1';

const cacheAssets = [
'/',
'/img/1.jpg',
'/img/2.jpg',
'/img/3.jpg',
'/img/4.jpg',
'/img/5.jpg',
'/img/6.jpg',
'/img/7.jpg',
'/img/8.jpg',
'/img/9.jpg',
'/img/10.jpg',
'/css/styles.css',
'/css/responsiveness.css',
'/js/main.js',
'/js/restaurant_info.js',
'/data/restaurants.json',
'/js/dbhelper.js',
'index.html',
'restaurant.html'
]

// Call Install Event
self.addEventListener('install', e => {
  console.log('Service Worker: Installed');
  // handling caching of the assets - wait until our promise is finished and get rid of the service worker
  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        console.log('Service Worker: Caching Files');
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// Call Activate Event
self.addEventListener('activate', e => {
  console.log('Service Worker: Activated');
  // clean up any old cache
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if(cache !== cacheName){
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      )
    })
  );
});



self.addEventListener("fetch", e => {
console.log('Service Worker: Fetching');
 e.respondWith(
   caches.match(e.request).then(res => {
     return (
       res || fetch(e.request).then( response => {
         return caches.open(cacheName).then( cache => {
           cache.put(e.request, response.clone());
           return response;
         });
       })
     );
   })
 );
});
