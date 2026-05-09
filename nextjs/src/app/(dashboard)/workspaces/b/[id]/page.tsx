import React from 'react';

export default async function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <h1>Board: {id}</h1>
      {/* Board content will go here */}
    </div>
  );
}
