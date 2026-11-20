import {redirect} from 'next/navigation';
import {requireAdmin} from '@/lib/owner';
import FinalLeaksImport from '@/components/events/FinalLeaksImport';
export default async function Page(){if(!await requireAdmin())redirect('/admin/login');return <FinalLeaksImport/>;}
