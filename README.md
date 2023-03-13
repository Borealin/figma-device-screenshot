# Figma Device Screenshot Widget
This repository contains a Figma plugin that allows you to take screenshots on your Android devices and place into a Figma Image.

Which is useful when comparing designs with real devices.
![Figma Device Screenshot Widget](./md.assets/effect.png)
## Preparation
### Install the plugin
Install from https://www.figma.com/community/widget/1204364503317721969
### Install Node (Skip if you already have Node installed)
Install from [Node.js Official Page](https://nodejs.org/)
### Install the cli from npm
[npmjs link](https://www.npmjs.com/package/@borealing/figma-device-screenshot-cli)
```
npm install -g @borealing/figma-device-screenshot-cli
```
### Run the server
```
figma-device-screenshot server [-p <port>]
```
## Usage

### Find the widget
![Find the widget](./md.assets/find-widget.png)

### Add the widget to your frame
![Add the widget to your frame](./md.assets/add-widget.png)

### Refresh devices
![Refresh devices](./md.assets/refresh-devices.png)

### Select a device
![Select a device](./md.assets/select-device.png)

### Refresh screenshots
![Refresh screenshots](./md.assets/refresh-screenshot.png)

### Change API host (optional)
![Change API host](./md.assets/change-api.png)

## Build
To install dependencies, run:
```bash
rush update
```
To build the whole project, run:
```bash
rush build
```
### Build the plugin
To build and watch the plugin, run:
```bash
cd apps/plugin
rushx watch
```


