export default async function BoardEditPage({
  params,
}: {
  readonly params: Promise<{ workspaceId: string; boardId: string }>;
}) {
  const { boardId } = await params;

  return (
    <div>
      <h1>Edit Board: {boardId}</h1>
      {/* Edit form will go here */}
    </div>
  );
}
