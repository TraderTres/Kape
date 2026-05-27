import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { User, Mail, Star, MapPin } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  // Fetch full user details from DB
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { addresses: true },
  });

  if (!user) {
    redirect("/auth/login");
  }

  const primaryAddress = user.addresses.find((a) => a.isDefault) || user.addresses[0];

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-3xl font-heading font-bold text-espresso-950">
          My Profile
        </h1>
        <p className="text-espresso-500 mt-1">
          Manage your personal information and addresses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-3xl p-6 shadow-card border border-espresso-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-heading font-bold text-espresso-900">
              Personal Information
            </h2>
            <button className="text-sm font-medium text-gold-600 hover:text-gold-700">
              Edit
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-espresso-50 flex items-center justify-center text-espresso-600 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-espresso-500">Full Name</p>
                <p className="font-medium text-espresso-900">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-espresso-50 flex items-center justify-center text-espresso-600 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-espresso-500">Email Address</p>
                <p className="font-medium text-espresso-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center text-gold-600 shrink-0">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-espresso-500">Loyalty Tier</p>
                <p className="font-medium text-gold-700">{user.loyaltyTier} ({user.loyaltyPoints} points)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-3xl p-6 shadow-card border border-espresso-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-heading font-bold text-espresso-900">
              Shipping Address
            </h2>
            <button className="text-sm font-medium text-gold-600 hover:text-gold-700">
              Edit
            </button>
          </div>

          {primaryAddress ? (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-espresso-50 flex items-center justify-center text-espresso-600 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-espresso-900">{primaryAddress.label}</p>
                <p className="text-sm text-espresso-600 mt-1">
                  {primaryAddress.street}<br />
                  {primaryAddress.barangay}, {primaryAddress.city}<br />
                  {primaryAddress.province}, {primaryAddress.zipCode}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-12 h-12 mx-auto rounded-full bg-espresso-50 flex items-center justify-center text-espresso-400 mb-3">
                <MapPin className="w-6 h-6" />
              </div>
              <p className="text-sm text-espresso-600 mb-4">No shipping address saved yet.</p>
              <button className="px-4 py-2 bg-espresso-900 text-white rounded-xl text-sm font-medium hover:bg-espresso-800 transition-colors">
                Add Address
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
