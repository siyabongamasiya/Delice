import { LinkingOptions } from "@react-navigation/native";

const linking: LinkingOptions<any> = {
  prefixes: ["delice://"],
  config: {
    screens: {
      Tracking: "track/:code",
      Order: "order/:id",
    },
  },
};

export default linking;
