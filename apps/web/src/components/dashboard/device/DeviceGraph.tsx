"use client";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Button } from "components/primitives/Button";
import GraphComponent from "components/primitives/Chart";
import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandInput,
  CommandList,
} from "components/primitives/Command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "components/primitives/Popover";
import { useEffect, useState } from "react";
import type { graphData } from "utils/FileProcessingUtils";
import { generateUUID } from "utils/uuidUtils";

export default function DeviceGraph(props: { graphData: graphData }) {
  const [openX, setOpenX] = useState(false);
  const [openY, setOpenY] = useState(false);
  const [xDataIdentifier, setXDataIdentifier] = useState<string | undefined>(
    undefined,
  );
  const [yDataIdentifier, setYDataIdentifier] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    if (props.graphData && props.graphData.cleanLabels.length > 0) {
      if (!xDataIdentifier || !yDataIdentifier) {
        const label = props.graphData.cleanLabels[0];
        setXDataIdentifier("N° puntos");
        setYDataIdentifier(label);
      }
    } else {
      setXDataIdentifier(undefined);
      setYDataIdentifier(undefined);
    }
  });

  if (
    !xDataIdentifier ||
    !yDataIdentifier ||
    props.graphData.cleanLabels.length <= 0
  ) {
    return;
  }

  let dataX: number[] = [];
  let dataY: number[] = [];

  if (xDataIdentifier === "N° puntos") {
    dataX = props.graphData.dataPoints[yDataIdentifier].data.map(
      (value, index) => index,
    );
    dataY = props.graphData.dataPoints[yDataIdentifier].data;
  } else {
    dataX = props.graphData.dataPoints[xDataIdentifier].data;
    dataY = props.graphData.dataPoints[yDataIdentifier].data;
  }

  return (
    <div className="relative  flex w-full flex-col ">
      <div className="flex items-center justify-center gap-8 pb-4">
        <Popover open={openX} onOpenChange={setOpenX}>
          <span className="mr-2 text-xs italic text-lightText lg:text-sm dark:text-darkText">
            Eje x:
          </span>
          <PopoverTrigger asChild>
            <Button role="combobox" className="p-0">
              {xDataIdentifier === yDataIdentifier
                ? "N° puntos"
                : xDataIdentifier}
              <CaretSortIcon className=" h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit bg-white p-0 dark:bg-dark">
            <Command>
              <CommandInput placeholder="Busca una variable" />
              <CommandEmpty>No se encontraron</CommandEmpty>
              <CommandList>
                {props.graphData.cleanLabels.map((label, index) => {
                  if (label === yDataIdentifier) {
                    return <></>;
                  }
                  return (
                    <CommandItem
                      key={generateUUID()}
                      value={label}
                      onSelect={(value) => {
                        setXDataIdentifier(value);
                        setOpenX(false);
                      }}
                    >
                      {label}

                      <CheckIcon
                        className={`ml-auto h-4 w-4 ${xDataIdentifier === label ? "opacity-100" : "opacity-0"}`}
                      />
                    </CommandItem>
                  );
                })}
                <CommandItem
                  value={"N° puntos"}
                  onSelect={(value) => {
                    setXDataIdentifier(value);
                    setOpenX(false);
                  }}
                >
                  N° puntos
                  <CheckIcon
                    className={`ml-auto h-4 w-4 ${xDataIdentifier === "N° puntos" ? "opacity-100" : "opacity-0"}`}
                  />
                </CommandItem>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Popover open={openY} onOpenChange={setOpenY}>
          <span className="mr-2 text-xs italic text-lightText lg:text-sm dark:text-darkText">
            Eje y:
          </span>
          <PopoverTrigger asChild>
            <Button role="combobox" className="p-0">
              {yDataIdentifier}
              <CaretSortIcon className=" h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit bg-white p-0 dark:bg-dark">
            <Command>
              <CommandInput placeholder="Busca una variable" />
              <CommandEmpty>No se encontraron</CommandEmpty>
              <CommandList>
                {props.graphData.cleanLabels.map((label, index) => {
                  if (label === xDataIdentifier) {
                    return <></>;
                  }
                  return (
                    <CommandItem
                      key={generateUUID()}
                      value={label}
                      onSelect={(value) => {
                        setYDataIdentifier(value);
                        setOpenY(false);
                      }}
                    >
                      {label}

                      <CheckIcon
                        className={`ml-auto h-4 w-4 ${xDataIdentifier === label ? "opacity-100" : "opacity-0"}`}
                      />
                    </CommandItem>
                  );
                })}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="max-h-96 w-full">
        <GraphComponent dataX={dataX} dataY={dataY} label={yDataIdentifier} />
      </div>
    </div>
  );
}
