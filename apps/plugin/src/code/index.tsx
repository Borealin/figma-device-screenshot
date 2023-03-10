// This widget will open an Iframe window with buttons to show a toast message and close the window.

import { pluginMessage } from "./plugin-call";

const { widget } = figma;
const {
  useSyncedState,
  usePropertyMenu,
  useEffect,
  waitForTask,
  Image,
  AutoLayout,
  Text,
  Input,
} = widget;
const refreshIcon = `<svg width="800" height="800" viewBox="0 0 800 800" fill="white" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M200 141.667H600C624.31 141.667 647.627 151.324 664.817 168.515C682.01 185.706 691.667 209.022 691.667 233.333V566.667C691.667 590.977 682.01 614.293 664.817 631.483C647.627 648.677 624.31 658.333 600 658.333H200C175.688 658.333 152.373 648.677 135.182 631.483C117.991 614.293 108.333 590.977 108.333 566.667V233.333C108.333 209.022 117.991 185.706 135.182 168.515C152.373 151.324 175.688 141.667 200 141.667ZM600 191.667H200C188.949 191.667 178.351 196.057 170.537 203.871C162.723 211.685 158.333 222.283 158.333 233.333V464.333L244.684 361.413C241.624 373.771 240 386.696 240 400C240 413.339 241.632 426.296 244.708 438.684L158.333 542.333V566.667C158.508 577.6 162.975 588.03 170.77 595.7C178.566 603.37 189.064 607.667 200 607.667H355L395.102 559.926C396.729 559.975 398.361 560 400 560C427.692 560 453.741 552.965 476.457 540.584L420 608.333H600C609.45 608.283 618.59 604.973 625.88 598.96C633.17 592.947 638.157 584.6 640 575.333L540.774 476.108C549.557 459.897 555.621 441.998 558.356 423.023L641.667 506.333V233.333C641.667 222.283 637.277 211.685 629.463 203.871C621.65 196.057 611.05 191.667 600 191.667Z"/>
<path d="M520 381.879V286.01L488.196 317.662C463.008 292.665 433.788 280 400.524 280C334.084 280 280.022 333.864 280 400.016C280.011 466.158 334.084 519.979 400.535 520C446.76 520 501.817 496.057 517.676 428.851L517.978 427.539H483.061L482.823 428.27C471.17 463.126 438.09 486.553 400.524 486.553C389.093 486.579 377.77 484.351 367.21 479.998C356.65 475.644 347.063 469.252 339.003 461.191C330.9 453.178 324.476 443.646 320.103 433.147C315.729 422.648 313.492 411.391 313.523 400.027C313.523 352.313 352.559 313.49 400.546 313.49C422.912 313.49 439.874 319.726 464.586 341.153L423.594 381.89H520V381.879Z"/>
</svg>
`;
const configIcon = `<svg width="800" height="800" viewBox="0 0 800 800" fill="white" xmlns="http://www.w3.org/2000/svg">
<path d="M528.75 75H271.25C245.743 75.066 221.3 85.2278 203.264 103.264C185.228 121.3 175.066 145.743 175 171.25V628.75C175.066 654.257 185.228 678.7 203.264 696.736C221.3 714.772 245.743 724.934 271.25 725H528.75C554.257 724.934 578.7 714.772 596.736 696.736C614.772 678.7 624.934 654.257 625 628.75V171.25C624.934 145.743 614.772 121.3 596.736 103.264C578.7 85.2278 554.257 75.066 528.75 75ZM271.25 125H528.75C541.016 125 552.78 129.873 561.454 138.546C570.127 147.22 575 158.984 575 171.25V175H225V171.25C225 158.984 229.873 147.22 238.546 138.546C247.22 129.873 258.984 125 271.25 125ZM575 628.75C575 634.824 573.804 640.838 571.479 646.449C569.155 652.06 565.748 657.159 561.454 661.454C557.159 665.748 552.06 669.155 546.449 671.479C540.838 673.804 534.824 675 528.75 675H271.25C265.176 675 259.162 673.804 253.551 671.479C247.94 669.155 242.841 665.748 238.546 661.454C234.252 657.159 230.845 652.06 228.521 646.449C226.196 640.838 225 634.824 225 628.75V625H575V628.75ZM225 575V225H575V575H225Z"/>
<path d="M500 384.899V305.008L473.497 331.385C452.507 310.554 428.156 300 400.437 300C345.07 300 300.018 344.886 300 400.013C300.009 455.131 345.07 499.982 400.446 500C438.967 500 484.848 480.047 498.063 424.042L498.315 422.949H469.218L469.019 423.559C459.308 452.605 431.742 472.127 400.437 472.127C390.911 472.149 381.475 470.292 372.675 466.665C363.875 463.037 355.886 457.71 349.169 450.992C342.417 444.315 337.063 436.372 333.419 427.623C329.774 418.874 327.91 409.493 327.936 400.022C327.936 360.261 360.466 327.908 400.455 327.908C419.094 327.908 433.228 333.105 453.822 350.961L419.661 384.908H500V384.899Z"/>
</svg>
`;
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
  const devicePlaceholder = {
    name: "placeholder",
    model: "placeholder",
  };
  const [devices, setDevices] = useSyncedState<DeviceData[]>("devices", [
    devicePlaceholder,
  ]);
  const [device, setDevice] = useSyncedState<DeviceData>(
    "device",
    devicePlaceholder
  );
  usePropertyMenu(
    [
      {
        itemType: "action",
        icon: refreshIcon,
        tooltip: "Refresh Screenshot",
        propertyName: "refreshScreenshot",
      },
      {
        itemType: "action",
        icon: configIcon,
        tooltip: "Refresh Devices",
        propertyName: "refreshDevices",
      },
      {
        itemType: "dropdown",
        tooltip: "Select Device",
        propertyName: "device",
        options: devices.map((device) => ({
          option: device.name,
          label: device.model,
        })),
        selectedOption: device?.name ?? "",
      },
    ],
    async ({ propertyName, propertyValue }) => {
      if (propertyName === "refreshScreenshot") {
        await fetchImage();
      } else if (propertyName === "refreshDevices") {
        await fetchDevices();
      } else if (propertyName === "device") {
        const device = devices.find((device) => device.name === propertyValue);
        if (device) {
          await selectDevice(device);
        }
      }
    }
  );

  const selectDevice = async (selectedDevice: DeviceData) => {
    setDevice(selectedDevice);
    await fetchImage(selectedDevice);
  };

  const fetchDevices = async () => {
    try {
      const devicesRes = await fetch(`${api}/adb/devices`, {
        method: "GET",
      });
      let newDevices: DeviceData[] = await devicesRes.json();
      if (newDevices.length === 0) {
        newDevices = [devicePlaceholder];
      }
      const targetDevice =
        newDevices.find((item) => item.name === device.name) ?? newDevices[0];
      setDevices(newDevices);
      await selectDevice(targetDevice);
    } catch (e) {
      console.log(e);
      await alertServerShouldOpen()
    }
  };

  const fetchImage = async (selectedDevice: DeviceData = device) => {
    try {
      const currentDevice = selectedDevice;
      if (currentDevice == devicePlaceholder) {
        figma.notify("Please refresh devices");
        return;
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
      await alertServerShouldOpen()
    }
  };

  const alertServerShouldOpen = () => {
    return new Promise<DeviceData>((resolve) => {
      figma.showUI(__html__)
      pluginMessage("setAPI", api, {});
      figma.ui.onmessage = (msg) => {
        if (msg.type === "setDevice") {
          console.log(JSON.stringify(msg.data));
          setDevice(msg.data);
          figma.ui.close();
          resolve(msg.data);
        }
      };
    })
  };

  return (
    <AutoLayout direction="vertical">
      <Image
        src={imageData.src}
        width={imageData.width}
        height={imageData.height}
      />
      <AutoLayout direction="horizontal">
        <Text>API URL:</Text>
        <Input
          value={api}
          onTextEditEnd={(event) => {
            setApi(event.characters);
          }}
        />
      </AutoLayout>
    </AutoLayout>
  );
}

widget.register(Widget);
