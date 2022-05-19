// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

let dataSource = [
  { id: '1', name: '红烧肉', img: 'https://cube.elemecdn.com/9/46/bf44b4e67fb5234e026ee1fa2f650jpg.jpg?x-oss-process=image/resize,w_40,h_40/format,webp' },
  { id: '2', name: '口水鸡', img: 'https://cube.elemecdn.com/3/c2/cb1a66566b82a7fe2add1614fa27ejpg.jpg?x-oss-process=image/resize,w_40,h_40/format,webp' },
  { id: '3', name: '一碗香', img: 'https://cube.elemecdn.com/b/bc/b894dab4225d5ded99ac7af8c41b4jpeg.jpeg?x-oss-process=image/resize,w_40,h_40/format,webp' },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async (req, res) => {
  const jsonResult = dataSource.map(item => ({...item, id: Math.random().toString(36).slice(2, 11)}))

  await sleep(300);

  return res.status(200).json(jsonResult)
};
