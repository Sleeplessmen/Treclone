import React from 'react';

interface BoardPageProps {
  readonly params: Promise<{ readonly id: string }>;
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { id } = await params;
  return <div>Board: {id}</div>;
}
