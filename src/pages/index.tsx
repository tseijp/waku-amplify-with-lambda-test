import { Link } from 'waku';

import { Counter } from '../components/counter';

const { Lambda } = require("@aws-sdk/client-lambda");

const lambda = new Lambda({
  region: process.env.VPC_LAMBDA_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.VPC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.VPC_AWS_SECRET_ACCESS_KEY!,
  },
});

async function invokeLambda() {
  const args = {
    FunctionName: process.env.VPC_LAMBDA_FUNCTION_NAME!,
    Payload: JSON.stringify({}),
  };

  const res = await lambda.invoke(args);
  const buf = Buffer.from(res.Payload!).toString();
  const data = JSON.parse(buf);
  return data;
}

export default async function HomePage() {
  // const data = await getData();
  const data = await invokeLambda();
  return (
    <div>
      <title>{data.title}</title>
      <h1 className="text-4xl font-bold tracking-tight">{data.headline}</h1>
      <p>{data.body}</p>
      <Counter />
      <Link to="/about" className="mt-4 inline-block underline">
        About page
      </Link>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
