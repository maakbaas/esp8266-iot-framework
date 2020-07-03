# Set Up (Walkthrough)

1. Install [PlatformIO](https://platformio.org/) or use their [VS Code extension](https://marketplace.visualstudio.com/items?itemName=platformio.platformio-ide)
    - The extension will automatically install various dependencies (such as the necessary compilers). Be sure to reload the VS Code window according to the prompts.
    - After installation, follow their [Quick Start guide](https://docs.platformio.org/en/latest/integration/ide/vscode.html#quick-start) to deploy an example program to your ESP8266.
    - **You need to make sure that building and deploying programs to your ESP8266 is working before continuing with this guide.**

2. Clone this repository, and `cd` into the directory
    - Note: if you plan to contribute changes, it'll be easier to fork this repo first, then clone your fork.

```
  $ git clone git@github.com:maakbaas/esp8266-iot-framework.git
  $ cd esp8266-iot-framework
```

3. Update the PlatformIO configuration for your specific ESP8266 board
    - You should do this by directly editing `platformio.ini` rather than using the VS Code extension to add a configuration. This is because by default, saving a change via the PlatformIO UI will overwrite the entire config file, and the custom configuration presently there will be lost.
    - If you followed the Quick Start guide from Step 1 above, a `platformio.ini` will have been created with your device info. You can copy/paste that info into this project's `platformio.ini` instead.

3. In `platformio.ini`, comment out everything related to `extra_scripts`
    - The output those scripts generate is committed to this repo, so you only need to uncomment those lines if you want to rebuild this project from source. Review [Getting Started](getting-started.md) for details.
    - For example, the config for a Wemos D1 Mini would look like:

```diff
# platformio.ini
-[env:nodemcuv2]
+[env:d1_mini]
 platform = espressif8266
-board = nodemcuv2
+board = d1_mini
```

4. Run the `PlatformIO: Build` task. It should finish successfully.

5. Run the `PlatformIO: Upload` task.
    - Don't forget to plug your ESP8266 device into your computer first :)

6. Your ESP8266 is now running a Wifi captive portal with the SSID `Generic ESP8266 Firmware`
    - Join that network, and then navigate to `192.168.4.1` in a web browser.
    - The captive portal page should load.

7. Congrats! You have successfully built and deployed the ESP8266 IoT Framework
    - Read the other documentation materials to see what you can do.
