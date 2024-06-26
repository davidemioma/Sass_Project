import React from "react";
import { EditorBtns } from "@/lib/constants";

const TwoColPlaceholder = () => {
  const onDragState = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;

    e.dataTransfer.setData("componentType", type);
  };

  return (
    <div
      className="flex h-14 w-28 gap-1 rounded-lg bg-muted/70 p-2"
      draggable
      onDragStart={(e) => {
        onDragState(e, "2Col");
      }}
    >
      <div className="h-full w-full rounded-sm border border-dashed border-muted-foreground/50 bg-muted" />

      <div className="h-full w-full rounded-sm border border-dashed border-muted-foreground/50 bg-muted" />
    </div>
  );
};

export default TwoColPlaceholder;
