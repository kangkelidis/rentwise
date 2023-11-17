import React from "react";
import {Spinner} from "@nextui-org/spinner";

export default function Loading() {
  return (
    <div className="flex items-center justify-center">
        <Spinner label="Loading..." color="primary" />

    </div>
  );
}
