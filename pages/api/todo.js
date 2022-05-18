// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

let dataSource = [
  { id: '1', name: '吃饭' },
  { id: '2', name: '睡觉' },
  { id: '3', name: '看书' },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async (req, res) => {

  const {
    query: { id, name },
    method,
  } = req

  let jsonResult;

  // load all
  if (!id) {
    jsonResult = dataSource
  }

  // get one by id
  if (id && method === 'GET') {
    jsonResult = dataSource.find(item => item.id === id)
  }

  // create
  if (method === 'POST') {
    const newItem = {
      id: Math.random().toString(36).slice(2, 11),
      name: `type sth you need to do ${Math.random().toString(36).slice(2, 11)}`,
    }
    dataSource = [...dataSource, newItem]

    jsonResult = dataSource
  }

  // delete
  if (method === 'DELETE') {
    dataSource = dataSource.filter(item => item.id !== id)

    jsonResult = dataSource
  }

  await sleep(1);

  return res.status(200).json(jsonResult)
};
