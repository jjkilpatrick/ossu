{
    "appDir": "../webapp",
    "baseUrl": "library/js/lib",
    "dir": "../webapp-build",
    //Comment out the optimize line if you want
    //the code minified by UglifyJS
    "optimize": "none",

    // point to the shim config we set up before
    "mainConfigFile": "../webapp/library/js/app.js",

    "modules": [
        //Optimize the application files. jQuery is not 
        //included since it is listed as a network path in the main config file
        {
            "name": "app"
        }
    ]
}