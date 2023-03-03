import React from "react";

interface ElementWithLabelProps {
  label: string;
  formElement: React.ReactNode;
  orientation: "row" | "column";
}

const ElementWithLabel = ({
  label,
  formElement,
  orientation,
}: ElementWithLabelProps) => {
  return (
    <div style={{ display: "flex", flexDirection: orientation, gap: 5 }}>
      <>{label}</>
      {formElement}
    </div>
  );
};

export default ElementWithLabel;
