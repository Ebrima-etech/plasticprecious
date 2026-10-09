import { redirect } from 'next/navigation';

// Old fixed services page; each service now has its own page under /services/<id>
export default function ServicesDetailRedirect() {
  redirect('/services');
}
