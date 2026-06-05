import { Alert } from "react-native";

const errorAlert = (item: string) => {
  const firstLetter = item.charAt(0).toUpperCase();
  Alert.alert(
    `${firstLetter}${item.slice(1).toLowerCase()} not selected`,
    `Please select ${item.toLowerCase()}`,
    undefined,
    {
      cancelable: true,
    },
  );
};

export default errorAlert;
