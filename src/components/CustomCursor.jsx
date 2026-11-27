import { useEffect, useRef } from "react";

// Yellow ring that follows the pointer. Position is written straight to the DOM,
// so moving the mouse never re-renders React. Hidden until the first movement.
function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return undefined;

    const handleMove = (event) => {
      cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
      cursor.classList.add("is-active");
    };
    const handleOver = (event) => {
      if (event.target.closest("a, button")) cursor.classList.add("hovering");
    };
    const handleOut = (event) => {
      if (event.target.closest("a, button")) cursor.classList.remove("hovering");
    };
    const handleLeaveWindow = () => cursor.classList.remove("is-active");

    window.addEventListener("pointermove", handleMove, { passive: true });
    document.addEventListener("pointerover", handleOver);
    document.addEventListener("pointerout", handleOut);
    document.documentElement.addEventListener("pointerleave", handleLeaveWindow);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerover", handleOver);
      document.removeEventListener("pointerout", handleOut);
      document.documentElement.removeEventListener("pointerleave", handleLeaveWindow);
    };
  }, []);

  return (
    <div className="custom-cursor" ref={cursorRef} aria-hidden="true">
      <div className="cursor-core" />
    </div>
  );
}

export default CustomCursor;
