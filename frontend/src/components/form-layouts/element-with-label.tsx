import React from "react";

interface ElementWithLabelProps {
  label: string;
  formElement: React.ReactNode;
  orientation: "row" | "column";
  errorMsg?: string;
}

const ElementWithLabel = ({
  label,
  formElement,
  orientation,
  errorMsg = "",
}: ElementWithLabelProps) => {
  return (
    <div style={{ display: "flex", flexDirection: orientation, gap: 5 }}>
      <>{label}</>
      {formElement}
      <div style={{ color: "red" }}>{errorMsg}</div>
    </div>
  );
};

export default ElementWithLabel;
