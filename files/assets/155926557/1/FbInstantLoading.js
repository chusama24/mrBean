var loadGame = function () {
    pc.script.createLoadingScreen(function (app) {

        var isRootInitialized = false;
        var isFbLoaded = false;

        app.on('preload:end', function () {
            console.log('FBInstant => preload:end');
            app.off('preload:progress');
            FBInstant.setLoadingProgress(100);
        });

        app.on('preload:progress', function (value) {
            console.log('FBInstant => preload:progress');
            FBInstant.setLoadingProgress(value * 100);
        });

        app.on('start', function () {
            console.log('FBInstant => startGameAsync');
            app.off('preload:progress');
            FBInstant.setLoadingProgress(100);
            FBInstant.startGameAsync().then(function () {
                console.log('isFbLoaded');
                isFbLoaded = true;
                enableRoot();
            });
        });

        app.on('CustomRootEnabler:initialized', () => {
            isRootInitialized = true;
            console.log('app.fire');
            enableRoot();
        })

        var enableRoot = function () {
            if (isFbLoaded && isRootInitialized)
                app.fire('CustomRoot:SetActive', true);
        };
    });
}

FBInstant.initializeAsync()
    .then(function () {
        loadGame();
    })
    .catch(function (err) {
        console.log('FB already initialized');
        loadGame();
    });
