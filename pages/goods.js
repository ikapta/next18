import { Button, Stack } from "@mantine/core";
import React, { useState, useRef, useTransition, useLayoutEffect, Suspense } from "react";

const delay = () => new Promise((res) => setTimeout(res, 2000));

// https://17.reactjs.org/docs/concurrent-mode-suspense.html#using-suspense-in-practice
// Suspense integrations like Relay implement
// a contract like this to integrate with React.
// Real implementations can be significantly more complex.
// Don't copy-paste this into your project!
function wrapPromise(promise) {
  let status = "pending";
  let result;
  let suspender = promise.then(
    r => {
      status = "success";
      result = r;
    },
    e => {
      status = "error";
      result = e;
    }
  );
  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    }
  };
}

const cache = {}
function read(param) {
  if (!cache[param]) {
    cache[param] = new Promise(async (resolve) => {
      const data = await fetch(`/api/goods?page=${param}`).then(res => res.json())
      resolve(data);
    }).then((data) => (cache[param] = data));
  }
  const result = cache[param];
  if (result.then) {
    throw result;
  }
  return result;
}

const imgCache = {
  __cache: {},
  getImg(src) {
    if (!src) {
      return;
    }
    if (!this.__cache[src]) {
      this.__cache[src] = Promise.all([
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            this.__cache[src] = true;
            resolve(this.__cache[src]);
          };

          img.src = src;
          setTimeout(() => resolve({}), 2000);
        }),
        delay()
      ]).then(([img]) => {
        this.__cache[src] = img;
      });
    }

    if (this.__cache[src] instanceof Promise) {
      throw this.__cache[src];
    }
    return this.__cache[src];
  }
};

const SuspenseImg = ({ src, crossOrigin = null, ...rest }) => {
  // check if image in cache
  // if not in cache will preload and delay for Suspense capture and put it info cache
  // else direct render Suspense children.
  imgCache.getImg(src);
  return <img crossOrigin={crossOrigin} src={src} {...rest} alt="" />;
};

export default function Goods() {
  const [loading, startTransition] = useTransition();
  const currentPage = useRef(0);
  const [pages, setPages] = useState([]);
  const dataCache = useRef({});
  const [dataSource, setDataSource] = useState();

  const data = pages.length ? pages.flatMap(page => {
    const pageData = dataCache.current[page];
    if (pageData) {
      return pageData.read();
    }
  }) : [];

  console.log(data)

  function loadMore() {
    startTransition(() => {
      currentPage.current = currentPage.current + 1;
      loadByPage(currentPage.current);
      setPages(pages => [...pages, currentPage.current]);
      // setDataSource(
      //   wrapPromise(
      //     fetch(`/api/goods?page=${currentPage.current}`).then(res => res.json())
      //   )
      // );
    });
  }

  function loadByPage(page) {
    dataCache.current[page] = wrapPromise(
      fetch(`/api/goods?page=${page}`).then(res => res.json())
    )
  }

  return (
    <Stack>
      <Button disabled={loading} onClick={loadMore}>
        Load More
      </Button>
      <div>page {currentPage.current}, Loading {"" + loading}</div>

      {data.map((d) => (
        <div>
          <span>{d.name}</span>
          <Suspense fallback="image loading...">
            <SuspenseImg src={d.img} />
          </Suspense>
        </div>
      ))}

      <div>page {currentPage.current}, Loading {"" + loading}</div>
      <Button disabled={loading} onClick={loadMore}>
        Load More
      </Button>
    </Stack>
  );
};