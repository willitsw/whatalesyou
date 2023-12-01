import React from "react";

export const FormFlex = (props) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: props.justify ?? "space-between",
      gap: props.gap ?? 10,
      flexWrap: "wrap",
    }}
  >
    {props.children}
  </div>
);
