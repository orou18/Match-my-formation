import ProfileForm from "@/components/dashboard/student/profile/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black item-center text-center text-white">Mon profil</h1>
      <ProfileForm />
    </div>
  );
}