// This widget will open an Iframe window with buttons to show a toast message and close the window.

import { pluginMessage } from "./plugin-call";

const { widget } = figma;
const { useSyncedState, Text, AutoLayout, Image, SVG } = widget;
const refreshIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
<path d="M12 4V1L8 5L12 9V6C16.42 6 20 9.58 20 14C20 18.42 16.42 22 12 22C7.58 22 4 18.42 4 14H2C2 19.52 6.48 24 12 24C17.52 24 22 19.52 22 14C22 8.48 17.52 4 12 4Z"/>
</svg>`;
const configIcon = `<svg height="800px" width="800px" version="1.1" id="Layer_1" fill="black" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
viewBox="0 0 413.137 413.137" xml:space="preserve">
<g>
<path d="M311.358,136.395H101.779c-4.662,0-8.441,3.779-8.441,8.441v175.749
 c0,4.662,3.779,8.441,8.441,8.441h37.363v59.228c0,13.742,11.14,24.883,24.883,24.883l0,0c13.742,0,24.883-11.14,24.883-24.883
 v-59.228h34.803v59.228c0,13.742,11.14,24.883,24.883,24.883l0,0c13.742,0,24.883-11.14,24.883-24.883v-59.228h37.882
 c4.662,0,8.441-3.779,8.441-8.441V144.836C319.799,140.174,316.02,136.395,311.358,136.395z"/>
<path d="M57.856,136.354L57.856,136.354c-13.742,0-24.883,11.14-24.883,24.883v101.065
 c0,13.742,11.14,24.883,24.883,24.883l0,0c13.742,0,24.883-11.14,24.883-24.883V161.237
 C82.738,147.495,71.598,136.354,57.856,136.354z"/>
<path d="M355.281,136.354L355.281,136.354c-13.742,0-24.883,11.14-24.883,24.883v101.065
 c0,13.742,11.14,24.883,24.883,24.883l0,0c13.742,0,24.883-11.14,24.883-24.883V161.237
 C380.164,147.495,369.024,136.354,355.281,136.354z"/>
<path d="M103.475,124.069h205.692c5.366,0,9.368-4.943,8.266-10.195
 c-6.804-32.428-27.45-59.756-55.465-75.543l17.584-31.727c1.19-2.148,0.414-4.855-1.734-6.045
 c-2.153-1.193-4.856-0.414-6.046,1.734l-17.717,31.966c-14.511-6.734-30.683-10.495-47.734-10.495
 c-17.052,0-33.224,3.761-47.735,10.495L140.869,2.292c-1.191-2.149-3.898-2.924-6.045-1.734c-2.148,1.19-2.924,3.897-1.734,6.045
 l17.584,31.727c-28.015,15.788-48.661,43.115-55.465,75.544C94.106,119.126,98.108,124.069,103.475,124.069z M267.697,76.786
 c0,5.282-4.282,9.565-9.565,9.565c-5.282,0-9.565-4.282-9.565-9.565c0-5.282,4.282-9.565,9.565-9.565
 C263.415,67.221,267.697,71.504,267.697,76.786z M154.508,67.221c5.282,0,9.565,4.282,9.565,9.565c0,5.282-4.282,9.565-9.565,9.565
 c-5.282,0-9.565-4.282-9.565-9.565C144.943,71.504,149.225,67.221,154.508,67.221z"/>
</g>
</svg>`;
type ImageData = {
  src: string;
  height: number;
  width: number;
};
type DeviceData = {
  name: string;
  model: string;
};
function Widget() {
  const [api, setApi] = useSyncedState<string>("api", "http://localhost:3000");
  const [imageData, setImageData] = useSyncedState<ImageData>("imageData", {
    src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAECSURBVHgBpY87TwJBFIXPnVkhbqQQE7UQNWhrsdpLI40FsdSYGGNvbWFhZ2Jj+AWER0fFD6CAhhYCod8GGmCLJRAI2Rl22LDh1RBOc1/fzb0H2EK0WPSfzj+lxG3wMIpAOKpaZfpPpddgKxG510BllSsw6MGAEAYl0zWVMn+L8boEzOXD0oRwrI1vZF9ESRetWO94XMjEDwxb0xttTF6txyNbzbU5mHmWhhtiQ3aGSkQmTH129YJLunJjdQned9DshkbF8d7o4cRiOSB0475ld+JUnTM+/Pb1d0p8ck2eKXN49/OOFfkGOXfCLnjpdamNDfLhgfFdIyE+GOg3AJHHrpoC5YtKfAfixH0AAAAASUVORK5CYII=",
    height: 667,
    width: 375,
  });
  const [device, setDevice] = useSyncedState<DeviceData | null>("device", null);

  const selectDevice = () =>
    new Promise<DeviceData>((resolve) => {
      figma.showUI(__html__);
      pluginMessage("getDevice", api, device);
      figma.ui.onmessage = (msg) => {
        if (msg.type === "setDevice") {
          console.log(JSON.stringify(msg.data));
          setDevice(msg.data);
          figma.ui.close();
          resolve(msg.data);
        }
      };
    });

  const fetchImage = async () => {
    try {
      let currentDevice = device;
      if (!device || !device.name) {
        figma.notify("Please select a device");
        currentDevice = await selectDevice();
      }
      const screenshotRes = await fetch(
        `${api}/adb/screenshot/${currentDevice?.name}`,
        {
          method: "GET",
        }
      );
      const screenshot = await screenshotRes.json();
      const { bitmap, height, width } = screenshot;
      setImageData({
        src: bitmap,
        width: 375,
        height: (height / width) * 375,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AutoLayout direction="vertical">
      <Text fontSize={32}>Current Device:</Text>
      <Text fontSize={32} fontWeight="bold">
        {device ? `model: ${device.model}` : "Unselected"}
      </Text>
      <Text fontSize={32} fontWeight="bold">
        {device ? `name: ${device.name}` : "Unselected"}
      </Text>

      <AutoLayout direction="horizontal">
        <Image
          src={imageData.src}
          width={imageData.width}
          height={imageData.height}
        />
        <AutoLayout direction="vertical">
          <AutoLayout
            direction="horizontal"
            onClick={() => fetchImage()}
            tooltip="Refresh Screenshot"
            hoverStyle={{
              stroke: "#FF0000",
            }}
            padding={{
              vertical: 16,
              horizontal: 16,
            }}
          >
            <SVG src={refreshIcon} width={64} height={64} />
          </AutoLayout>
          <AutoLayout
            direction="horizontal"
            onClick={selectDevice}
            tooltip="Select Device"
            hoverStyle={{
              stroke: "#FF0000",
            }}
            padding={{
              vertical: 16,
              horizontal: 16,
            }}
          >
            <SVG src={configIcon} width={64} height={64} />
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
}

widget.register(Widget);
