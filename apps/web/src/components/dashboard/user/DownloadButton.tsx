"use client";
import { DownloadIcon, GearIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "components/primitives/Popover";
import { useState } from "react";
import { getDownloadData } from "utils/FileProcessingUtils";
import { LoadingSpinner } from "../../../assets/icons/LoadingSpinner";

export default function DowloadButton({
  deviceId,
  recievedData,
}: {
  deviceId: string;
  recievedData: string;
}) {
  const [delimiter, setDelimiter] = useState(",");
  const [decimal, setDecimal] = useState(".");
  const [isLoading, setIsloading] = useState(false);
  const options = {
    delimiters: [",", ";"],
    decimals: [".", ","],
  };
  return (
    <div className="flex h-10 items-center justify-center">
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="flex h-full w-fit shrink-0 items-center justify-center rounded-l border-r border-r-indigo-400 p-2 text-white lg:bg-accent"
            disabled={isLoading}
          >
            <GearIcon className="size-5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="bg-white">
          <div className="space-y-4">
            <div>
              <p className="mb-2 font-semibold text-gray-700">Delimitador</p>
              <div className="flex gap-2">
                {options.delimiters.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setDelimiter(opt)}
                    disabled={opt === decimal}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm ${
                      delimiter === opt
                        ? "bg-indigo-500 text-white"
                        : opt === decimal
                          ? "cursor-not-allowed bg-gray-300 text-gray-500"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 font-semibold text-gray-700">Decimal</p>
              <div className="flex gap-2">
                {options.decimals.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setDecimal(opt)}
                    disabled={opt === delimiter}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm ${
                      decimal === opt
                        ? "bg-indigo-500 text-white"
                        : opt === delimiter
                          ? "cursor-not-allowed bg-gray-300 text-gray-500"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <button
        className="flex w-44 items-center justify-center gap-2 rounded-r p-2 text-white lg:bg-accent"
        onClick={() => {
          setIsloading(true);
          const downloadData = getDownloadData(
            recievedData,
            delimiter,
            decimal,
          );
          const csvBlob = new Blob([downloadData], {
            type: "text/csv;charset=utf-8",
          });
          const url = window.URL.createObjectURL(csvBlob);

          const link = document.createElement("a");
          link.href = url;
          link.download = `${deviceId}.csv`;

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          window.URL.revokeObjectURL(url);
          setIsloading(false);
        }}
        disabled={isLoading}
      >
        {!isLoading ? (
          <>
            <p className="hidden shrink-0 lg:block">Descargar Datos</p>
            <DownloadIcon className=" size-5 shrink-0 stroke-lightText lg:stroke-white dark:stroke-darkText" />
          </>
        ) : (
          <LoadingSpinner />
        )}
      </button>
    </div>
  );
}
