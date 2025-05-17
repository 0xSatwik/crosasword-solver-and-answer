import { redirect } from 'next/navigation';

export default function RandomNYTRedirect() {
  // Redirect to the archive page where users can use the random button
  redirect('/daily/nyt-archive');
} 