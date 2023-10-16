import React from "react";

export const AppTitle: React.FC<{ title: string; description: string }> = (
  props
) => {
  return (
    <div className="title text-black ">
      <span style={{ fontWeight: "bold", fontSize: 20 }}>{props.title}</span>
      <span>{props.description}</span>
    </div>
  );
};
