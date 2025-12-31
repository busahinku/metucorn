import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import CreatePartyForm from '@/components/CreatePartyForm'

export default function CreatePartyPage() {

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Back Button */}
        <Link
          href="/parties"
          className="inline-flex items-center gap-2 text-[#A1A0A0] hover:text-[#E5E5E5] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Parties
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#E5E5E5] mb-2">Create Watch Party</h1>
          <p className="text-[#A1A0A0] text-sm">Host a party and watch movies together with friends</p>
        </div>

        {/* Form Component */}
        <CreatePartyForm />
      </div>
  )
}


