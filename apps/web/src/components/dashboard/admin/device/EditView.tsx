import { Doc, Id } from "convex/_generated/dataModel";
import { type Dispatch, type SetStateAction, useState } from "react";

import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import DeviceFormManager from "../deviceFunctionForm/DeviceFormManager";
import {
  deviceFunctionFormType,
  formSchemaType,
  typeofFunction,
} from "types/deviceFunctionClientData";

import { typeOfEntry, typeOfFormat } from "types/deviceFunctionClientData";
import { generateUUID } from "utils/uuidUtils";
import { useRouter } from "next/navigation";
export default function EditView(props: {
  deviceId: string;
  name: string;
  description: string;
  deviceFunctions: Doc<"deviceFunction">[] | undefined;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}) {
  const deviceFunctions = createDeviceFunctionData(props.deviceFunctions);
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const deleteDevice = useMutation(api.device.deleteDevice);
  const updateDevice = useMutation(api.device.updateDevice);
  const addDeviceFunction = useMutation(api.deviceFunction.createFunction);
  const deleteDeviceFunction = useMutation(
    api.deviceFunction.deleteDeviceFunction,
  );
  const updateDeviceFunction = useMutation(
    api.deviceFunction.updateDeviceFunction,
  );

  function submitHandler(data: formSchemaType) {
    updateDevice({
      name: data.deviceName,
      description: data.deviceDescription,
      deviceId: props.deviceId as Id<"device">,
    });
    props.setIsEditing(false);
  }

  function functionSubmitHandler(data: deviceFunctionFormType) {
    if (data.id === "") {
      data.id = generateUUID();
      const scaleData = data.scaleData.map((data) => data.value);
      addDeviceFunction({
        deviceId: props.deviceId as Id<"device">,
        name: data.name,
        description: data.description,
        command: data.command as string,
        typeOfFunction: data.typeOfFunction,
        blocking: false,
        userInfo: data.userInfo,
        userTypeOfEntry: data.userTypeOfEntry,
        unit: data.unit,
        symbol: "",
        format: data.format,
        maxInterval: Number(data.maxInterval),
        minInterval: Number(data.minInterval),
        scaleData: scaleData,
        message: data.message,
        sendData: data.sendData,
        streaming: false,
      });
    } else {
      const scaleData = data.scaleData.map((data) => data.value);
      updateDeviceFunction({
        functionId: data.id as Id<"deviceFunction">,
        name: data.name,
        description: data.description,
        command: data.command as string,
        typeOfFunction: data.typeOfFunction,
        blocking: false,
        userInfo: data.userInfo,
        userTypeOfEntry: data.userTypeOfEntry,
        unit: data.unit,
        symbol: "",
        format: data.format,
        maxInterval: Number(data.maxInterval),
        minInterval: Number(data.minInterval),
        scaleData: scaleData,
        message: data.message,
        sendData: data.sendData,
        streaming: false,
      });
    }
    setIsCreating(false);
  }

  function functionDeleteHandler(id: string) {
    deleteDeviceFunction({
      deviceFunction: id as Id<"deviceFunction">,
    });
    setIsCreating(false);
  }

  function deviceCancelHandler() {
    props.setIsEditing(false);
  }

  function deviceDeleteHandler() {
    deleteDevice({
      deviceId: props.deviceId as Id<"device">,
    });
    router.replace("/admin");
  }
  const deviceInitialState: formSchemaType = {
    deviceName: props.name,
    deviceDescription: props.description,
  };
  return (
    <DeviceFormManager
      submitHandler={submitHandler}
      functionData={deviceFunctions}
      functionSubmitHandler={functionSubmitHandler}
      setIsCreating={setIsCreating}
      isCreating={isCreating}
      functionDeleteHandler={functionDeleteHandler}
      cancelHandler={deviceCancelHandler}
      deviceInitialState={deviceInitialState}
      deviceDeleteHandler={deviceDeleteHandler}
    />
  );
}

function createDeviceFunctionData(data: Doc<"deviceFunction">[] | undefined) {
  const functionsData = data?.map((functionData) => {
    if (
      !functionData.userTypeOfEntry ||
      !functionData.format ||
      functionData.maxInterval == undefined ||
      functionData.minInterval == undefined ||
      !functionData.scaleData ||
      functionData.unit === undefined
    ) {
      return;
    }
    const scaleData = functionData.scaleData.map((data) => {
      return { value: data };
    });
    const initialState: deviceFunctionFormType = {
      id: functionData._id,
      name: functionData.name,
      description: functionData.description,
      typeOfFunction: functionData.typeOfFunction as typeofFunction,
      command: functionData.command,
      userInfo: functionData.userInfo,
      userTypeOfEntry: functionData.userTypeOfEntry as typeOfEntry,
      unit: functionData.unit,
      format: functionData.format as typeOfFormat,
      maxInterval: functionData.maxInterval.toString(),
      minInterval: functionData.minInterval.toString(),
      scaleData: scaleData,
      message: functionData.message,
      sendData: functionData.sendData,
    };

    return initialState;
  });
  if (functionsData) {
    const definedFunctions: deviceFunctionFormType[] = functionsData?.filter(
      (functionData): functionData is deviceFunctionFormType =>
        functionData !== undefined,
    );

    return definedFunctions;
  }
  return [];
}
