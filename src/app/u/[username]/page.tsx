export default function MessgaePage({
  params,
}: {
  params: { username: string };
}) {
  return <>Message {params.username}</>;
}
