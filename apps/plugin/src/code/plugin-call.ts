export type PluginMessage = {
  type: string;
  api: string;
  data: any;
};
export const pluginMessage = (type: string, api: string, data: any) => {
  figma.ui.postMessage({
    type,
    api,
    data,
  });
};
