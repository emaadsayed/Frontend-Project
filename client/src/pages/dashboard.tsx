import { useEffect } from 'react';
import { Header } from '../components/header';
import { Timeline } from '../components/timeline';
import { AddPost } from '../components/addPost'

export function Dashboard() {

  useEffect(() => {
    document.title = 'Instagram';
  }, []);

  return (
    <div className="bg-gray-background">
      <Header />
      <div className="mx-auto max-w-xl">
        <AddPost />
        <Timeline />
      </div>
    </div>
  );
}
