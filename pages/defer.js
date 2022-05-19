
import { Text, Group, Input } from "@mantine/core";
import { useState, useTransition, Suspense, useCallback } from "react";

export default function Defer() {
  const [content, setContent] = useState("");
  const [value, setInputValue] = useState("");
  const [isPending, startTransition]  = useTransition()

  return (
    <div>
      <Group>
        <Input
          label="useTransition to defer render."
          value={value}
          onChange={(e) => {
            setInputValue(e.target.value);

            startTransition(() => {
              setContent(e.target.value);
            })
          }}
        />

        <Input
          label="general usage, without transition."
          value={value}
          onChange={(e) => {
            setInputValue(e.target.value);
            setContent(e.target.value);
          }}
        />
      </Group>

      {isPending ? <Text color="red">rendering...</Text> : null}

      {Array.from(new Array(30000)).map((_, index) => (
        <div key={index}>{content}</div>
      ))}
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