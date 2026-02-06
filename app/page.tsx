import { redirect } from 'next/navigation'

export default function RootPage() {
  // Always redirect to Hebrew homepage
  redirect('/he')
}
