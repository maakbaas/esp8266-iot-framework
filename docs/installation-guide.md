
# Installation Guide

1. Install [PlatformIO](https://platformio.org/) or use their [VS Code extension](https://marketplace.visualstudio.com/items?itemName=platformio.platformio-ide)
    - The extension will automatically install various dependencies (such as the necessary compilers). Be sure to reload the VS Code window according to the prompts.
    - After installation, follow their [Quick Start guide](https://docs.platformio.org/en/latest/integration/ide/vscode.html#quick-start) to deploy an example program to your ESP8266.
    - **You need to make sure that building and deploying programs to your ESP8266 is working before continuing with this guide.**

## Use as a PlatformIO Library (recommended)

It is recommended to use the framework as a platformIO library. if you prefer to work with this repository directly, skip this section, and go to step 5.

2. If you succeeeded to deploy to the ESP8266 in step 1 you have a project folder that contains a platformio.ini file. In this file add the following line:

```ini
lib_deps = ESP8266 IoT Framework
```

3. Use one of the [examples](https://github.com/maakbaas/esp8266-iot-framework/tree/master/examples) in this library as a starting point for the `main.cpp` of your project, and start changing and developing your application.

4. Continue to step 9.

## Use the repository directly

5. Clone this repository, and `cd` into the directory
    - Note: if you plan to contribute changes, it'll be easier to fork this repo first, then clone your fork.

```
  $ git clone git@github.com:maakbaas/esp8266-iot-framework.git
  $ cd esp8266-iot-framework
```

6. Update the PlatformIO configuration for your specific ESP8266 board
    - You should do this by directly editing `platformio.ini` rather than using the VS Code extension to add a configuration. This is because by default, saving a change via the PlatformIO UI will overwrite the entire config file, and the custom configuration presently there will be lost.
    - If you followed the Quick Start guide from Step 1 above, a `platformio.ini` will have been created with your device info. You can copy/paste that info into this project's `platformio.ini` instead.

7. The adaptations in `platformio.ini` for a Wemos D1 Mini would look like:

```diff
# platformio.ini
-[env:nodemcuv2]
+[env:d1_mini]
 platform = espressif8266
-board = nodemcuv2
+board = d1_mini
```

8. You can't build the application straight away, since there is no default `main.cpp` included in the src folder. The reason for this is that the framework is primarily designed as a library. To continue take one of the [examples](https://github.com/maakbaas/esp8266-iot-framework/tree/master/examples) as a starting point for your own `main.cpp`.

## Building the application

9. Run the `PlatformIO: Build` task. It should finish successfully.

10. Run the `PlatformIO: Upload` task.
    - Don't forget to plug your ESP8266 device into your computer first :)

11. Your ESP8266 is now running a Wifi captive portal with the SSID `Generic ESP8266 Firmware`
    - Join that network, and then navigate to `192.168.4.1` in a web browser.
    - The captive portal page should load.

12. Congrats! You have successfully built and deployed the ESP8266 IoT Framework
    - Read the other documentation materials to see what you can do.

## Build options

There are a few build options that you can set from `platformio.ini`, regardless of the chosen approach. These should be added as build flags, such as for example:

```ini
build_flags = -DREBUILD_HTML -DCONFIG_PATH=configuration_filename.json
```

The build flags are optional, since all default generated artefacts are already part of the framework.

**-DREBUILD_HTML:** This pre-build step will re-generate the web interface to `html.h` by simply calling `npm run build`. This is only needed if you make modifications to the GUI. Read more details [here](https://github.com/maakbaas/esp8266-iot-framework/blob/master/docs/getting-started.md#editing-the-web-interface).

**-DREBUILD_CONFIG:** Enabled by default. This build step generates the `config.c` and `config.h` files for the configuration manager based on `gui/js/configuration.js` as described in more detail [here](https://github.com/maakbaas/esp8266-iot-framework/blob/master/docs/config-manager.md).

**-DREBUILD_CERTS:** This build step generates `certificates.h` containing a full root certificate store to enable arbitrary HTTPS requests with the ESP8266. More info on this process can be found [here](https://github.com/maakbaas/esp8266-iot-framework/blob/master/docs/fetch.md).

For this step OpenSSL is needed. On Linux this is probably available by default, on Windows this comes as part of something like MinGW, or Cygwin, but is also installed with the Windows Git client. If needed you can edit the path to OpenSSL at the top of the file:

```python
#path to openssl
openssl = "C:\\msys32\\usr\\bin\\openssl"
```

**-DCONFIG_PATH=configuration.json:** This option defines a custom location for your JSON file. This is needed when using the framework as a library, to allow you to define a JSON file in your project folder. The path is relative to the PlatformIO project root folder. More detail on the JSON file can be found [here](https://github.com/maakbaas/esp8266-iot-framework/blob/master/docs/config-manager.md).

**-DDOMAIN_LIST=google.com,maakbaas.com:** This option defines a comma separated list of domains. When this option is included the `REBUILD_CERTS` option will only include the root certificates in `certificates.h` that are part of this list. The default certificate store when this option is not active contains ~150 certificates, and is roughly 170kB in size. Use this option to reduce the size of the certificate store.