
async function loadObjectStore() {
    var idbSupported = false;
    var db;
    var indexdbtransaction;
    var store;

    console.log("STARTING...");
    document.addEventListener("DOMContentLoaded", async function () {

        if ("indexedDB" in window) {
            idbSupported = true;
        }

        if (idbSupported) {
            var openRequest = await indexedDB.open("datastore", 1);

            openRequest.onupgradeneeded = function (e) {
                console.log("running onupgradeneeded");
                var thisDB = e.target.result;

                if (!thisDB.objectStoreNames.contains("jobs")) {
                    console.log("Creating objectstore jobs")
                    thisDB.createObjectStore("jobs");
                }
            }

            openRequest.onsuccess = async function (e) {
                console.log("ObjectStore: Success!");
                db = e.target.result;
                indexdbtransaction = await db.transaction(["jobs"], "readwrite");

                store = await indexdbtransaction.objectStore("jobs");
                let request = await store.get(1);

                request.onsuccess = function (e) {
                    cachedData = e.target.result;
                    if (cachedData != undefined) {
                        let rows = JSON.parse(cachedData);
                        if (rows.length > 0) {
                            console.log("************** num rows in cache = " + rows.length);
                        }
                    }

                    if (document.URL.includes("search")) {
                        searchScreenController();
                    } else if (document.URL.includes("createjobad")) {
                        createJobController();
                    }
                }

                request.onerror = function (e) {
                    console.log("Error");
                    console.dir(e);
                }
            }

            openRequest.onerror = function (e) {
                console.log("Error");
                console.dir(e);
            }

        }

    }, false);
}
// This overwrites the cache with a new cache (supplied as data)
async function addIndexedData(data) {
    // Open up a transaction as usual
    var objectStore = db.transaction(['jobs'], "readwrite").objectStore('jobs');

    // Create another request that inserts the item back into the database
    var updateTitleRequest = objectStore.put(data, 1);

    // Log the transaction that originated this request
    console.log("The transaction that originated this request is " + updateTitleRequest.transaction);

    // When this new request succeeds, run the displayData() function again to update the display
    updateTitleRequest.onsuccess = function () {
        console.log("SUCCESS!!!! WOOOHOOOO");
    };
}
