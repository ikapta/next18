import React, { useState, useTransition, useDeferredValue, Suspense } from 'react';
import { ActionIcon, Button, Group, Input, Loader, LoadingOverlay } from '@mantine/core';

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

const DetailBody = ({ detail }) => {
  console.log('detail', detail)
  let dt = {};
  if (detail) {
    dt = detail.read();
  }

  return <div>{dt.id} : {dt.name}</div>
}

function FancyDetail({ id }) {
  const [detail, setDetail] = useState(null);

  const handleSearch = async () => {
    setDetail(wrapPromise(fetch(`/api/todo?id=${id}`).then(res => res.json())));
  }

  return (
    <div>
      <button
        onClick={handleSearch}>
        fetch {id}
      </button>

      <Suspense fallback={"coding..."}>
        <DetailBody detail={detail}></DetailBody>
      </Suspense>
    </div>
  );
}

function FancyTodoItem({ item, onDelete, onDetail }) {

  // console.count('FancyTodoItem', item);

  const handleDelete = () => {
    onDelete(item);
  };

  return (
    <Group component="li" onClick={() => onDetail(item)}>
      {item.id} : {item.name}
      <ActionIcon color="red" onClick={handleDelete}>--</ActionIcon>
    </Group>
  );
}

function FancyTodo() {
  const [data, setData] = React.useState([]);
  const [current, setCurrent] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const deferredSelect = useDeferredValue(current);

  console.count('FancyTodo');

  console.log('searchText:', current);
  console.log('deferredSelect:', deferredSelect);

  const handleInit = () => {
    setLoading(true);
    fetch('/api/todo').then(res => res.json()).then(res => {
      setData(res);
      setLoading(false);
    })
  }

  const handleDelete = (item) => {
    setLoading(true);

    fetch(`/api/todo?id=${item.id}`, {
      method: 'DELETE',
    }).then(res => res.json()).then((jsonResult) => {
      setData(jsonResult);
      setLoading(false);
    })
  };

  const handleDetail = (item) => {
    setCurrent(item);
  }

  const handleAdd = () => {
    setLoading(true);
    fetch('/api/todo', {
      method: 'POST',
    }).then(res => res.json()).then((jsonResult) => {
      setData(jsonResult);
      setLoading(false);
    })
  };

  React.useEffect(() => {
    handleInit();
  }, [])

  return (
    <div>
      {loading ? 'getting all data...' : null}

      <Button onClick={handleAdd}>+</Button>

      <ul>
        {data.map((todo) => {
          return (
            <FancyTodoItem key={todo.id} item={todo}
              onDetail={handleDetail}
             onDelete={handleDelete} />
          );
        })}
      </ul>

      <FancyDetail id={current.id} />
    </div>
  );
}

export default function Todo() {
  return (
      <FancyTodo />
  );
}
