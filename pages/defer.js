
import { Text } from "@mantine/core";
import { useState, useTransition, Suspense, useCallback } from "react";

export default function Defer() {
  const [content, setContent] = useState("");
  const [value, setInputValue] = useState("");
  const [isRendering, startTransition]  = useTransition()

  return (
    <div>
      <div>
        异步：
        <input
          value={value}
          onChange={(e) => {
            setInputValue(e.target.value);

            startTransition(() => {
              setContent(e.target.value);
            })
          }}
        />

        同步：
        <input
          value={value}
          onChange={(e) => {
            setInputValue(e.target.value);
            setContent(e.target.value);
          }}
        />
      </div>

      {isRendering ? <Text color="red">rendering...</Text> : null}

      <Suspense fallback={'data rendering...'}>
        {Array.from(new Array(30000)).map((_, index) => (
          <div key={index}>{content}</div>
        ))}
      </Suspense>
    </div>
  );
}

function useTransitionState (initialValue) {
  const [value, setValue] = useState(initialValue);
  const [isPending, startTransition] = useTransition()

  const derivedSetValue = useCallback((value) => {
    startTransition(() => {
      setValue(value)
    })
  }, [])

  return [value, derivedSetValue, isPending]
}